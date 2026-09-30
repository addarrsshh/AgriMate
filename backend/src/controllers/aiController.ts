import { Request, Response, NextFunction } from 'express';
import { askAgriculturalAssistant } from '../services/aiAssistantService';

export const askAssistant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { question, context } = req.body || {};
    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      res.status(400).json({ success: false, message: "A question string is required in request body" });
      return;
    }

    const response = await askAgriculturalAssistant(question, context || {});
    res.json({
      success: true,
      data: response
    });
  } catch (err) {
    next(err);
  }
};
