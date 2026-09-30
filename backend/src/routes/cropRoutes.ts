import { Router } from 'express';
import {
  listCrops,
  getCropDetail,
  recommendCrops,
  listFertilizers
} from '../controllers/cropController';

const router = Router();

router.get('/', listCrops);
router.post('/recommend', recommendCrops);
router.get('/fertilizers', listFertilizers);
router.get('/:id', getCropDetail);

export default router;
