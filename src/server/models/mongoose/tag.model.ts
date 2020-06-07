import { default as mongoose, Schema, Document, PaginateModel } from 'mongoose';

interface ITag extends Document {
  name: string;
}

const tagSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      max: 128,
    },
  },
);
const Tag = mongoose.model<ITag>('Tag', tagSchema);

tagSchema.virtual('id').get(function(this: ITag) {
  return this._id;
});

export { ITag, Tag, tagSchema };
