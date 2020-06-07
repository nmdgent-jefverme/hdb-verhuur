import { NextFunction, Request, Response } from 'express';
import { IItem, Item } from '../../models/mongoose';

class ItemController {
  public index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, skip, category } = req.query;
      let items;

      if (limit && skip) {
        const options: any = {
          limit: parseInt(limit, 10) || 10,
          page: parseInt(skip, 10) || 1,
          sort: { _createdAt: -1 },
          where: { _deletedAt: null },
          populate: ['tags', 'category', 'location'],
        };
        items = await Item.paginate({}, options);
      } else if (category) {
        items = await Item.find({ _categoryId: category }, (err, Item) => {
          // console.log(Item);
          return Item;
        })
          .where('_deletedAt', null)
          .populate('tags')
          .populate('location')
          .populate('category')
          .exec();
      } else {
        items = await Item.find()
          .sort({ _createdAt: -1 })
          .where('_deletedAt', null)
          .populate('tags')
          .populate('location')
          .populate('category')
          .exec();
      }

      return res.status(200).json(items);
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
    const item: IItem = await Item.findById(id)
      .populate('tags')
      .populate('location')
      .populate('category')
      .exec();
    return res.status(200).json(item);
  };

  public store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const itemCreate = new Item({
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        _categoryId: req.body.categoryId,
        _tagIds: req.body.tagIds,
        _locationId: req.body.locationId,
        rented: false,
      });
      const item = await itemCreate.save();
      return res.status(201).json(item);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const itemUpdate = {
        name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        imageUrl: req.body.imageUrl,
        _categoryId: req.body.categoryId,
        _tagIds: req.body.tagIds,
        _locationId: req.body.locationId,
        _modifiedAt: Date.now(),
        rented: false,
      };
      const item = await Item.findOneAndUpdate({ _id: id }, itemUpdate, {
        new: true,
      }).exec();

      if (!item) {
        throw new Error('Item niet gevonden.');
      }
      return res.status(200).json(item);
    } catch (err) {
      next(err);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let item = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          item = await Item.findOneAndRemove({ _id: id });
          break;
        case 'softdelete':
          item = await Item.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() },
          );
          break;
        case 'softundelete':
          item = await Item.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null },
          );
          break;
      }

      if (!item) {
        throw new Error('item not found');
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the Item with id: ${id}!`,
          item,
          mode,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default ItemController;
