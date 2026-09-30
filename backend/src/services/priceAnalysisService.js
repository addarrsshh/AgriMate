const { getPriceHistoryForCrop } = require('./dataAccessService');

/**
 * Deterministic Price Analysis Service
 * 
 * Computes:
 * - 7-day & 30-day Simple Moving Averages (SMA)
 * - Rate of Change (ROC / % price changes)
 * - Relative Volatility Index (Std Dev / Mean)
 * - Trend categorization (BULLISH / BEARISH / CONSOLIDATING)
 */

const calculateSMA = (records, days) => {
  if (!records || records.length === 0) return 0;
  const slice = records.slice(-days);
  const sum = slice.reduce((acc, r) => acc + (r.modalPrice || 0), 0);
  return Math.round(sum / slice.length);
};

const calculateVolatility = (records, days = 30) => {
  if (!records || records.length < 2) return 0;
  const slice = records.slice(-days);
  const mean = slice.reduce((acc, r) => acc + r.modalPrice, 0) / slice.length;
  const squaredDiffs = slice.map(r => Math.pow(r.modalPrice - mean, 2));
  const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / (slice.length - 1);
  const stdDev = Math.sqrt(variance);
  
  // Normalized Volatility Index (StdDev / Mean)
  return parseFloat((stdDev / mean).toFixed(4));
};

const analyzePriceTrends = async (cropId) => {
  const history = await getPriceHistoryForCrop(cropId);
  if (!history || history.length === 0) {
    throw new Error(`No price records found for cropId: ${cropId}`);
  }

  const latestRecord = history[history.length - 1];
  const currentPrice = latestRecord.modalPrice;

  // 7-day baseline (7 records back)
  const index7d = Math.max(0, history.length - 7);
  const price7dAgo = history[index7d].modalPrice;

  // 30-day baseline (oldest record)
  const price30dAgo = history[0].modalPrice;

  const sma7 = calculateSMA(history, 7);
  const sma30 = calculateSMA(history, 30);

  const changePct7d = parseFloat((((currentPrice - price7dAgo) / price7dAgo) * 100).toFixed(2));
  const changePct30d = parseFloat((((currentPrice - price30dAgo) / price30dAgo) * 100).toFixed(2));

  const volatilityIndex = calculateVolatility(history, 30);

  // Price range in window
  const prices = history.map(h => h.modalPrice);
  const minPrice30d = Math.min(...prices);
  const maxPrice30d = Math.max(...prices);

  // Categorize trend
  let trend = "CONSOLIDATING";
  let momentum = "NEUTRAL";
  if (changePct7d > 2.0 && currentPrice > sma30) {
    trend = "UPWARD (BULLISH)";
    momentum = "POSITIVE";
  } else if (changePct7d < -2.0 && currentPrice < sma30) {
    trend = "DOWNWARD (BEARISH)";
    momentum = "NEGATIVE";
  } else {
    trend = "SIDEWAYS / STABLE";
    momentum = "NEUTRAL";
  }

  return {
    cropId,
    currentPrice,
    sma7,
    sma30,
    price7dAgo,
    price30dAgo,
    changePct7d,
    changePct30d,
    volatilityIndex,
    volatilityLevel: volatilityIndex > 0.05 ? "High" : volatilityIndex > 0.025 ? "Moderate" : "Low",
    minPrice30d,
    maxPrice30d,
    trend,
    momentum,
    lastUpdated: latestRecord.date,
    history
  };
};

module.exports = {
  calculateSMA,
  calculateVolatility,
  analyzePriceTrends
};
