import { Router } from 'express';
import { calculateCropProfit } from '../controllers/profitController';

const router = Router();

router.post('/calculate', calculateCropProfit);

export default router;
