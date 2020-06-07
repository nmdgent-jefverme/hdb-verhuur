"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("../../models/mongoose");
class TagController {
    constructor() {
        this.index = async (req, res, next) => {
            const tags = await mongoose_1.Tag.find().exec();
            return res.status(200).json(tags);
        };
    }
}
exports.default = TagController;
//# sourceMappingURL=tagController.js.map