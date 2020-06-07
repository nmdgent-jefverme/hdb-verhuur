import mongoose, { Schema, Document, Model } from 'mongoose';
import { default as slug } from 'slug';

interface ICategory extends Document {
  name: string;
  slug: string;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  slugify(): void;
}

interface ICategoryModel extends Model<ICategory> {}

const CategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: false, max: 128 },
    slug: { type: String, lowercase: true, unique: false, required: true },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

CategorySchema.methods.slugify = function() {
  this.slug = slug(this.name);
};

CategorySchema.pre<ICategory>('validate', function(next) {
  if (!this.slug) {
    this.slugify();
  }
  return next();
});

CategorySchema.virtual('id').get(function(this: ICategory) {
  return this._id;
});

const Category = mongoose.model<ICategory, ICategoryModel>(
  'Category',
  CategorySchema,
);

export { ICategory, Category };
