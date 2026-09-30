const { calculateProfit } = require('../services/profitCalculationService');

const calculateCropProfit = async (req, res, next) => {
  try {
    const inputs = req.body || {};
    const result = await calculateProfit(inputs);
    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  calculateCropProfit
};
