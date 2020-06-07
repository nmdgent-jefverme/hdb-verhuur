"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("../../models/mongoose");
class RequestController {
    constructor() {
        this.index = async (req, res, next) => {
            try {
                const { limit, skip } = req.query;
                let requests;
                if (limit && skip) {
                    const options = {
                        limit: parseInt(limit, 10) || 10,
                        page: parseInt(skip, 10) || 1,
                        sort: { _createdAt: -1 },
                        populate: ['items', 'user'],
                    };
                    requests = await mongoose_1.Request.paginate({}, options);
                }
                else {
                    requests = await mongoose_1.Request.find()
                        .sort({ _createdAt: -1 })
                        .populate('items')
                        .populate('user')
                        .exec();
                }
                return res.status(200).json(requests);
            }
            catch (err) {
                next(err);
            }
        };
        this.show = async (req, res, next) => {
            const { id } = req.params;
            const request = await mongoose_1.Request.findById(id)
                .populate('items')
                .populate('user')
                .exec();
            return res.status(200).json(request);
        };
        this.store = async (req, res, next) => {
            try {
                const requestCreate = new mongoose_1.Request({
                    rented_from: req.body.rented_from,
                    rented_to: req.body.rented_to,
                    status: req.body.status,
                    totalPrice: req.body.totalPrice,
                    _userId: req.body.userId,
                    _itemIds: req.body.itemsArray,
                });
                const request = await requestCreate.save();
                return res.status(201).json(request);
            }
            catch (error) {
                next(error);
            }
        };
        this.update = async (req, res, next) => {
            const { id } = req.params;
            try {
                const requestUpdate = {
                    status: req.body.status,
                };
                const updatedRequest = await mongoose_1.Request.findOneAndUpdate({ _id: id }, requestUpdate, {
                    new: true,
                }).exec();
                if (!updatedRequest) {
                    throw new Error('Camion niet gevonden.');
                }
                return res.status(200).json(updatedRequest);
            }
            catch (err) {
                next(err);
            }
        };
    }
}
exports.default = RequestController;
//# sourceMappingURL=RequestController.js.map