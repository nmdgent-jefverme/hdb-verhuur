import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';
import { ICategory } from './category.model';
import { ILocation } from './location.model';
import { ITag } from './tag.model';

interface IItem extends Document {
  name: string;
  rented: boolean;
  price: number;
  description: string;
  imageUrl: string;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  _categoryId: ICategory['_id'];
  _locationId: ILocation['_id'];

  _tagIds: Array<ITag['id']>;
}

interface IItemModel extends PaginateModel<IItem> {}

const itemSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rented: {
      type: Boolean,
      required: true,
      lowercase: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },

    _categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    _locationId: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: false,
    },

    _tagIds: [{ type: Schema.Types.ObjectId, ref: 'Tag', required: false }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

itemSchema.virtual('id').get(function(this: IItem) {
  return this._id;
});
itemSchema.virtual('category', {
  ref: 'Category',
  localField: '_categoryId',
  foreignField: '_id',
  justOne: true,
});

itemSchema.virtual('location', {
  ref: 'Location',
  localField: '_locationId',
  foreignField: '_id',
  justOne: true,
});

itemSchema.virtual('tags', {
  ref: 'Tag',
  localField: '_tagIds',
  foreignField: '_id',
  justOne: false,
});

itemSchema.plugin(mongoosePaginate);
const Item = mongoose.model<IItem, IItemModel>('Item', itemSchema);

export { IItem, Item, itemSchema };
