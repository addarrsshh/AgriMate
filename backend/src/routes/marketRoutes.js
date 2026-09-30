const express = require('express');
const router = express.Router();
const {
  listMarkets,
  getCurrentPrices,
  getPriceHistory,
  getCropPriceAnalysis
} = require('../controllers/marketController');

router.get('/', listMarkets);
router.get('/prices/current', getCurrentPrices);
router.get('/prices/:cropId/history', getPriceHistory);
router.get('/prices/:cropId/analysis', getCropPriceAnalysis);

module.exports = router;
