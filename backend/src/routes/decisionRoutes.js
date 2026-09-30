const express = require('express');
const router = express.Router();
const { getSellHoldDecision } = require('../controllers/decisionController');

router.post('/sell-hold', getSellHoldDecision);

module.exports = router;
