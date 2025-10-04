// JSON Schema definitions for Fastify validation

// Registration schema
export const registerSchema = {
  type: 'object',
  required: ['email', 'password', 'firstName', 'lastName'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      minLength: 1,
      maxLength: 255,
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 128,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$',
    },
    firstName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    lastName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
  },
  additionalProperties: false,
};

// Login schema
export const loginSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      minLength: 1,
    },
    password: {
      type: 'string',
      minLength: 1,
    },
  },
  additionalProperties: false,
};

// Refresh token schema
export const refreshTokenSchema = {
  type: 'object',
  required: ['refreshToken'],
  properties: {
    refreshToken: {
      type: 'string',
      minLength: 1,
    },
  },
  additionalProperties: false,
};

// Password reset request schema
export const passwordResetRequestSchema = {
  type: 'object',
  required: ['email'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
      minLength: 1,
    },
  },
  additionalProperties: false,
};

// Password reset schema
export const passwordResetSchema = {
  type: 'object',
  required: ['token', 'password'],
  properties: {
    token: {
      type: 'string',
      minLength: 1,
    },
    password: {
      type: 'string',
      minLength: 8,
      maxLength: 128,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$',
    },
  },
  additionalProperties: false,
};

// Change password schema
export const changePasswordSchema = {
  type: 'object',
  required: ['currentPassword', 'newPassword'],
  properties: {
    currentPassword: {
      type: 'string',
      minLength: 1,
    },
    newPassword: {
      type: 'string',
      minLength: 8,
      maxLength: 128,
      pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$',
    },
  },
  additionalProperties: false,
};

// Update profile schema
export const updateProfileSchema = {
  type: 'object',
  properties: {
    firstName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    lastName: {
      type: 'string',
      minLength: 1,
      maxLength: 50,
    },
    avatar: {
      type: 'string',
      format: 'uri',
    },
  },
  additionalProperties: false,
};

// Type definitions for TypeScript
export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface PasswordResetRequestInput {
  email: string;
}

export interface PasswordResetInput {
  token: string;
  password: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

// Note: TS interfaces for inputs are declared above; no duplicate aliases needed.
