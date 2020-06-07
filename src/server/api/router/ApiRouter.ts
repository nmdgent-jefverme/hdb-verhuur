import {
  default as express,
  Application,
  Request,
  Response,
  Router,
} from 'express';
import { IConfig, AuthService, Role } from '../../services';
import {
  CategoryController,
  CamionController,
  LocationController,
  ItemController,
  RequestController,
  TagController,
  UserController
} from '../controllers';

import passport from 'passport';

class ApiRouter {
  public router: Router;
  private camionController: CamionController;
  private categoryController: CategoryController;
  private locationController: LocationController;
  private itemController: ItemController;
  private requestController: RequestController;
  private tagController: TagController;
  private userController: UserController;

  private config: IConfig;
  private authService: AuthService;

  constructor(config: IConfig, authService: AuthService) {
    this.config = config;
    this.authService = authService;

    this.router = express.Router();

    this.registerControllers();
    this.registerRoutes();
  }

  private registerControllers(): void {
    this.itemController = new ItemController();
    this.requestController = new RequestController();
    this.camionController = new CamionController();
    this.categoryController = new CategoryController();
    this.locationController = new LocationController();
    this.userController = new UserController(this.config, this.authService);
    this.tagController = new TagController();
    // this.userController = new UserController(this.config, this.authService);
  }

  private registerRoutes(): void {
    /*
     * Request routes
     */
    this.router.get('/requests', this.requestController.index);
    this.router.get('/requests/:id', this.requestController.show);
    this.router.post('/requests', this.requestController.store);
    this.router.put('/request/:id', this.requestController.update);

    /*
     * Item routes
     */
    this.router.get('/items', this.itemController.index);
    this.router.get('/items/:id', this.itemController.show);
    this.router.post('/items', this.itemController.store);
    this.router.delete('/items/:id', this.itemController.destroy);
    this.router.put('/item/:id', this.itemController.update);

    /*
     * Camion route
     */
    this.router.get('/camion/:id', this.camionController.show);
    this.router.put('/camion/:id', this.camionController.update);
    /*
     * Caterogry routes
     */
    this.router.get('/categories', this.categoryController.index);
    /*
     * Tag routes
     */
    this.router.get('/tags', this.tagController.index);
     /*
     * Location routes
     */
    this.router.get('/locations', this.locationController.index);
    /*
     * Users routes
     */
    this.router.get('/users', this.userController.index);
    this.router.get('/users/:id', this.userController.show);
    this.router.put('/user/updaterole/:id', this.userController.updateRole);
    this.router.put('/user/updateprofile/:id', this.userController.updateProfile);
    this.router.post('/auth/signup/', this.userController.signupLocal);
    this.router.post('/auth/signin/', this.userController.signInLocal);
    this.router.delete('/users/:id', this.userController.destroy);
  }
}

export default ApiRouter;
