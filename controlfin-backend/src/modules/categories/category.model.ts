import { Document, Schema, model } from 'mongoose';

export interface ICategory extends Document {
  spaceId: string;
  name: string;
  type: 'income' | 'expense' | 'transfer';
  color: string;
  icon: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
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
      enum: ['income', 'expense', 'transfer'],
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
    parentId: {
      type: String,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
CategorySchema.index({ spaceId: 1, type: 1, isActive: 1 });
CategorySchema.index({ spaceId: 1, name: 1 });
CategorySchema.index({ spaceId: 1, parentId: 1 });

// Virtual for full category path (if hierarchical)
CategorySchema.virtual('fullPath').get(function () {
  // This would be populated with parent category names
  return this.name;
});

// Pre-save middleware to validate data
CategorySchema.pre('save', function (next) {
  // Ensure name is not empty
  if (!this.name.trim()) {
    return next(new Error('Category name is required'));
  }

  // Ensure color is valid hex
  if (!/^#[0-9A-F]{6}$/i.test(this.color)) {
    return next(new Error('Color must be a valid hex color'));
  }

  // Ensure icon is not empty
  if (!this.icon.trim()) {
    return next(new Error('Icon is required'));
  }

  next();
});

// Ensure unique category names within a space and type
CategorySchema.index({ spaceId: 1, type: 1, name: 1 }, { unique: true });

export const CategoryModel = model<ICategory>('Category', CategorySchema);
