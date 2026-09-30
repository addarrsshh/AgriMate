import { Document, Types } from 'mongoose';

// ==========================================
// Crop & Agronomy Types
// ==========================================

export interface ICropStage {
  name: string;
  daysAfterSowing?: string;
  waterNeeded?: string;
  action?: string;
}

export interface INPKRatio {
  n: number;
  p: number;
  k: number;
}

export interface IFertilizerRecommendation {
  npkRatioKgPerAcre: INPKRatio;
  conventionalPlan?: string;
  organicPlan?: string;
}

export type CropCategory = 'Cereal' | 'Pulse' | 'Oilseed' | 'Vegetable' | 'CashCrop' | 'Other';
export type Season = 'Kharif' | 'Rabi' | 'Zaid';
export type WaterRequirementLevel = 'Low' | 'Medium' | 'High';

export interface ITempRange {
  min?: number;
  max?: number;
}

export interface IDurationDays {
  min?: number;
  max?: number;
}

export interface ICrop {
  _id?: string | Types.ObjectId;
  id: string;
  name: string;
  scientificName?: string;
  category: CropCategory;
  suitableSeasons: Season[];
  soilSuitability: string[];
  waterRequirement?: string;
  waterRequirementLevel?: WaterRequirementLevel;
  idealTempCelsius?: ITempRange;
  durationDays?: IDurationDays;
  averageYieldPerAcreKg: number;
  cultivationCostPerAcre: number;
  currentModalPricePerQuintal: number;
  mspPerQuintal: number | null;
  shelfLifeDays: number;
  stages?: ICropStage[];
  fertilizerRecommendation?: IFertilizerRecommendation;
  pestManagement?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type ICropDocument = ICrop & Document;

// ==========================================
// Market & Mandi Types
// ==========================================

export interface IMarket {
  _id?: string | Types.ObjectId;
  id: string;
  name: string;
  state: string;
  district: string;
  distanceKm: number;
  tradingVolumeTonsPerDay: number;
  latitude: number;
  longitude: number;
  contactNumber?: string;
  speciality?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type IMarketDocument = IMarket & Document;

export interface IMandiPriceRate {
  marketId: string;
  marketName: string;
  state: string;
  distanceKm: number;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface ICropPriceOverview {
  cropId: string;
  cropName: string;
  category: string;
  overallModalPrice: number;
  mspPerQuintal: number | null;
  highestPayingMarket: IMandiPriceRate;
  mandiRates: IMandiPriceRate[];
}

// ==========================================
// Fertilizer Types
// ==========================================

export type FertilizerType = 'Chemical' | 'Organic' | 'Biofertilizer';

export interface IFertilizer {
  _id?: string | Types.ObjectId;
  id: string;
  name: string;
  type: FertilizerType;
  npk: string;
  bagSizeKg: number;
  subsidizedRatePerBag: number;
  commercialRatePerBag: number;
  applicationStage: string;
  organic: boolean;
  benefits?: string;
  precautions?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type IFertilizerDocument = IFertilizer & Document;

// ==========================================
// Historical Price Record Types
// ==========================================

export interface IPriceRecord {
  _id?: string | Types.ObjectId;
  cropId: string;
  marketId: string;
  date: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  volumeTons: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export type IPriceRecordDocument = IPriceRecord & Document;

// ==========================================
// Recommendation & Suitability Types
// ==========================================

export interface IFarmerProfile {
  soilType?: string;
  season?: string;
  waterAvailability?: string;
  landSizeAcres?: number;
}

export interface ICropSuitabilityBreakdown {
  soilScore: number;
  seasonScore: number;
  waterScore: number;
  profitScore: number;
}

export interface ICropSuitabilityScore {
  cropId: string;
  cropName: string;
  category: string;
  score: number;
  estimatedGrossRevenuePerAcre: number;
  estimatedCultivationCostPerAcre: number;
  estimatedNetProfitPerAcre: number;
  totalProjectedProfit: number;
  breakdown: ICropSuitabilityBreakdown;
  reasons: string[];
  risks: string[];
  durationDays?: IDurationDays;
  averageYieldPerAcreKg: number;
  currentModalPricePerQuintal: number;
  mspPerQuintal: number | null;
}

export interface ICropRecommendationResult {
  farmerProfile: IFarmerProfile;
  topRecommendation: ICropSuitabilityScore | null;
  recommendations: ICropSuitabilityScore[];
}

// ==========================================
// Price Analysis Types
// ==========================================

export interface IPriceTrendAnalysis {
  cropId: string;
  currentPrice: number;
  sma7: number;
  sma30: number;
  price7dAgo: number;
  price30dAgo: number;
  changePct7d: number;
  changePct30d: number;
  volatilityIndex: number;
  volatilityLevel: 'High' | 'Moderate' | 'Low';
  minPrice30d: number;
  maxPrice30d: number;
  trend: string;
  momentum: string;
  lastUpdated: string;
  history: IPriceRecord[];
}

// ==========================================
// Decision Engine Types
// ==========================================

export type DecisionType = 'SELL' | 'HOLD' | 'MONITOR';

export interface ISellHoldDecisionInput {
  cropId: string;
  storageDaysRemaining?: number;
  hasSevereRainForecast?: boolean;
  mandiId?: string | null;
}

export interface ISellHoldDecisionResult {
  cropId: string;
  cropName: string;
  decision: DecisionType;
  confidenceScore: number;
  currentPrice: number;
  sma7: number;
  sma30: number;
  priceChangePct7d: number;
  volatilityIndex: number;
  trend: string;
  reasons: string[];
  actionPoints: string[];
  riskFactors: string[];
  generatedAt: string;
  disclaimer: string;
}

// ==========================================
// Profit Calculation Types
// ==========================================

export interface IProfitCalculationInput {
  cropId?: string;
  acreage?: number;
  customYieldKgPerAcre?: number | null;
  customPricePerQuintal?: number | null;
  seedCost?: number | null;
  fertilizerCost?: number | null;
  laborCost?: number | null;
  irrigationCost?: number | null;
  machineryCost?: number | null;
  transportCostPerQuintal?: number;
  otherCost?: number | null;
}

export interface IProfitCalculationResult {
  cropName: string;
  acreage: number;
  productionMetrics: {
    yieldPerAcreKg: number;
    totalYieldKg: number;
    totalYieldQuintals: number;
  };
  pricingMetrics: {
    pricePerQuintal: number;
    breakEvenPricePerQuintal: number;
  };
  financialSummary: {
    grossRevenue: number;
    totalExpenses: number;
    netProfit: number;
    profitPerAcre: number;
    roiPercentage: number;
    isProfitable: boolean;
  };
  costBreakdown: {
    seedExpense: number;
    fertilizerExpense: number;
    laborExpense: number;
    irrigationExpense: number;
    machineryExpense: number;
    transportExpense: number;
    miscExpense: number;
  };
}

// ==========================================
// Weather Types
// ==========================================

export interface IForecastDay {
  day: string;
  date: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  rainMm: number;
  sprayRisk: string;
}

export interface IAgroAdvisory {
  category: string;
  advice: string;
}

export interface ICurrentWeather {
  tempCelsius: number;
  condition: string;
  humidityPct: number;
  windSpeedKmh: number;
  rainfallChancePct: number;
  uvIndex: number;
  soilTempCelsius: number;
  evapotranspirationMm: number;
}

export interface IWeatherData {
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  current: ICurrentWeather;
  forecast7Day: IForecastDay[];
  agroAdvisories: IAgroAdvisory[];
  source: string;
  lastUpdated: string;
  notice?: string;
}

// ==========================================
// AI Assistant Types
// ==========================================

export interface IAIAssistantResponse {
  answer: string;
  mode: string;
  model?: string;
  notice?: string;
  suggestedFollowUps?: string[];
}

export interface IAIAssistantContext {
  location?: string;
  cropName?: string;
  [key: string]: unknown;
}

// ==========================================
// System & Database Types
// ==========================================

export interface IDBStatus {
  connected: boolean;
  type: string;
}

export interface IHealthStatus {
  status: string;
  service: string;
  uptimeSeconds: number;
  timestamp: string;
  database: IDBStatus;
  integrations: {
    aiConfigured: boolean;
    aiProvider: string;
    weatherConfigured: boolean;
  };
}

export interface IApiSuccessResponse<T> {
  success: true;
  count?: number;
  data: T;
  cropId?: string;
}

export interface IApiErrorResponse {
  success: false;
  message?: string;
  error?: {
    message: string;
    statusCode: number;
    path: string;
    timestamp: string;
  };
}
