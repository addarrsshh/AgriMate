import { getDBStatus } from '../config/db';
import CropModel from '../models/Crop';
import MarketModel from '../models/Market';
import PriceRecordModel from '../models/PriceRecord';
import FertilizerModel from '../models/Fertilizer';
import {
  crops,
  markets,
  historicalPricesByCrop,
  fertilizers,
  defaultWeather
} from '../data/mockSeedData';
import { ICrop, IMarket, IPriceRecord, IFertilizer } from '../types';

// Get all crops
export const getAllCrops = async (): Promise<ICrop[]> => {
  const dbStatus = getDBStatus();
  if (dbStatus.connected) {
    try {
      const dbCrops = await CropModel.find({}).lean<ICrop[]>();
      if (dbCrops && dbCrops.length > 0) return dbCrops;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[DataAccess] Error fetching crops from DB, using fallback seed:', message);
    }
  }
  return crops;
};

// Get crop by ID
export const getCropById = async (id: string): Promise<ICrop | null> => {
  const all = await getAllCrops();
  return all.find(c => c.id === id || (c._id && c._id.toString() === id)) || null;
};

// Get all markets
export const getAllMarkets = async (): Promise<IMarket[]> => {
  const dbStatus = getDBStatus();
  if (dbStatus.connected) {
    try {
      const dbMarkets = await MarketModel.find({}).lean<IMarket[]>();
      if (dbMarkets && dbMarkets.length > 0) return dbMarkets;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[DataAccess] Error fetching markets from DB, using fallback seed:', message);
    }
  }
  return markets;
};

// Get market by ID
export const getMarketById = async (id: string): Promise<IMarket | null> => {
  const all = await getAllMarkets();
  return all.find(m => m.id === id || (m._id && m._id.toString() === id)) || null;
};

// Get price history for a crop
export const getPriceHistoryForCrop = async (cropId: string): Promise<IPriceRecord[]> => {
  const dbStatus = getDBStatus();
  if (dbStatus.connected) {
    try {
      const dbPrices = await PriceRecordModel.find({ cropId }).sort({ date: 1 }).lean<IPriceRecord[]>();
      if (dbPrices && dbPrices.length > 0) return dbPrices;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[DataAccess] Error fetching price records from DB, using fallback seed:', message);
    }
  }
  return historicalPricesByCrop[cropId] || historicalPricesByCrop['crop-wheat'] || [];
};

// Get all fertilizers
export const getAllFertilizers = async (): Promise<IFertilizer[]> => {
  const dbStatus = getDBStatus();
  if (dbStatus.connected) {
    try {
      const dbFerts = await FertilizerModel.find({}).lean<IFertilizer[]>();
      if (dbFerts && dbFerts.length > 0) return dbFerts;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn('[DataAccess] Error fetching fertilizers from DB, using fallback seed:', message);
    }
  }
  return fertilizers;
};

// Seed database if connected to MongoDB Atlas and empty
export const seedDatabaseIfEmpty = async (): Promise<void> => {
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('[Seed] Seed check notice:', message);
  }
};

export { defaultWeather };
