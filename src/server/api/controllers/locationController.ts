import { NextFunction, Request, Response } from 'express';
import { ILocation, Location } from '../../models/mongoose';

class LocationController {
  public index = async (req: Request, res: Response, next: NextFunction) => {
    const locations = await Location.find().exec();
    return res.status(200).json(locations);
  };
}

export default LocationController;
