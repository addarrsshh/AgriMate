const { evaluateSellHoldDecision } = require('../services/decisionEngineService');

const getSellHoldDecision = async (req, res, next) => {
  try {
    const params = req.body || {};
    if (!params.cropId) {
      return res.status(400).json({ success: false, message: "cropId is required in request body" });
    }

    const decisionData = await evaluateSellHoldDecision(params);
    res.json({
      success: true,
      data: decisionData
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getSellHoldDecision
};
