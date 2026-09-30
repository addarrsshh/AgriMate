import { Request, Response, NextFunction } from 'express';
import { calculateProfit } from '../services/profitCalculationService';

export const calculateCropProfit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const inputs = req.body || {};
    const result = await calculateProfit(inputs);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};
