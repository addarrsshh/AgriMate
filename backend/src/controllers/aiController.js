const { askAgriculturalAssistant } = require('../services/aiAssistantService');

const askAssistant = async (req, res, next) => {
  try {
    const { question, context } = req.body || {};
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ success: false, message: "A question string is required in request body" });
    }

    const response = await askAgriculturalAssistant(question, context || {});
    res.json({
      success: true,
      data: response
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  askAssistant
};
