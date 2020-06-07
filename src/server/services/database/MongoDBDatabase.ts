import { default as mongoose, Connection } from 'mongoose';
import { default as faker } from 'faker';

import { ILogger } from '../logger';
import { IConfig } from '../config';
import {
  ICamion,
  Camion,
  ICategory,
  Category,
  Item,
  IItem,
  ILocation,
  Location,
  IRequest,
  Request,
  ITag,
  Tag,
  Status,
  IUser,
  User,
} from '../../models/mongoose';

class MongoDBDatabase {
  private config: IConfig;
  private logger: ILogger;
  private db: Connection;

  private camions: Array<ICamion>;
  private categories: Array<ICategory>;
  private items: Array<IItem>;
  private locations: Array<ILocation>;
  private requests: Array<IRequest>;
  private tags: Array<ITag>;
  private users: Array<IUser>;

  constructor(logger: ILogger, config: IConfig) {
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

  public connect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      mongoose
        .connect(this.config.mongoDBConnection, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        })
        .then(data => {
          this.db = mongoose.connection;

          this.logger.info('Connected to the mongodb database', {});

          resolve(true);
        })
        .catch(error => {
          this.logger.error("Can't connect to the database", error);

          reject(error);
        });
    });
  }

  public disconnect(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
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

  private locationCreate = async (
    name: string,
    street: string,
    city: string,
    number: number,
    lat: number,
    lon: number,
  ) => {
    const location = new Location({
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
    } catch (error) {
      this.logger.error('An error occurred when creating a location', error);
    }
  };

  private createLocations = async () => {
    const promises = [];
    promises.push(
      this.locationCreate(
        'Jogiterrein - MK2',
        'Emiel Claeyslaan',
        'Gent',
        2,
        51.044363,
        3.771657,
      ),
    );
    promises.push(
      this.locationCreate(
        'Welpenterrein - MK1',
        'Achterdries',
        'Gent',
        52,
        51.042605,
        3.766988,
      ),
    );

    return await Promise.all(promises);
  };

  private userCreate = async (
    email: string,
    password: string,
    role: string,
    firstName: string,
    lastName: string,
    gender: string,
    address: string,
    number: string,
    appartment: string,
    city: string,
    postalCode: number,
    camionId: string,
  ) => {
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

    const user: IUser = new User(userDetail);

    try {
      const createdUser = await user.save();
      this.users.push(createdUser);

      this.logger.info(`User created with id: ${createdUser._id}`, {});
    } catch (err) {
      this.logger.error(`An error occurred when creating a user ${err}`, err);
    }
  };

  private createUsers = async () => {
    const promises = [];
    // faker.setLocale('nl');
    const camionId = await this.camionCreate(
      Date.now() + 1,
      Date.now() + Math.round(Math.random() * 20),
    );

    promises.push(
      this.userCreate(
        'jefvermeireown@gmail.com',
        'Azerty123',
        'administrator',
        'Jef',
        'Vermeire',
        'man',
        'Gustaaf Callierlaan',
        '225',
        null,
        'Gent',
        9000,
        camionId,
      ),
    );

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

  private tagCreate = async (name: string) => {
    const tag = new Tag({
      name,
    });

    try {
      const newTag = await tag.save();
      this.tags.push();
      this.logger.info(`Tag created with id ${newTag._id}`, {});
    } catch (error) {
      this.logger.error('An error occurred when creating a tag', error);
    }
  };

  private createTags = async () => {
    const promises = [];

    for (let i = 0; i < 30; i++) {
      promises.push(this.tagCreate(faker.lorem.word()));
    }

    return await Promise.all(promises);
  };

  private getRandomCategory = () => {
    let category: ICategory = null;
    if (this.categories && this.categories.length > 0) {
      category = this.categories[
        Math.floor(Math.random() * this.categories.length)
      ];
    }
    return category;
  };

  private getRandomLocation = () => {
    let location: ILocation = null;
    if (this.locations && this.locations.length > 0) {
      location = this.locations[
        Math.floor(Math.random() * this.locations.length)
      ];
    }
    return location;
  };

  private getRandomUser = () => {
    let user: IUser = null;
    if (this.users && this.users.length > 0) {
      user = this.users[Math.floor(Math.random() * this.users.length)];
    }
    return user;
  };

  private requestCreate = async (
    rented_from: number,
    rented_to: number,
    status: string,
    totalPrice: number,
  ) => {
    const requestDetail = {
      rented_from,
      rented_to,
      status,
      totalPrice,
      _userId: this.getRandomUser()._id,
      _itemIds: this.getRandomItemsAsArrayOfIds(5),
    };

    const request: IRequest = new Request(requestDetail);

    try {
      const createdRequest = await request.save();
      this.requests.push(createdRequest);

      this.logger.info(`Request created with id: ${createdRequest._id}`, {});
    } catch (err) {
      this.logger.error(
        `An error occurred when creating a request ${err}`,
        err,
      );
    }
  };

  private createRequests = async () => {
    const promises = [];

    for (let i = 0; i < 15; i++) {
      promises.push(
        this.requestCreate(
          Date.now() + 1,
          Date.now() + Math.round(Math.random() * 20),
          Status.pending,
          Math.round(Math.random() * 200),
        ),
      );
    }

    return await Promise.all(promises);
  };

  private camionCreate = async (rented_from: number, rented_to: number) => {
    const camionDetail = {
      rented_from,
      rented_to,
      _itemIds: this.getRandomItemsAsArrayOfIds(5),
    };

    const camion: ICamion = new Camion(camionDetail);

    try {
      const createdCamion = await camion.save();
      this.camions.push(createdCamion);

      this.logger.info(`Camion created with id: ${createdCamion._id}`, {});
      return createdCamion._id;
    } catch (err) {
      this.logger.error(`An error occurred when creating a camion ${err}`, err);
    }
  };

  private categoryCreate = async (name: string) => {
    const categoryDetail = {
      name,
    };

    const category: ICategory = new Category(categoryDetail);

    try {
      const createdCategory = await category.save();
      this.categories.push(createdCategory);

      this.logger.info(`Category created with id: ${createdCategory._id}`, {});
    } catch (err) {
      this.logger.error(
        `An error occurred when creating a category ${err}`,
        err,
      );
    }
  };

  private createCategories = async () => {
    const promises = [];

    for (let i = 0; i < 8; i++) {
      promises.push(this.categoryCreate(faker.lorem.word()));
    }

    return await Promise.all(promises);
  };

  private getRandomTagsAsArrayOfIds(nTags: number) {
    const tempTags = JSON.parse(JSON.stringify(this.tags)) as Array<ITag>;
    const arrayOfIds = [];
    while (arrayOfIds.length < nTags) {
      const removedTag = tempTags.splice(
        Math.floor(Math.random() * nTags),
        1,
      )[0];

      arrayOfIds.push(removedTag._id);
    }
    return arrayOfIds;
  }

  private getRandomItemsAsArrayOfIds(nItems: number) {
    const tempItems = JSON.parse(JSON.stringify(this.items)) as Array<IItem>;
    const arrayOfIds = [];
    while (arrayOfIds.length < nItems) {
      const removedTag = tempItems.splice(
        Math.floor(Math.random() * nItems),
        1,
      )[0];
      arrayOfIds.push(removedTag._id);
    }
    return arrayOfIds;
  }

  private itemCreate = async (
    name: string,
    rented: boolean,
    price: number,
    description: string,
    imageUrl: string,
  ) => {
    const itemDetail = {
      name,
      rented,
      price,
      description,
      imageUrl,
      _categoryId: this.getRandomCategory(),
      _locationId: this.getRandomLocation(),
      _tagIds: this.getRandomTagsAsArrayOfIds(
        Math.floor(Math.random() * this.tags.length),
      ),
    };

    const item: IItem = new Item(itemDetail);

    try {
      const createdItem = await item.save();
      this.items.push(createdItem);

      this.logger.info(`Item created with id: ${createdItem._id}`, {});
    } catch (err) {
      this.logger.error(`An error occurred when creating a item ${err}`, err);
    }
  };

  private createItems = async () => {
    const promises = [];

    for (let i = 0; i < 20; i++) {
      promises.push(
        this.itemCreate(
          faker.lorem.word(),
          Math.random() >= 0.5,
          Math.round(Math.random() * 20),
          faker.lorem.paragraph(),
          faker.internet.avatar(),
        ),
      );
    }

    return await Promise.all(promises);
  };

  public seed = async () => {
    this.locations = await Location.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createLocations();
        }
        return Location.find().exec();
      });

    this.tags = await Tag.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createTags();
        }
        return Tag.find().exec();
      });

    this.categories = await Category.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createCategories();
        }
        return Category.find().exec();
      });
    this.items = await Item.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createItems();
        }
        return Item.find().exec();
      });
    this.requests = await Request.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createRequests();
        }
        return Request.find().exec();
      });

    this.users = await User.estimatedDocumentCount()
      .exec()
      .then(async count => {
        if (count === 0) {
          await this.createUsers();
        }
        return User.find().exec();
      });
  };
}

export default MongoDBDatabase;
