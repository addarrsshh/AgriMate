const express = require('express');
const router = express.Router();
const {
  listCrops,
  getCropDetail,
  recommendCrops,
  listFertilizers
} = require('../controllers/cropController');

router.get('/', listCrops);
router.post('/recommend', recommendCrops);
router.get('/fertilizers', listFertilizers);
router.get('/:id', getCropDetail);

module.exports = router;
