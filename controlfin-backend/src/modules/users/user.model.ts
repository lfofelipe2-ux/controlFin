import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string | undefined;
  googleId?: string;
  isEmailVerified: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function (this: any): boolean {
        return !this.googleId; // Password required only if not Google OAuth user
      },
      minlength: 8,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    avatar: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (_doc, ret) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (ret as any).password;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Indexes for performance (email and googleId already have unique indexes)
userSchema.index({ createdAt: -1 });

export const User = mongoose.model<IUser>('User', userSchema);
