import { Router } from 'express';
import {
  listMarkets,
  getCurrentPrices,
  getPriceHistory,
  getCropPriceAnalysis
} from '../controllers/marketController';

const router = Router();

router.get('/', listMarkets);
router.get('/prices/current', getCurrentPrices);
router.get('/prices/:cropId/history', getPriceHistory);
router.get('/prices/:cropId/analysis', getCropPriceAnalysis);

export default router;
