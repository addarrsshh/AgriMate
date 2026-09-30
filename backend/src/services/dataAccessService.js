const { getDBStatus } = require('../config/db');
const CropModel = require('../models/Crop');
const MarketModel = require('../models/Market');
const PriceRecordModel = require('../models/PriceRecord');
const FertilizerModel = require('../models/Fertilizer');
const { crops, markets, historicalPricesByCrop, fertilizers, defaultWeather } = require('../data/mockSeedData');

// Get all crops
const getAllCrops = async () => {
  const dbStatus = getDBStatus();
  if (dbStatus.connected) {
    try {
      const dbCrops = await CropModel.find({}).lean();
      if (dbCrops && dbCrops.length > 0) return dbCrops;
    } catch (err) {
      console.warn('[DataAccess] Error fetching crops from DB, using fallback seed:', err.message);
    }
  }
  return crops;
};

// Get crop by ID
const getCropById = async (id) => {
  const all = await getAllCrops();
  return all.find(c => c.id === id || c._id?.toString() === id) || null;
};

// Get all markets
const getAllMarkets = async () => {
  const dbStatus = getDBStatus();
  if (dbStatus.connected) {
    try {
      const dbMarkets = await MarketModel.find({}).lean();
      if (dbMarkets && dbMarkets.length > 0) return dbMarkets;
    } catch (err) {
      console.warn('[DataAccess] Error fetching markets from DB, using fallback seed:', err.message);
    }
  }
  return markets;
};

// Get market by ID
const getMarketById = async (id) => {
  const all = await getAllMarkets();
  return all.find(m => m.id === id || m._id?.toString() === id) || null;
};

// Get price history for a crop
const getPriceHistoryForCrop = async (cropId) => {
  const dbStatus = getDBStatus();
  if (dbStatus.connected) {
    try {
      const dbPrices = await PriceRecordModel.find({ cropId }).sort({ date: 1 }).lean();
      if (dbPrices && dbPrices.length > 0) return dbPrices;
    } catch (err) {
      console.warn('[DataAccess] Error fetching price records from DB, using fallback seed:', err.message);
    }
  }
  return historicalPricesByCrop[cropId] || historicalPricesByCrop['crop-wheat'];
};

// Get all fertilizers
const getAllFertilizers = async () => {
  const dbStatus = getDBStatus();
  if (dbStatus.connected) {
    try {
      const dbFerts = await FertilizerModel.find({}).lean();
      if (dbFerts && dbFerts.length > 0) return dbFerts;
    } catch (err) {
      console.warn('[DataAccess] Error fetching fertilizers from DB, using fallback seed:', err.message);
    }
  }
  return fertilizers;
};

// Seed database if connected to MongoDB Atlas and empty
const seedDatabaseIfEmpty = async () => {
  const dbStatus = getDBStatus();
  if (!dbStatus.connected) return;

  try {
    const cropCount = await CropModel.countDocuments();
    if (cropCount === 0) {
      console.log('[Seed] Seeding initial crops to MongoDB Atlas...');
      await CropModel.insertMany(crops);
    }

    const marketCount = await MarketModel.countDocuments();
    if (marketCount === 0) {
      console.log('[Seed] Seeding initial markets to MongoDB Atlas...');
      await MarketModel.insertMany(markets);
    }

    const fertCount = await FertilizerModel.countDocuments();
    if (fertCount === 0) {
      console.log('[Seed] Seeding initial fertilizers to MongoDB Atlas...');
      await FertilizerModel.insertMany(fertilizers);
    }

    const priceCount = await PriceRecordModel.countDocuments();
    if (priceCount === 0) {
      console.log('[Seed] Seeding initial 30-day historical prices to MongoDB Atlas...');
      const recordsToInsert = [];
      const defaultMarket = markets[0];
      for (const [cropId, history] of Object.entries(historicalPricesByCrop)) {
        for (const item of history) {
          recordsToInsert.push({
            cropId,
            marketId: defaultMarket.id,
            date: item.date,
            modalPrice: item.modalPrice,
            minPrice: item.minPrice,
            maxPrice: item.maxPrice,
            volumeTons: item.volumeTons
          });
        }
      }
      await PriceRecordModel.insertMany(recordsToInsert);
    }
    console.log('[Seed] Database seed check completed successfully.');
  } catch (err) {
    console.warn('[Seed] Seed check notice:', err.message);
  }
};

module.exports = {
  getAllCrops,
  getCropById,
  getAllMarkets,
  getMarketById,
  getPriceHistoryForCrop,
  getAllFertilizers,
  seedDatabaseIfEmpty,
  defaultWeather
};
