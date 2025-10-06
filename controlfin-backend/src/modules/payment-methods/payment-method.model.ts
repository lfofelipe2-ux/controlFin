import { Document, Schema, model } from 'mongoose';

export interface IPaymentMethod extends Document {
  spaceId: string;
  name: string;
  type: 'cash' | 'card' | 'bank' | 'digital' | 'crypto' | 'other';
  color: string;
  icon: string;
  isActive: boolean;
  metadata?: {
    lastFourDigits?: string;
    bankName?: string;
    accountType?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PaymentMethodSchema = new Schema<IPaymentMethod>(
  {
    spaceId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
      index: true,
    },
    type: {
      type: String,
      enum: ['cash', 'card', 'bank', 'digital', 'crypto', 'other'],
      required: true,
      index: true,
    },
    color: {
      type: String,
      required: true,
      match: /^#[0-9A-F]{6}$/i,
    },
    icon: {
      type: String,
      required: true,
      maxlength: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    metadata: {
      lastFourDigits: {
        type: String,
        maxlength: 4,
      },
      bankName: {
        type: String,
        maxlength: 100,
      },
      accountType: {
        type: String,
        maxlength: 50,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
PaymentMethodSchema.index({ spaceId: 1, type: 1, isActive: 1 });
PaymentMethodSchema.index({ spaceId: 1, name: 1 });

// Virtual for display name with metadata
PaymentMethodSchema.virtual('displayName').get(function () {
  if (this.metadata?.lastFourDigits) {
    return `${this.name} (****${this.metadata.lastFourDigits})`;
  }
  return this.name;
});

// Virtual for type display
PaymentMethodSchema.virtual('typeDisplay').get(function () {
  return this.type.charAt(0).toUpperCase() + this.type.slice(1);
});

// Pre-save middleware to validate data
PaymentMethodSchema.pre('save', function (next) {
  // Ensure name is not empty
  if (!this.name.trim()) {
    return next(new Error('Payment method name is required'));
  }

  // Ensure color is valid hex
  if (!/^#[0-9A-F]{6}$/i.test(this.color)) {
    return next(new Error('Color must be a valid hex color'));
  }

  // Ensure icon is not empty
  if (!this.icon.trim()) {
    return next(new Error('Icon is required'));
  }

  // Validate last four digits if provided
  if (this.metadata?.lastFourDigits && !/^\d{4}$/.test(this.metadata.lastFourDigits)) {
    return next(new Error('Last four digits must be exactly 4 digits'));
  }

  next();
});

// Ensure unique payment method names within a space
PaymentMethodSchema.index({ spaceId: 1, name: 1 }, { unique: true });

export const PaymentMethodModel = model<IPaymentMethod>('PaymentMethod', PaymentMethodSchema);
