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
const locationSchema = new mongoose_1.Schema({
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
    },
});
exports.locationSchema = locationSchema;
const Location = mongoose_1.default.model('Location', locationSchema);
exports.Location = Location;
locationSchema.virtual('id').get(function () {
    return this._id;
});
//# sourceMappingURL=location.model.js.map