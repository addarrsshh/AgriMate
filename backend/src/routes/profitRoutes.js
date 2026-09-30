const express = require('express');
const router = express.Router();
const { calculateCropProfit } = require('../controllers/profitController');

router.post('/calculate', calculateCropProfit);

module.exports = router;
