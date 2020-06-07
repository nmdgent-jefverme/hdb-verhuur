"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const camionSchema = new mongoose_1.Schema({
    rented_from: { type: Number, required: true },
    rented_to: { type: Number, required: true },
    _createdAt: { type: Number, required: true, default: Date.now() },
    _modifiedAt: { type: Number, required: false, default: null },
    _deletedAt: { type: Number, required: false, default: null },
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
exports.camionSchema = camionSchema;
camionSchema.virtual('id').get(function () {
    return this._id;
});
camionSchema.virtual('items', {
    ref: 'Item',
    localField: '_itemIds',
    foreignField: '_id',
    justOne: false,
});
const Camion = mongoose_1.default.model('Camion', camionSchema);
exports.Camion = Camion;
//# sourceMappingURL=camion.model.js.map