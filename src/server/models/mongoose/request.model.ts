import { default as mongoose, Document, Schema, PaginateModel } from 'mongoose';
import { default as mongoosePaginate } from 'mongoose-paginate';
import { IItem } from './item.model';
import { IUser } from './user.model';

enum Status {
  completed = 'completed',
  rejected = 'rejected',
  pending = 'pending',
  accepted = 'accepted',
}

interface IRequest extends Document {
  rented_from: number;
  rented_to: number;
  status: Status;
  totalPrice: number;

  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  _userId: IUser['_id'];
  _itemIds: Array<IItem['_id']>;
}

interface IRequestModel extends PaginateModel<IRequest> {}

const requestSchema: Schema = new Schema(
  {
    rented_from: { type: Number, required: true },
    rented_to: { type: Number, required: true },
    status: { type: Status, required: true },
    totalPrice: { type: Number, required: true },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },

    _userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    _itemIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Item',
        required: false,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

requestSchema.virtual('id').get(function(this: IRequest) {
  return this._id;
});

requestSchema.virtual('user', {
  ref: 'User',
  localField: '_userId',
  foreignField: '_id',
  justOne: true,
});

requestSchema.virtual('items', {
  ref: 'Item',
  localField: '_itemIds',
  foreignField: '_id',
  justOne: false,
});

requestSchema.plugin(mongoosePaginate);
const Request = mongoose.model<IRequest, IRequestModel>(
  'Request',
  requestSchema,
);

export { IRequest, Request, requestSchema, Status };
