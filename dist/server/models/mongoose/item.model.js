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
const mongoose_paginate_1 = __importDefault(require("mongoose-paginate"));
const itemSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: false,
    },
    _locationId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Location',
        required: false,
    },
    _tagIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Tag', required: false }],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.itemSchema = itemSchema;
itemSchema.virtual('id').get(function () {
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
itemSchema.plugin(mongoose_paginate_1.default);
const Item = mongoose_1.default.model('Item', itemSchema);
exports.Item = Item;
//# sourceMappingURL=item.model.js.map