const mongoose = require('mongoose');

const FertilizerSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['Chemical', 'Organic', 'Biofertilizer'],
    required: true
  },
  npk: { type: String, required: true },
  bagSizeKg: { type: Number, required: true },
  subsidizedRatePerBag: { type: Number, required: true },
  commercialRatePerBag: { type: Number, required: true },
  applicationStage: { type: String, required: true },
  organic: { type: Boolean, default: false },
  benefits: { type: String },
  precautions: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Fertilizer', FertilizerSchema);
