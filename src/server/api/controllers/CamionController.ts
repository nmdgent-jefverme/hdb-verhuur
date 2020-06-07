import { NextFunction, Request, Response } from 'express';
import { ICamion, Camion } from '../../models/mongoose';
import { Mongoose } from 'mongoose';

class CamionController {
  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const { id } = req.params;
    const request: ICamion = await Camion.findById(id)
      .populate('items')
      .exec();
    return res.status(200).json(request);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const camionUpdate = {
        rented_from: req.body.rented_from,
        rented_to: req.body.rented_to,
        _userId: req.body.userId,
        _itemIds: req.body._itemIds,
        _id: req.body._id,
      };
      const camion = await Camion.findOneAndUpdate({ _id: id }, camionUpdate, {
        new: true,
      }).exec();

      if (!camion) {
        throw new Error('Camion niet gevonden.');
      }
      return res.status(200).json(camion);
    } catch (err) {
      next(err);
    }
  };
}

export default CamionController;
