"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
class ApiRouter {
    constructor(config, authService) {
        this.config = config;
        this.authService = authService;
        this.router = express_1.default.Router();
        this.registerControllers();
        this.registerRoutes();
    }
    registerControllers() {
        this.itemController = new controllers_1.ItemController();
        this.requestController = new controllers_1.RequestController();
        this.camionController = new controllers_1.CamionController();
        this.categoryController = new controllers_1.CategoryController();
        this.locationController = new controllers_1.LocationController();
        this.userController = new controllers_1.UserController(this.config, this.authService);
        this.tagController = new controllers_1.TagController();
        // this.userController = new UserController(this.config, this.authService);
    }
    registerRoutes() {
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
exports.default = ApiRouter;
//# sourceMappingURL=ApiRouter.js.map