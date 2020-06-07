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
var Status;
(function (Status) {
    Status["completed"] = "completed";
    Status["rejected"] = "rejected";
    Status["pending"] = "pending";
    Status["accepted"] = "accepted";
})(Status || (Status = {}));
exports.Status = Status;
const requestSchema = new mongoose_1.Schema({
    rented_from: { type: Number, required: true },
    rented_to: { type: Number, required: true },
    status: { type: Status, required: true },
    totalPrice: { type: Number, required: true },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
    _userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    _itemIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Item',
            required: false,
        },
    ],
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
exports.requestSchema = requestSchema;
requestSchema.virtual('id').get(function () {
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
requestSchema.plugin(mongoose_paginate_1.default);
const Request = mongoose_1.default.model('Request', requestSchema);
exports.Request = Request;
//# sourceMappingURL=request.model.js.map