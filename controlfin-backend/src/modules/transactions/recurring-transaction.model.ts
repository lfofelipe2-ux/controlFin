import { Document, Schema, model } from 'mongoose';

export interface IRecurringTransaction extends Document {
  spaceId: string;
  userId: string;
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  description: string;
  categoryId: string;
  paymentMethodId: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  startDate: Date;
  endDate?: Date;
  nextDueDate: Date;
  isActive: boolean;
  metadata: {
    location?: string;
    notes?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const RecurringTransactionSchema = new Schema<IRecurringTransaction>(
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
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: true,
    },
    interval: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    startDate: {
      type: Date,
      required: true,
      index: true,
    },
    endDate: {
      type: Date,
      index: true,
    },
    nextDueDate: {
      type: Date,
      required: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
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
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
RecurringTransactionSchema.index({ spaceId: 1, userId: 1, isActive: 1 });
RecurringTransactionSchema.index({ spaceId: 1, nextDueDate: 1, isActive: 1 });
RecurringTransactionSchema.index({ spaceId: 1, type: 1, isActive: 1 });

// Virtual for frequency display
RecurringTransactionSchema.virtual('frequencyDisplay').get(function () {
  const frequencyMap = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    yearly: 'Yearly',
  };
  return frequencyMap[this.frequency];
});

// Virtual for next occurrence description
RecurringTransactionSchema.virtual('nextOccurrenceDescription').get(function () {
  const now = new Date();
  const diffTime = this.nextDueDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Overdue';
  } else if (diffDays === 0) {
    return 'Due today';
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else {
    return `Due in ${diffDays} days`;
  }
});

// Pre-save middleware to validate data
RecurringTransactionSchema.pre('save', function (next) {
  // Ensure amount is positive
  if (this.amount <= 0) {
    return next(new Error('Amount must be greater than 0'));
  }

  // Ensure description is not empty
  if (!this.description.trim()) {
    return next(new Error('Description is required'));
  }

  // Ensure interval is positive
  if (this.interval <= 0) {
    return next(new Error('Interval must be greater than 0'));
  }

  // Ensure start date is not in the future
  if (this.startDate > new Date()) {
    return next(new Error('Start date cannot be in the future'));
  }

  // Ensure end date is after start date if provided
  if (this.endDate && this.endDate <= this.startDate) {
    return next(new Error('End date must be after start date'));
  }

  // Calculate next due date if not provided
  if (!this.nextDueDate) {
    this.nextDueDate = this.startDate;
  }

  next();
});

// Note: Methods will be implemented in service layer to avoid TypeScript issues

export const RecurringTransactionModel = model<IRecurringTransaction>(
  'RecurringTransaction',
  RecurringTransactionSchema
);
