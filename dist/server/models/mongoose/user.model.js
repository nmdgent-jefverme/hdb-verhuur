"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Camion',
        required: false,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.userSchema = userSchema;
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('localProvider.password'))
        return next();
    try {
        return bcrypt_1.default.genSalt(10, (errSalt, salt) => {
            if (errSalt)
                throw errSalt;
            bcrypt_1.default.hash(user.localProvider.password, salt, (errHash, hash) => {
                if (errHash)
                    throw errHash;
                user.localProvider.password = hash;
                return next();
            });
        });
    }
    catch (err) {
        return next(err);
    }
});
userSchema.virtual('id').get(function () {
    return this._id;
});
userSchema.virtual('camion', {
    ref: 'Camion',
    localField: '_camionId',
    foreignField: '_id',
    justOne: true,
});
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    const user = this;
    bcrypt_1.default.compare(candidatePassword, user.localProvider.password, (err, isMatch) => {
        if (err)
            return cb(err, null);
        return cb(null, isMatch);
    });
};
const User = mongoose_1.default.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=user.model.js.map