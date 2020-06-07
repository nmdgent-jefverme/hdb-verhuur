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
const slug_1 = __importDefault(require("slug"));
const CategorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: false, max: 128 },
    slug: { type: String, lowercase: true, unique: false, required: true },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
CategorySchema.methods.slugify = function () {
    this.slug = slug_1.default(this.name);
};
CategorySchema.pre('validate', function (next) {
    if (!this.slug) {
        this.slugify();
    }
    return next();
});
CategorySchema.virtual('id').get(function () {
    return this._id;
});
const Category = mongoose_1.default.model('Category', CategorySchema);
exports.Category = Category;
//# sourceMappingURL=category.model.js.map