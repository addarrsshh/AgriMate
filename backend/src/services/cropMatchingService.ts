import { getAllCrops } from './dataAccessService';
import {
  ICrop,
  IFarmerProfile,
  ICropSuitabilityScore,
  ICropRecommendationResult
} from '../types';

/**
 * Deterministic Crop Suitability Scoring Engine
 * 
 * Formula:
 * Suitability Score (0 - 100) =
 *   (w_soil * S_soil) +
 *   (w_season * S_season) +
 *   (w_water * S_water) +
 *   (w_profit * S_profit)
 * 
 * Weights:
 *   Soil: 30%
 *   Season: 30%
 *   Water: 20%
 *   Profitability: 20%
 */

export const calculateSuitabilityScore = (
  crop: ICrop,
  farmerInput: IFarmerProfile
): ICropSuitabilityScore => {
  const {
    soilType = "Alluvial",
    season = "Rabi",
    waterAvailability = "Medium",
    landSizeAcres = 2
  } = farmerInput;

  let soilScore = 0;
  const normalizedSoil = soilType.trim().toLowerCase();
  const matchedSoil = crop.soilSuitability.some(s => s.toLowerCase().includes(normalizedSoil));
  if (matchedSoil) {
    soilScore = 100;
  } else {
    // Secondary compatibility
    soilScore = 40;
  }

  // Season Scoring (Rabi, Kharif, Zaid)
  let seasonScore = 0;
  const normalizedSeason = season.trim().toLowerCase();
  if (crop.suitableSeasons.some(s => s.toLowerCase() === normalizedSeason)) {
    seasonScore = 100;
  } else {
    seasonScore = 15; // Off-season penalty
  }

  // Water Availability Matching (Low, Medium, High)
  let waterScore = 0;
  const cropWater = crop.waterRequirementLevel || "Medium";
  if (waterAvailability.toLowerCase() === cropWater.toLowerCase()) {
    waterScore = 100;
  } else if (
    (waterAvailability.toLowerCase() === "high" && cropWater === "Medium") ||
    (waterAvailability.toLowerCase() === "medium" && cropWater === "Low")
  ) {
    waterScore = 80; // Farmer has more water than needed
  } else {
    waterScore = 35; // Deficit water penalty
  }

  // Profitability Factor: Estimated net margin per acre relative to baseline
  const estimatedGrossRevenue = (crop.averageYieldPerAcreKg / 100) * crop.currentModalPricePerQuintal;
  const estimatedNetProfit = estimatedGrossRevenue - crop.cultivationCostPerAcre;
  const profitMarginPct = Math.max(0, Math.min(100, Math.round((estimatedNetProfit / crop.cultivationCostPerAcre) * 100)));
  const profitScore = Math.min(100, Math.max(30, profitMarginPct));

  // Weighted Composite Score
  const totalScore = Math.round(
    (0.30 * soilScore) +
    (0.30 * seasonScore) +
    (0.20 * waterScore) +
    (0.20 * profitScore)
  );

  // Generate actionable rationale
  const reasons: string[] = [];
  if (soilScore === 100) reasons.push(`Highly compatible with ${soilType} soil.`);
  if (seasonScore === 100) reasons.push(`Optimal sowing window for the ${season} season.`);
  if (waterScore >= 80) reasons.push(`Matches your ${waterAvailability.toLowerCase()} irrigation capacity.`);
  if (estimatedNetProfit > 25000) reasons.push(`High financial return: Est. ₹${Math.round(estimatedNetProfit).toLocaleString()} net profit/acre.`);

  const risks: string[] = [];
  if (seasonScore < 50) risks.push(`Not the primary season (${crop.suitableSeasons.join(', ')} recommended).`);
  if (waterScore < 50) risks.push(`Requires ${crop.waterRequirement || 'adequate irrigation'} - risk of water stress.`);

  return {
    cropId: crop.id,
    cropName: crop.name,
    category: crop.category,
    score: totalScore,
    estimatedGrossRevenuePerAcre: Math.round(estimatedGrossRevenue),
    estimatedCultivationCostPerAcre: crop.cultivationCostPerAcre,
    estimatedNetProfitPerAcre: Math.round(estimatedNetProfit),
    totalProjectedProfit: Math.round(estimatedNetProfit * landSizeAcres),
    breakdown: {
      soilScore,
      seasonScore,
      waterScore,
      profitScore
    },
    reasons,
    risks,
    durationDays: crop.durationDays,
    averageYieldPerAcreKg: crop.averageYieldPerAcreKg,
    currentModalPricePerQuintal: crop.currentModalPricePerQuintal,
    mspPerQuintal: crop.mspPerQuintal
  };
};

export const getCropRecommendations = async (
  farmerInput: IFarmerProfile
): Promise<ICropRecommendationResult> => {
  const allCrops = await getAllCrops();
  
  const scoredCrops = allCrops.map(crop => calculateSuitabilityScore(crop, farmerInput));

  // Sort descending by score
  scoredCrops.sort((a, b) => b.score - a.score);

  return {
    farmerProfile: farmerInput,
    topRecommendation: scoredCrops[0] || null,
    recommendations: scoredCrops
  };
};
