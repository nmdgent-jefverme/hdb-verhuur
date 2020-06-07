import { NextFunction, Request, Response } from 'express';
import { ITag, Tag } from '../../models/mongoose';

class TagController {
  public index = async (req: Request, res: Response, next: NextFunction) => {
    const tags = await Tag.find().exec();
    return res.status(200).json(tags);
  };
}

export default TagController;
