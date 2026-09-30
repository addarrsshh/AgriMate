import { analyzePriceTrends } from './priceAnalysisService';
import { getCropById } from './dataAccessService';
import {
  ISellHoldDecisionInput,
  ISellHoldDecisionResult,
  DecisionType
} from '../types';

/**
 * Deterministic Sell / Hold / Monitor Decision-Support Engine
 * 
 * NOTE: Strictly deterministic. Does not use LLM for numerical triggers.
 * Explicitly framed as decision-support guidance rather than a guaranteed prediction.
 */

export const evaluateSellHoldDecision = async (
  params: ISellHoldDecisionInput
): Promise<ISellHoldDecisionResult> => {
  const {
    cropId,
    storageDaysRemaining = 60,
    hasSevereRainForecast = false,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mandiId = null
  } = params;

  const crop = await getCropById(cropId);
  if (!crop) {
    throw new Error(`Crop not found: ${cropId}`);
  }

  const analysis = await analyzePriceTrends(cropId);
  const {
    currentPrice,
    sma7,
    sma30,
    changePct7d,
    volatilityIndex,
    maxPrice30d,
    trend
  } = analysis;

  let decision: DecisionType = "MONITOR";
  let confidenceScore = 70; // 0 to 100
  const reasons: string[] = [];
  const riskFactors: string[] = [];
  const actionPoints: string[] = [];

  const priceToSMA30Ratio = currentPrice / (sma30 || currentPrice);
  const isHighlyPerishable = (crop.shelfLifeDays || 90) <= 20;

  // RULE SET 1: Perishability & Weather Risk Override -> Force SELL
  if (isHighlyPerishable && storageDaysRemaining <= 5) {
    decision = "SELL";
    confidenceScore = 95;
    reasons.push(`${crop.name} has a short shelf-life (${crop.shelfLifeDays} days); waiting risks spoilages or distress sales.`);
    actionPoints.push("Liquidate stock immediately at the nearest mandi to minimize post-harvest loss.");
  } else if (hasSevereRainForecast && isHighlyPerishable) {
    decision = "SELL";
    confidenceScore = 90;
    reasons.push("Impending heavy rainfall forecast poses critical moisture damage and fungal risk during transit/storage.");
    actionPoints.push("Harvest and dispatch to market before the rain event begins.");
  }
  // RULE SET 2: High Price with Momentum Slowdown -> SELL
  else if (priceToSMA30Ratio >= 1.06 && changePct7d <= 0.8) {
    decision = "SELL";
    confidenceScore = 88;
    reasons.push(`Current price (₹${currentPrice}/qtl) is ${Math.round((priceToSMA30Ratio - 1) * 100)}% above its 30-day baseline (₹${sma30}/qtl).`);
    reasons.push("7-day price momentum has flattened, indicating potential buyer resistance or supply influx.");
    actionPoints.push("Lock in current premium rates by bringing produce to market over the next 2-4 days.");
    riskFactors.push("Holding longer risks catching a supply surge that could depress local prices.");
  }
  // RULE SET 3: Strong Bullish Momentum with Safe Storage -> HOLD
  else if (changePct7d >= 2.5 && currentPrice > sma7 && sma7 > sma30 && storageDaysRemaining > 15) {
    decision = "HOLD";
    confidenceScore = 84;
    reasons.push(`Strong upward price momentum: Prices have surged +${changePct7d}% over the past 7 days.`);
    reasons.push(`Current rate (₹${currentPrice}) is trending consistently above both 7-day (₹${sma7}) and 30-day (₹${sma30}) moving averages.`);
    reasons.push(`Adequate remaining storage window (${storageDaysRemaining} days remaining).`);
    actionPoints.push("Hold produce for 5 to 7 days while monitoring daily arrivals.");
    actionPoints.push("Set a stop-price threshold at ₹" + Math.round(sma7 * 0.98) + "/qtl to protect gains.");
    riskFactors.push("Market volatility could reverse quickly if sudden bumper arrivals reach major mandis.");
  }
  // RULE SET 4: Below Moving Average with Downward Drift -> MONITOR or HOLD for Rebound
  else if (currentPrice < sma30 && changePct7d <= -2.0) {
    decision = "MONITOR";
    confidenceScore = 75;
    reasons.push(`Price is currently depressed (₹${currentPrice} vs 30-day average of ₹${sma30}).`);
    reasons.push("Selling now would realize rates near the lower quartile of the monthly range.");
    if (storageDaysRemaining > 20) {
      actionPoints.push("If storage conditions permit, wait for market supply to stabilize.");
      actionPoints.push("Keep produce in dry storage and monitor mandi arrival volume daily.");
    } else {
      actionPoints.push("Storage window is narrowing. Prepare for staggered sales if prices do not rebound within 5 days.");
    }
    riskFactors.push("Price may remain subdued if nationwide harvest arrivals continue to peak.");
  }
  // RULE SET 5: Default Consolidation -> MONITOR
  else {
    decision = "MONITOR";
    confidenceScore = 72;
    reasons.push(`Price is oscillating within a stable trading range (±${Math.abs(changePct7d)}% over 7 days).`);
    reasons.push(`Current rate (₹${currentPrice}) is in balance with 30-day average (₹${sma30}).`);
    actionPoints.push("Observe nearby mandi prices and wait for a clear directional breakout.");
    riskFactors.push("Storage costs and insect infestation risks during extended holding.");
  }

  return {
    cropId,
    cropName: crop.name,
    decision, // "SELL" | "HOLD" | "MONITOR"
    confidenceScore,
    currentPrice,
    sma7,
    sma30,
    priceChangePct7d: changePct7d,
    volatilityIndex,
    trend,
    reasons,
    actionPoints,
    riskFactors,
    generatedAt: new Date().toISOString(),
    disclaimer: "DISCLAIMER: This recommendation is a decision-support guide generated by historical statistical analysis and market patterns. It does NOT constitute a financial guarantee. Always cross-verify local mandi physical arrivals, moisture grades, and buyer discounts."
  };
};
