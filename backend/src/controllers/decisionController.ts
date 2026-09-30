import { Request, Response, NextFunction } from 'express';
import { evaluateSellHoldDecision } from '../services/decisionEngineService';

export const getSellHoldDecision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const params = req.body || {};
    if (!params.cropId) {
      res.status(400).json({ success: false, message: "cropId is required in request body" });
      return;
    }

    const decisionData = await evaluateSellHoldDecision(params);
    res.json({
      success: true,
      data: decisionData
    });
  } catch (err) {
    next(err);
  }
};
