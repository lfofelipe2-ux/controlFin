/**
 * OAuth Authentication Service
 *
 * Handles Google OAuth 2.0 authentication flow including:
 * - User profile retrieval from Google
 * - Account creation and linking
 * - JWT token generation for OAuth users
 */

import logger from '../../utils/logger';
import { IUser, User } from '../users/user.model';
import { authService } from './auth.service';

export interface GoogleProfile {
  id: string;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  verified_email: boolean;
}

export interface OAuthUserData {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  isEmailVerified: boolean;
}

/**
 * Create or update user from Google OAuth profile
 */
export const createOrUpdateUserFromGoogle = async (
  profile: GoogleProfile
): Promise<{ user: IUser; isNewUser: boolean }> => {
  try {
    // Check if user exists by Google ID
    let user = await User.findOne({ googleId: profile.id });
    let isNewUser = false;

    if (user) {
      // Update existing user with latest Google profile data
      user.email = profile.email;
      user.firstName = profile.given_name;
      user.lastName = profile.family_name;
      user.avatar = profile.picture;
      user.isEmailVerified = profile.verified_email;
      user.updatedAt = new Date();

      await user.save();
    } else {
      // Check if user exists by email (for account linking)
      const existingUser = await User.findOne({ email: profile.email });

      if (existingUser) {
        // Link Google account to existing user
        existingUser.googleId = profile.id;
        existingUser.avatar = profile.picture;
        existingUser.isEmailVerified = profile.verified_email;
        existingUser.updatedAt = new Date();

        await existingUser.save();
        user = existingUser;
      } else {
        // Create new user
        user = new User({
          googleId: profile.id,
          email: profile.email,
          firstName: profile.given_name,
          lastName: profile.family_name,
          avatar: profile.picture,
          isEmailVerified: profile.verified_email,
          // No password for OAuth users
          password: undefined,
        });

        await user.save();
        isNewUser = true;
      }
    }

    return { user, isNewUser };
  } catch (error) {
    logger.error('Error creating/updating user from Google profile:', error);
    throw new Error('Failed to create or update user account');
  }
};

/**
 * Generate JWT tokens for OAuth user
 */
export const generateOAuthTokens = async (
  user: IUser
): Promise<{
  accessToken: string;
  refreshToken: string;
}> => {
  try {
    const tokens = authService.generateTokensForOAuth(user._id.toString());
    return tokens;
  } catch (error) {
    logger.error('Error generating OAuth tokens:', error);
    throw new Error('Failed to generate authentication tokens');
  }
};

/**
 * Validate Google OAuth profile data
 */
export const validateGoogleProfile = (profile: unknown): profile is GoogleProfile => {
  return (
    profile !== null &&
    typeof profile === 'object' &&
    'id' in profile &&
    'email' in profile &&
    'name' in profile &&
    'given_name' in profile &&
    'family_name' in profile &&
    'verified_email' in profile &&
    typeof (profile as GoogleProfile).id === 'string' &&
    typeof (profile as GoogleProfile).email === 'string' &&
    typeof (profile as GoogleProfile).name === 'string' &&
    typeof (profile as GoogleProfile).given_name === 'string' &&
    typeof (profile as GoogleProfile).family_name === 'string' &&
    typeof (profile as GoogleProfile).verified_email === 'boolean'
  );
};

/**
 * Extract user data from Google profile
 */
export const extractUserDataFromProfile = (profile: GoogleProfile): OAuthUserData => {
  return {
    googleId: profile.id,
    email: profile.email,
    firstName: profile.given_name,
    lastName: profile.family_name,
    avatar: profile.picture,
    isEmailVerified: profile.verified_email,
  };
};

/**
 * Handle OAuth callback and return user with tokens
 */
export const handleOAuthCallback = async (
  profile: GoogleProfile
): Promise<{
  user: IUser;
  tokens: { accessToken: string; refreshToken: string };
  isNewUser: boolean;
}> => {
  try {
    // Validate profile data
    if (!validateGoogleProfile(profile)) {
      throw new Error('Invalid Google profile data');
    }

    // Create or update user
    const { user, isNewUser } = await createOrUpdateUserFromGoogle(profile);

    // Generate tokens
    const tokens = await generateOAuthTokens(user);

    return {
      user,
      tokens,
      isNewUser,
    };
  } catch (error) {
    logger.error('Error handling OAuth callback:', error);
    throw new Error('OAuth authentication failed');
  }
};

/**
 * Check if user can use OAuth (not blocked or restricted)
 */
export const canUserUseOAuth = async (email: string): Promise<boolean> => {
  try {
    const user = await User.findOne({ email });

    // If user doesn't exist, they can use OAuth
    if (!user) {
      return true;
    }

    // If user exists and has password, they can link OAuth
    if (user.password) {
      return true;
    }

    // If user exists but no password, they must use OAuth
    return true;
  } catch (error) {
    logger.error('Error checking OAuth eligibility:', error);
    return false;
  }
};

export default {
  createOrUpdateUserFromGoogle,
  generateOAuthTokens,
  validateGoogleProfile,
  extractUserDataFromProfile,
  handleOAuthCallback,
  canUserUseOAuth,
};
