import { NextFunction, Request, Response } from 'express';
import { IPost, Post, Category } from '../../models/mongoose';

import { NotFoundError } from '../../utilities';

class PostController {
  index = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { limit, skip } = req.query;
      let posts;

      if (limit && skip) {
        const options = {
          limit: parseInt(limit, 10) || 10,
          page: parseInt(skip, 10) || 1,
          sort: { _createdAt: -1 },
          populate: 'category',
        };
        posts = await Post.paginate({}, options);
      } else {
        posts = await Post.find()
          .populate('category')
          .sort({ _createdAt: -1 })
          .exec();
      }

      return res.status(200).json(posts);
    } catch (err) {
      next(err);
    }
  };

  show = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const post = await Post.findById(id)
        .populate('category')
        .exec();
      return res.status(200).json(post);
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const vm = {
        categories: await Category.find(),
      };
      return res.status(200).json(vm);
    } catch (err) {
      next(err);
    }
  };

  store = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const postCreate = new Post({
        title: req.body.title,
        synopsis: req.body.synopsis,
        body: req.body.body,
        _categoryId: req.body._categoryId,
        imageUrl: req.body.imageUrl,
      });
      const post = await postCreate.save();
      return res.status(201).json(post);
    } catch (err) {
      next(err);
    }
  };

  edit = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const post = await Post.findById(id).exec();

      if (!post) {
        throw new NotFoundError();
      } else {
        const vm = {
          post,
          categories: await Category.find(),
        };
        return res.status(200).json(vm);
      }
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const postUpdate = {
        title: req.body.title,
        synopsis: req.body.synopsis,
        body: req.body.body,
        _categoryId: req.body._categoryId,
        imageUrl: req.body.imageUrl,
      };
      const post = await Post.findOneAndUpdate({ _id: id }, postUpdate, {
        new: true,
      }).exec();

      if (!post) {
        throw new NotFoundError();
      }
      return res.status(200).json(post);
    } catch (err) {
      next(err);
    }
  };

  destroy = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      let post = null;

      let { mode } = req.query;

      switch (mode) {
        case 'delete':
        default:
          post = await Post.findOneAndRemove({ _id: id });
          break;
        case 'softdelete':
          post = await Post.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: Date.now() },
          );
          break;
        case 'softundelete':
          post = await Post.findByIdAndUpdate(
            { _id: id },
            { _deletedAt: null },
          );
          break;
      }

      if (!post) {
        throw new NotFoundError();
      } else {
        return res.status(200).json({
          message: `Successful ${mode} the Post with id: ${id}!`,
          post,
          mode,
        });
      }
    } catch (err) {
      next(err);
    }
  };
}

export default PostController;
