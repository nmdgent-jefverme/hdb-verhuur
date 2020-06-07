"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("../../models/mongoose");
class LocationController {
    constructor() {
        this.index = async (req, res, next) => {
            const locations = await mongoose_1.Location.find().exec();
            return res.status(200).json(locations);
        };
    }
}
exports.default = LocationController;
//# sourceMappingURL=locationController.js.map