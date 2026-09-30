const { getWeatherData } = require('../services/externalWeatherService');

const getWeather = async (req, res, next) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat) : 11.248;
    const lng = req.query.lng ? parseFloat(req.query.lng) : 75.7804;
    const location = req.query.location || "Kozhikode, Kerala";

    const data = await getWeatherData(lat, lng, location);
    res.json({
      success: true,
      data
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWeather
};
