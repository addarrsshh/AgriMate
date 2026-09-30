import { Request, Response, NextFunction } from 'express';
import { getWeatherData } from '../services/externalWeatherService';

export const getWeather = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 11.248;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : 75.7804;
    const location = (req.query.location as string) || "Kozhikode, Kerala";

    const data = await getWeatherData(lat, lng, location);
    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};
