import { NextFunction, Request, Response } from 'express';
import { ICategory, Category } from '../../models/mongoose';

class CategoryController {
  public index = async (req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.find().exec();
    return res.status(200).json(categories);
  };

}

export default CategoryController;
