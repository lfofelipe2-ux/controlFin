import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { IUser, User } from '../users/user.model';
import {
  ChangePasswordInput,
  LoginInput,
  RefreshTokenInput,
  RegisterInput,
  UpdateProfileInput,
} from './auth.schemas';

// JWT configuration
const JWT_SECRET = env.jwtSecret;
const JWT_REFRESH_SECRET = env.jwtRefreshSecret;
const JWT_EXPIRES_IN = env.jwtExpiresIn;
const JWT_REFRESH_EXPIRES_IN = env.jwtRefreshExpiresIn;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: Omit<IUser, 'password'>;
  tokens: AuthTokens;
}

export class AuthService {
  /**
   * Hash password using bcrypt
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare password with hash
   */
  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate JWT access token
   */
  private generateAccessToken(userId: string): string {
    return jwt.sign(
      {
        userId,
        type: 'access',
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN,
        issuer: 'controlfin-api',
        audience: 'controlfin-client',
      }
    );
  }

  /**
   * Generate JWT refresh token
   */
  private generateRefreshToken(userId: string): string {
    return jwt.sign(
      {
        userId,
        type: 'refresh',
      },
      JWT_REFRESH_SECRET,
      {
        expiresIn: JWT_REFRESH_EXPIRES_IN,
        issuer: 'controlfin-api',
        audience: 'controlfin-client',
      }
    );
  }

  /**
   * Generate both access and refresh tokens
   */
  private generateTokens(userId: string): AuthTokens {
    return {
      accessToken: this.generateAccessToken(userId),
      refreshToken: this.generateRefreshToken(userId),
    };
  }

  /**
   * Verify JWT token
   */
  private verifyToken(token: string, secret: string): { userId: string; type: 'access' | 'refresh'; iat: number; exp: number } {
    try {
      return jwt.verify(token, secret) as {
        userId: string;
        type: 'access' | 'refresh';
        iat: number;
        exp: number;
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterInput): Promise<AuthResponse> {
    const { email, password, firstName, lastName } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(password);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isEmailVerified: false,
    });

    await user.save();

    // Generate tokens
    const tokens = this.generateTokens(user._id.toString());

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  /**
   * Login user
   */
  async login(data: LoginInput): Promise<AuthResponse> {
    const { email, password } = data;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user has password (not OAuth only)
    if (!user.password) {
      throw new Error('Please use Google login for this account');
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = this.generateTokens(user._id.toString());

    // Update last login
    user.lastLoginAt = new Date();
    await user.save();

    return {
      user: user.toJSON(),
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  async refreshToken(data: RefreshTokenInput): Promise<AuthTokens> {
    const { refreshToken } = data;

    // Verify refresh token
    const decoded = this.verifyToken(refreshToken, JWT_REFRESH_SECRET);

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new tokens
    return this.generateTokens(user._id.toString());
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(_userId: string): Promise<void> {
    // In a production app, you might want to blacklist the refresh token
    // For now, we'll just return success
    // TODO: Implement token blacklisting with Redis
  }

  /**
   * Get current user profile
   */
  async getProfile(userId: string): Promise<Omit<IUser, 'password'>> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return user.toJSON();
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileInput): Promise<Omit<IUser, 'password'>> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update fields
    if (data.firstName !== undefined) user.firstName = data.firstName;
    if (data.lastName !== undefined) user.lastName = data.lastName;
    if (data.avatar !== undefined) {
      user.avatar = data.avatar ? data.avatar : undefined;
    }

    await user.save();

    return user.toJSON();
  }

  /**
   * Change password
   */
  async changePassword(userId: string, data: ChangePasswordInput): Promise<void> {
    const { currentPassword, newPassword } = data;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.password) {
      throw new Error('Cannot change password for OAuth accounts');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedNewPassword = await this.hashPassword(newPassword);
    user.password = hashedNewPassword;

    await user.save();
  }

  /**
   * Verify JWT access token
   */
  verifyAccessToken(token: string): { userId: string; type: 'access' | 'refresh'; iat: number; exp: number } {
    return this.verifyToken(token, JWT_SECRET);
  }

  /**
   * Verify JWT refresh token
   */
  verifyRefreshToken(token: string): { userId: string; type: 'access' | 'refresh'; iat: number; exp: number } {
    return this.verifyToken(token, JWT_REFRESH_SECRET);
  }
}

export const authService = new AuthService();
