"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const faker_1 = __importDefault(require("faker"));
const mongoose_2 = require("../../models/mongoose");
class MongoDBDatabase {
    constructor(logger, config) {
        this.locationCreate = async (name, street, city, number, lat, lon) => {
            const location = new mongoose_2.Location({
                name,
                street,
                city,
                number,
                lat,
                lon,
            });
            try {
                const newLocation = await location.save();
                this.locations.push();
                this.logger.info(`Location created with id ${newLocation._id}`, {});
            }
            catch (error) {
                this.logger.error('An error occurred when creating a location', error);
            }
        };
        this.createLocations = async () => {
            const promises = [];
            promises.push(this.locationCreate('Jogiterrein - MK2', 'Emiel Claeyslaan', 'Gent', 2, 51.044363, 3.771657));
            promises.push(this.locationCreate('Welpenterrein - MK1', 'Achterdries', 'Gent', 52, 51.042605, 3.766988));
            return await Promise.all(promises);
        };
        this.userCreate = async (email, password, role, firstName, lastName, gender, address, number, appartment, city, postalCode, camionId) => {
            const userDetail = {
                email,
                localProvider: {
                    password,
                },
                role,
                profile: {
                    firstName,
                    lastName,
                    gender,
                    address,
                    number,
                    appartment,
                    city,
                    postalCode,
                },
                _camionId: camionId,
            };
            const user = new mongoose_2.User(userDetail);
            try {
                const createdUser = await user.save();
                this.users.push(createdUser);
                this.logger.info(`User created with id: ${createdUser._id}`, {});
            }
            catch (err) {
                this.logger.error(`An error occurred when creating a user ${err}`, err);
            }
        };
        this.createUsers = async () => {
            const promises = [];
            // faker.setLocale('nl');
            const camionId = await this.camionCreate(Date.now() + 1, Date.now() + Math.round(Math.random() * 20));
            promises.push(this.userCreate('jefvermeireown@gmail.com', 'Azerty123', 'administrator', 'Jef', 'Vermeire', 'man', 'Gustaaf Callierlaan', '225', null, 'Gent', 9000, camionId));
            /* for (let i = 0; i < 30; i++) {
              const gender = Math.round(Math.random());
              const camion = await this.camionCreate(Date.now() + 1, Date.now() + Math.round(Math.random() * 20),);
              promises.push(
                this.userCreate(
                  faker.internet.email(),
                  'nmdgent007!',
                  'user',
                  faker.name.firstName(gender),
                  faker.name.lastName(gender),
                  `${gender}`,
                  faker.address.streetName(),
                  `${Math.round(Math.random() * 100)}`,
                  null,
                  faker.address.city(),
                  Math.round(Math.random() * 9999),
                  camion
                ),
              );
            } */
            return await Promise.all(promises);
        };
        this.tagCreate = async (name) => {
            const tag = new mongoose_2.Tag({
                name,
            });
            try {
                const newTag = await tag.save();
                this.tags.push();
                this.logger.info(`Tag created with id ${newTag._id}`, {});
            }
            catch (error) {
                this.logger.error('An error occurred when creating a tag', error);
            }
        };
        this.createTags = async () => {
            const promises = [];
            for (let i = 0; i < 30; i++) {
                promises.push(this.tagCreate(faker_1.default.lorem.word()));
            }
            return await Promise.all(promises);
        };
        this.getRandomCategory = () => {
            let category = null;
            if (this.categories && this.categories.length > 0) {
                category = this.categories[Math.floor(Math.random() * this.categories.length)];
            }
            return category;
        };
        this.getRandomLocation = () => {
            let location = null;
            if (this.locations && this.locations.length > 0) {
                location = this.locations[Math.floor(Math.random() * this.locations.length)];
            }
            return location;
        };
        this.getRandomUser = () => {
            let user = null;
            if (this.users && this.users.length > 0) {
                user = this.users[Math.floor(Math.random() * this.users.length)];
            }
            return user;
        };
        this.requestCreate = async (rented_from, rented_to, status, totalPrice) => {
            const requestDetail = {
                rented_from,
                rented_to,
                status,
                totalPrice,
                _userId: this.getRandomUser()._id,
                _itemIds: this.getRandomItemsAsArrayOfIds(5),
            };
            const request = new mongoose_2.Request(requestDetail);
            try {
                const createdRequest = await request.save();
                this.requests.push(createdRequest);
                this.logger.info(`Request created with id: ${createdRequest._id}`, {});
            }
            catch (err) {
                this.logger.error(`An error occurred when creating a request ${err}`, err);
            }
        };
        this.createRequests = async () => {
            const promises = [];
            for (let i = 0; i < 15; i++) {
                promises.push(this.requestCreate(Date.now() + 1, Date.now() + Math.round(Math.random() * 20), mongoose_2.Status.pending, Math.round(Math.random() * 200)));
            }
            return await Promise.all(promises);
        };
        this.camionCreate = async (rented_from, rented_to) => {
            const camionDetail = {
                rented_from,
                rented_to,
                _itemIds: this.getRandomItemsAsArrayOfIds(5),
            };
            const camion = new mongoose_2.Camion(camionDetail);
            try {
                const createdCamion = await camion.save();
                this.camions.push(createdCamion);
                this.logger.info(`Camion created with id: ${createdCamion._id}`, {});
                return createdCamion._id;
            }
            catch (err) {
                this.logger.error(`An error occurred when creating a camion ${err}`, err);
            }
        };
        this.categoryCreate = async (name) => {
            const categoryDetail = {
                name,
            };
            const category = new mongoose_2.Category(categoryDetail);
            try {
                const createdCategory = await category.save();
                this.categories.push(createdCategory);
                this.logger.info(`Category created with id: ${createdCategory._id}`, {});
            }
            catch (err) {
                this.logger.error(`An error occurred when creating a category ${err}`, err);
            }
        };
        this.createCategories = async () => {
            const promises = [];
            for (let i = 0; i < 8; i++) {
                promises.push(this.categoryCreate(faker_1.default.lorem.word()));
            }
            return await Promise.all(promises);
        };
        this.itemCreate = async (name, rented, price, description, imageUrl) => {
            const itemDetail = {
                name,
                rented,
                price,
                description,
                imageUrl,
                _categoryId: this.getRandomCategory(),
                _locationId: this.getRandomLocation(),
                _tagIds: this.getRandomTagsAsArrayOfIds(Math.floor(Math.random() * this.tags.length)),
            };
            const item = new mongoose_2.Item(itemDetail);
            try {
                const createdItem = await item.save();
                this.items.push(createdItem);
                this.logger.info(`Item created with id: ${createdItem._id}`, {});
            }
            catch (err) {
                this.logger.error(`An error occurred when creating a item ${err}`, err);
            }
        };
        this.createItems = async () => {
            const promises = [];
            for (let i = 0; i < 20; i++) {
                promises.push(this.itemCreate(faker_1.default.lorem.word(), Math.random() >= 0.5, Math.round(Math.random() * 20), faker_1.default.lorem.paragraph(), faker_1.default.internet.avatar()));
            }
            return await Promise.all(promises);
        };
        this.seed = async () => {
            this.locations = await mongoose_2.Location.estimatedDocumentCount()
                .exec()
                .then(async (count) => {
                if (count === 0) {
                    await this.createLocations();
                }
                return mongoose_2.Location.find().exec();
            });
            this.tags = await mongoose_2.Tag.estimatedDocumentCount()
                .exec()
                .then(async (count) => {
                if (count === 0) {
                    await this.createTags();
                }
                return mongoose_2.Tag.find().exec();
            });
            this.categories = await mongoose_2.Category.estimatedDocumentCount()
                .exec()
                .then(async (count) => {
                if (count === 0) {
                    await this.createCategories();
                }
                return mongoose_2.Category.find().exec();
            });
            this.items = await mongoose_2.Item.estimatedDocumentCount()
                .exec()
                .then(async (count) => {
                if (count === 0) {
                    await this.createItems();
                }
                return mongoose_2.Item.find().exec();
            });
            this.requests = await mongoose_2.Request.estimatedDocumentCount()
                .exec()
                .then(async (count) => {
                if (count === 0) {
                    await this.createRequests();
                }
                return mongoose_2.Request.find().exec();
            });
            this.users = await mongoose_2.User.estimatedDocumentCount()
                .exec()
                .then(async (count) => {
                if (count === 0) {
                    await this.createUsers();
                }
                return mongoose_2.User.find().exec();
            });
        };
        this.logger = logger;
        this.config = config;
        this.camions = [];
        this.categories = [];
        this.items = [];
        this.locations = [];
        this.requests = [];
        this.users = [];
        this.tags = [];
    }
    connect() {
        return new Promise((resolve, reject) => {
            mongoose_1.default
                .connect(this.config.mongoDBConnection, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
                .then(data => {
                this.db = mongoose_1.default.connection;
                this.logger.info('Connected to the mongodb database', {});
                resolve(true);
            })
                .catch(error => {
                this.logger.error("Can't connect to the database", error);
                reject(error);
            });
        });
    }
    disconnect() {
        return new Promise((resolve, reject) => {
            this.db
                .close(true)
                .then(data => {
                resolve(data);
            })
                .catch(error => {
                this.logger.error("Can't disconnect the database", error);
                reject(error);
            });
        });
    }
    getRandomTagsAsArrayOfIds(nTags) {
        const tempTags = JSON.parse(JSON.stringify(this.tags));
        const arrayOfIds = [];
        while (arrayOfIds.length < nTags) {
            const removedTag = tempTags.splice(Math.floor(Math.random() * nTags), 1)[0];
            arrayOfIds.push(removedTag._id);
        }
        return arrayOfIds;
    }
    getRandomItemsAsArrayOfIds(nItems) {
        const tempItems = JSON.parse(JSON.stringify(this.items));
        const arrayOfIds = [];
        while (arrayOfIds.length < nItems) {
            const removedTag = tempItems.splice(Math.floor(Math.random() * nItems), 1)[0];
            arrayOfIds.push(removedTag._id);
        }
        return arrayOfIds;
    }
}
exports.default = MongoDBDatabase;
//# sourceMappingURL=MongoDBDatabase.js.map