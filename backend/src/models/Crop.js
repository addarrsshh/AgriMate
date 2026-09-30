const mongoose = require('mongoose');

const StageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  daysAfterSowing: { type: String },
  waterNeeded: { type: String },
  action: { type: String }
}, { _id: false });

const FertilizerRecommendationSchema = new mongoose.Schema({
  npkRatioKgPerAcre: {
    n: { type: Number, default: 0 },
    p: { type: Number, default: 0 },
    k: { type: Number, default: 0 }
  },
  conventionalPlan: { type: String },
  organicPlan: { type: String }
}, { _id: false });

const CropSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, index: true },
  scientificName: { type: String },
  category: {
    type: String,
    enum: ['Cereal', 'Pulse', 'Oilseed', 'Vegetable', 'CashCrop', 'Other'],
    required: true
  },
  suitableSeasons: [{ type: String, enum: ['Kharif', 'Rabi', 'Zaid'] }],
  soilSuitability: [{ type: String }],
  waterRequirement: { type: String },
  waterRequirementLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
  idealTempCelsius: {
    min: { type: Number },
    max: { type: Number }
  },
  durationDays: {
    min: { type: Number },
    max: { type: Number }
  },
  averageYieldPerAcreKg: { type: Number, required: true },
  cultivationCostPerAcre: { type: Number, required: true },
  currentModalPricePerQuintal: { type: Number, required: true },
  mspPerQuintal: { type: Number, default: null },
  shelfLifeDays: { type: Number, default: 90 },
  stages: [StageSchema],
  fertilizerRecommendation: FertilizerRecommendationSchema,
  pestManagement: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Crop', CropSchema);
