import { default as mongoose, Document, Schema } from 'mongoose';
import { IItem } from './item.model';

interface ICamion extends Document {
  rented_from: number;
  rented_to: number;

  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;
  _itemIds: Array<IItem['_id']>;
}

const camionSchema: Schema = new Schema(
  {
    rented_from: { type: Number, required: true },
    rented_to: { type: Number, required: true },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },

    _itemIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Item',
      required: false,
    }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

camionSchema.virtual('id').get(function(this: ICamion) {
  return this._id;
});

camionSchema.virtual('items', {
  ref: 'Item',
  localField: '_itemIds',
  foreignField: '_id',
  justOne: false,
});

const Camion = mongoose.model<ICamion>('Camion', camionSchema);

export { ICamion, Camion, camionSchema };
