"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("../../models/mongoose");
class CamionController {
    constructor() {
        this.show = async (req, res, next) => {
            const { id } = req.params;
            const request = await mongoose_1.Camion.findById(id)
                .populate('items')
                .exec();
            return res.status(200).json(request);
        };
        this.update = async (req, res, next) => {
            const { id } = req.params;
            try {
                const camionUpdate = {
                    rented_from: req.body.rented_from,
                    rented_to: req.body.rented_to,
                    _userId: req.body.userId,
                    _itemIds: req.body._itemIds,
                    _id: req.body._id,
                };
                const camion = await mongoose_1.Camion.findOneAndUpdate({ _id: id }, camionUpdate, {
                    new: true,
                }).exec();
                if (!camion) {
                    throw new Error('Camion niet gevonden.');
                }
                return res.status(200).json(camion);
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.default = CamionController;
//# sourceMappingURL=CamionController.js.map