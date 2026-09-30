const { getAllMarkets, getMarketById, getAllCrops, getPriceHistoryForCrop } = require('../services/dataAccessService');
const { analyzePriceTrends } = require('../services/priceAnalysisService');

const listMarkets = async (req, res, next) => {
  try {
    const { state, maxDistance } = req.query;
    let markets = await getAllMarkets();

    if (state) {
      markets = markets.filter(m => m.state.toLowerCase() === state.toLowerCase());
    }
    if (maxDistance) {
      const maxDist = parseFloat(maxDistance);
      markets = markets.filter(m => (m.distanceKm || 0) <= maxDist);
    }

    res.json({
      success: true,
      count: markets.length,
      data: markets
    });
  } catch (err) {
    next(err);
  }
};

const getCurrentPrices = async (req, res, next) => {
  try {
    const crops = await getAllCrops();
    const markets = await getAllMarkets();

    const priceOverview = crops.map(c => {
      // Calculate realistic price variation across mandis
      const mandiVariations = markets.map((m, idx) => {
        const delta = Math.round((Math.sin(idx + 1) * 0.04) * c.currentModalPricePerQuintal);
        const modalPrice = c.currentModalPricePerQuintal + delta;
        return {
          marketId: m.id,
          marketName: m.name,
          state: m.state,
          distanceKm: m.distanceKm,
          modalPrice,
          minPrice: Math.round(modalPrice * 0.94),
          maxPrice: Math.round(modalPrice * 1.06)
        };
      });

      // Sort by best price descending
      mandiVariations.sort((a, b) => b.modalPrice - a.modalPrice);

      return {
        cropId: c.id,
        cropName: c.name,
        category: c.category,
        overallModalPrice: c.currentModalPricePerQuintal,
        mspPerQuintal: c.mspPerQuintal,
        highestPayingMarket: mandiVariations[0],
        mandiRates: mandiVariations
      };
    });

    res.json({
      success: true,
      count: priceOverview.length,
      data: priceOverview
    });
  } catch (err) {
    next(err);
  }
};

const getPriceHistory = async (req, res, next) => {
  try {
    const { cropId } = req.params;
    const history = await getPriceHistoryForCrop(cropId);
    res.json({
      success: true,
      cropId,
      count: history.length,
      data: history
    });
  } catch (err) {
    next(err);
  }
};

const getCropPriceAnalysis = async (req, res, next) => {
  try {
    const { cropId } = req.params;
    const analysis = await analyzePriceTrends(cropId);
    res.json({
      success: true,
      data: analysis
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listMarkets,
  getCurrentPrices,
  getPriceHistory,
  getCropPriceAnalysis
};
