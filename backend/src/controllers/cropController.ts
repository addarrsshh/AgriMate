import { Request, Response, NextFunction } from 'express';
import { getAllCrops, getCropById, getAllFertilizers } from '../services/dataAccessService';
import { getCropRecommendations } from '../services/cropMatchingService';

export const listCrops = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { season, category, soil } = req.query as { season?: string; category?: string; soil?: string };
    let crops = await getAllCrops();

    if (season) {
      crops = crops.filter(c => c.suitableSeasons.some(s => s.toLowerCase() === season.toLowerCase()));
    }
    if (category) {
      crops = crops.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    if (soil) {
      crops = crops.filter(c => c.soilSuitability.some(s => s.toLowerCase().includes(soil.toLowerCase())));
    }

    res.json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (err) {
    next(err);
  }
};

export const getCropDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const crop = await getCropById(id);
    if (!crop) {
      res.status(404).json({ success: false, message: `Crop with id ${id} not found` });
      return;
    }
    res.json({
      success: true,
      data: crop
    });
  } catch (err) {
    next(err);
  }
};

export const recommendCrops = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const farmerInput = req.body || {};
    const results = await getCropRecommendations(farmerInput);
    res.json({
      success: true,
      data: results
    });
  } catch (err) {
    next(err);
  }
};

export const listFertilizers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { type, organic } = req.query as { type?: string; organic?: string };
    let list = await getAllFertilizers();

    if (type) {
      list = list.filter(f => f.type.toLowerCase() === type.toLowerCase());
    }
    if (organic !== undefined) {
      const isOrg = organic === 'true';
      list = list.filter(f => f.organic === isOrg);
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    next(err);
  }
};
