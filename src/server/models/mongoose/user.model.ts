import { default as mongoose, Schema, Document } from 'mongoose';
import { default as bcrypt } from 'bcrypt';

import { ICamion } from './camion.model';

interface ILocalProvider {
  password: string;
}

interface IFacebookProvider {
  id: string;
  token: string;
}

interface IProfile {
  firstName: string;
  lastName: string;
  address: string;
  number: number;
  appartment?: string;
  city: string;
  postalCode: number;
  gender: string;
}

interface IUser extends Document {
  email: string;
  _createdAt: number;
  _modifiedAt: number;
  _deletedAt: number;

  localProvider?: ILocalProvider;
  facebookProvider?: IFacebookProvider;

  role: string;
  profile?: IProfile;

  _camionId: ICamion['_id'];

  comparePassword(candidatePassword: String, cb: Function): void;
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
    localProvider: {
      password: {
        type: String,
        required: false,
      },
    },
    facebookProvider: {
      id: {
        type: String,
        required: false,
      },
      token: {
        type: String,
        required: false,
      },
    },
    role: {
      type: String,
      enum: ['user', 'administrator'],
      default: 'user',
      required: true,
    },
    profile: {
      firstName: String,
      lastName: String,
      gender: String,
      address: String,
      number: String,
      appartment: String,
      city: String,
      postalCode: Number,
    },
    _camionId: {
      type: Schema.Types.ObjectId,
      ref: 'Camion',
      required: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre<IUser>('save', function(next) {
  const user: IUser = this as IUser;

  if (!user.isModified('localProvider.password')) return next();

  try {
    return bcrypt.genSalt(10, (errSalt, salt) => {
      if (errSalt) throw errSalt;

      bcrypt.hash(user.localProvider.password, salt, (errHash, hash) => {
        if (errHash) throw errHash;

        user.localProvider.password = hash;
        return next();
      });
    });
  } catch (err) {
    return next(err);
  }
});

userSchema.virtual('id').get(function(this: IUser) {
  return this._id;
});

userSchema.virtual('camion', {
  ref: 'Camion',
  localField: '_camionId',
  foreignField: '_id',
  justOne: true,
});

userSchema.methods.comparePassword = function(
  candidatePassword: String,
  cb: Function,
) {
  const user = this;
  bcrypt.compare(
    candidatePassword,
    user.localProvider.password,
    (err, isMatch) => {
      if (err) return cb(err, null);
      return cb(null, isMatch);
    },
  );
};

const User = mongoose.model<IUser>('User', userSchema);

export { IUser, User, userSchema };
