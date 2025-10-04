/**
 * Account Linking Service
 *
 * Handles the process of linking Google OAuth accounts with existing user accounts
 * and managing account conflicts during the authentication process.
 */

import { z } from 'zod';
import { User } from '../users/user.model';
import { authService, AuthTokens } from './auth.service';

// Validation schemas
export const accountConflictCheckSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const accountLinkingSchema = z.object({
  email: z.string().email('Invalid email address'),
  googleId: z.string().min(1, 'Google ID is required'),
  googleProfile: z.object({
    name: z.string().min(1, 'Name is required'),
    given_name: z.string().min(1, 'Given name is required'),
    family_name: z.string().min(1, 'Family name is required'),
    picture: z.string().url().optional(),
  }),
});

export interface AccountConflictInfo {
  hasExistingAccount: boolean;
  existingAccountEmail: string;
  canLink: boolean;
  reason?: string;
}

export interface AccountLinkingRequest {
  email: string;
  googleId: string;
  googleProfile: {
    name: string;
    given_name: string;
    family_name: string;
    picture?: string;
  };
}

export interface AccountLinkingResponse {
  success: boolean;
  message: string;
  user: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    isEmailVerified: boolean;
    googleId?: string;
    createdAt: string;
    updatedAt: string;
  };
  tokens: AuthTokens;
}

/**
 * Check if there's an account conflict for the given email
 */
export const checkAccountConflict = async (email: string): Promise<AccountConflictInfo> => {
  try {
    // Find existing user by email
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return {
        hasExistingAccount: false,
        existingAccountEmail: email,
        canLink: false,
      };
    }

    // Check if user already has Google account linked
    if (existingUser.googleId) {
      return {
        hasExistingAccount: true,
        existingAccountEmail: email,
        canLink: false,
        reason: 'Account already has Google OAuth linked',
      };
    }

    // Check if user has password (can link)
    if (existingUser.password) {
      return {
        hasExistingAccount: true,
        existingAccountEmail: email,
        canLink: true,
      };
    }

    // User exists but no password and no Google ID (shouldn't happen)
    return {
      hasExistingAccount: true,
      existingAccountEmail: email,
      canLink: false,
      reason: 'Account exists but cannot be linked',
    };
  } catch (error) {
    console.error('Error checking account conflict:', error);
    throw new Error('Failed to check account conflict');
  }
};

/**
 * Link Google account with existing user account
 */
export const linkGoogleAccount = async (
  request: AccountLinkingRequest
): Promise<AccountLinkingResponse> => {
  try {
    // Find existing user
    const existingUser = await User.findOne({ email: request.email });

    if (!existingUser) {
      throw new Error('User not found');
    }

    // Check if user already has Google account
    if (existingUser.googleId) {
      throw new Error('Account already has Google OAuth linked');
    }

    // Update user with Google information
    existingUser.googleId = request.googleId;
    existingUser.avatar = request.googleProfile.picture;
    existingUser.isEmailVerified = true; // Google verified email
    existingUser.updatedAt = new Date();

    await existingUser.save();

    // Generate tokens
    const tokens = authService.generateTokensForOAuth(existingUser._id.toString());

    return {
      success: true,
      message: 'Account linked successfully',
      user: {
        _id: existingUser._id.toString(),
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        ...(existingUser.avatar && { avatar: existingUser.avatar }),
        isEmailVerified: existingUser.isEmailVerified,
        ...(existingUser.googleId && { googleId: existingUser.googleId }),
        createdAt: existingUser.createdAt.toISOString(),
        updatedAt: existingUser.updatedAt.toISOString(),
      },
      tokens,
    };
  } catch (error) {
    console.error('Error linking Google account:', error);
    throw new Error('Failed to link Google account');
  }
};

/**
 * Create new account with Google OAuth (when user chooses not to link)
 */
export const createAccountWithGoogle = async (
  request: AccountLinkingRequest
): Promise<AccountLinkingResponse> => {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: request.email }, { googleId: request.googleId }],
    });

    if (existingUser) {
      throw new Error('Account already exists');
    }

    // Create new user
    const newUser = new User({
      googleId: request.googleId,
      email: request.email,
      firstName: request.googleProfile.given_name,
      lastName: request.googleProfile.family_name,
      avatar: request.googleProfile.picture,
      isEmailVerified: true, // Google verified email
    });

    await newUser.save();

    // Generate tokens
    const tokens = authService.generateTokensForOAuth(newUser._id.toString());

    return {
      success: true,
      message: 'Account created successfully',
      user: {
        _id: newUser._id.toString(),
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        ...(newUser.avatar && { avatar: newUser.avatar }),
        isEmailVerified: newUser.isEmailVerified,
        ...(newUser.googleId && { googleId: newUser.googleId }),
        createdAt: newUser.createdAt.toISOString(),
        updatedAt: newUser.updatedAt.toISOString(),
      },
      tokens,
    };
  } catch (error) {
    console.error('Error creating Google account:', error);
    throw new Error('Failed to create Google account');
  }
};

export default {
  checkAccountConflict,
  linkGoogleAccount,
  createAccountWithGoogle,
};
