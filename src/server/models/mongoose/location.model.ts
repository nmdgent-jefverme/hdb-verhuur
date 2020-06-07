import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';

interface ILocation extends Document {
  name: string;
  street: string;
  city: string;
  number: number
  lat: number;
  lon: number;
}

const locationSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      max: 128,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    lat: {
      type: Number,
      required: true,
    },
    lon: {
      type: Number,
      required: true,
    }
  },
);
const Location = mongoose.model<ILocation>('Location', locationSchema);
locationSchema.virtual('id').get(function(this: ILocation) {
  return this._id;
});

export { ILocation, Location, locationSchema };
