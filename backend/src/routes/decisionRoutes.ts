import { Router } from 'express';
import { getSellHoldDecision } from '../controllers/decisionController';

const router = Router();

router.post('/sell-hold', getSellHoldDecision);

export default router;
