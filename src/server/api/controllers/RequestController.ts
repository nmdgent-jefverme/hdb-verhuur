import { NextFunction, Request, Response } from 'express';
import { IRequest, Request as RequestClass } from '../../models/mongoose';

class RequestController {
  public index = async (req: Request, res: Response, next: NextFunction) => {
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
        requests = await RequestClass.paginate({}, options);
      } else {
        requests = await RequestClass.find()
          .sort({ _createdAt: -1 })
          .populate('items')
          .populate('user')
          .exec();
      }

      return res.status(200).json(requests);
    } catch (err) {
      next(err);
    }
  };

  public show = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any>> => {
    const { id } = req.params;
    const request: IRequest = await RequestClass.findById(id).populate('items').populate('user').exec();
    return res.status(200).json(request);
  };

  public store = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const requestCreate = new RequestClass({
        rented_from: req.body.rented_from,
        rented_to: req.body.rented_to,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        _userId: req.body.userId,
        _itemIds: req.body.itemsArray,
      })
      const request = await requestCreate.save();
      return res.status(201).json(request);
    } catch (error) {
      next(error);
    }
  }

  update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const requestUpdate = {
        status: req.body.status,
      };
      const updatedRequest = await RequestClass.findOneAndUpdate({ _id: id }, requestUpdate, {
        new: true,
      }).exec();

      if (!updatedRequest) {
        throw new Error('Camion niet gevonden.');
      }
      return res.status(200).json(updatedRequest);
    } catch (err) {
      next(err);
    }
  };
}

export default RequestController;
