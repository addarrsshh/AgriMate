const { getAllCrops, getCropById, getAllFertilizers } = require('../services/dataAccessService');
const { getCropRecommendations } = require('../services/cropMatchingService');

const listCrops = async (req, res, next) => {
  try {
    const { season, category, soil } = req.query;
    let crops = await getAllCrops();

    if (season) {
      crops = crops.filter(c => c.suitableSeasons.some(s => s.toLowerCase() === season.toLowerCase()));
    }
    if (category) {
      crops = crops.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }
    if (soil) {
      crops = crops.filter(c => c.soilSuitability.some(s => s.toLowerCase().includes(soil.toLowerCase())));
    }

    res.json({
      success: true,
      count: crops.length,
      data: crops
    });
  } catch (err) {
    next(err);
  }
};

const getCropDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const crop = await getCropById(id);
    if (!crop) {
      return res.status(404).json({ success: false, message: `Crop with id ${id} not found` });
    }
    res.json({
      success: true,
      data: crop
    });
  } catch (err) {
    next(err);
  }
};

const recommendCrops = async (req, res, next) => {
  try {
    const farmerInput = req.body || {};
    const results = await getCropRecommendations(farmerInput);
    res.json({
      success: true,
      data: results
    });
  } catch (err) {
    next(err);
  }
};

const listFertilizers = async (req, res, next) => {
  try {
    const { type, organic } = req.query;
    let list = await getAllFertilizers();

    if (type) {
      list = list.filter(f => f.type.toLowerCase() === type.toLowerCase());
    }
    if (organic !== undefined) {
      const isOrg = organic === 'true';
      list = list.filter(f => f.organic === isOrg);
    }

    res.json({
      success: true,
      count: list.length,
      data: list
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listCrops,
  getCropDetail,
  recommendCrops,
  listFertilizers
};
