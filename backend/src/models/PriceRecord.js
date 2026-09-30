const mongoose = require('mongoose');

const PriceRecordSchema = new mongoose.Schema({
  cropId: { type: String, required: true, index: true },
  marketId: { type: String, required: true, index: true },
  date: { type: String, required: true, index: true },
  modalPrice: { type: Number, required: true },
  minPrice: { type: Number, required: true },
  maxPrice: { type: Number, required: true },
  volumeTons: { type: Number, default: 0 }
}, {
  timestamps: true
});

PriceRecordSchema.index({ cropId: 1, marketId: 1, date: -1 });

module.exports = mongoose.model('PriceRecord', PriceRecordSchema);
