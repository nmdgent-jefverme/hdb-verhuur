"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("../../models/mongoose");
class CategoryController {
    constructor() {
        this.index = async (req, res, next) => {
            const categories = await mongoose_1.Category.find().exec();
            return res.status(200).json(categories);
        };
    }
}
exports.default = CategoryController;
//# sourceMappingURL=categoryController.js.map