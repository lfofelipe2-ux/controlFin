import { Document, Schema, model } from 'mongoose';

export interface ITransaction extends Document {
  spaceId: string;
  userId: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  categoryId: string;
  paymentMethodId: string;
  date: Date;
  tags: string[];
  isRecurring: boolean;
  recurringId?: string;
  metadata: {
    location?: string;
    notes?: string;
    attachments?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    spaceId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['income', 'expense', 'transfer'],
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      maxlength: 500,
    },
    categoryId: {
      type: String,
      required: true,
      index: true,
    },
    paymentMethodId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    tags: [
      {
        type: String,
        maxlength: 50,
      },
    ],
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringId: {
      type: String,
      index: true,
    },
    metadata: {
      location: {
        type: String,
        maxlength: 200,
      },
      notes: {
        type: String,
        maxlength: 1000,
      },
      attachments: [
        {
          type: String,
        },
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
TransactionSchema.index({ spaceId: 1, userId: 1, date: -1 });
TransactionSchema.index({ spaceId: 1, type: 1, date: -1 });
TransactionSchema.index({ spaceId: 1, categoryId: 1, date: -1 });
TransactionSchema.index({ spaceId: 1, paymentMethodId: 1, date: -1 });
TransactionSchema.index({ spaceId: 1, tags: 1 });
TransactionSchema.index({ spaceId: 1, isRecurring: 1 });
TransactionSchema.index({ spaceId: 1, amount: -1 });

// Virtual for formatted amount
TransactionSchema.virtual('formattedAmount').get(function () {
  return this.amount.toFixed(2);
});

// Virtual for transaction type display
TransactionSchema.virtual('typeDisplay').get(function () {
  return this.type.charAt(0).toUpperCase() + this.type.slice(1);
});

// Pre-save middleware to validate data
TransactionSchema.pre('save', function (next) {
  // Ensure amount is positive
  if (this.amount <= 0) {
    return next(new Error('Amount must be greater than 0'));
  }

  // Ensure description is not empty
  if (!this.description.trim()) {
    return next(new Error('Description is required'));
  }

  // Ensure tags are unique and trimmed
  this.tags = [...new Set(this.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0))];

  next();
});

export const TransactionModel = model<ITransaction>('Transaction', TransactionSchema);
