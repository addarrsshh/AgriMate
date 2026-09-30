const mongoose = require('mongoose');

const MarketSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  state: { type: String, required: true },
  district: { type: String, required: true },
  distanceKm: { type: Number, default: 0 },
  tradingVolumeTonsPerDay: { type: Number, default: 0 },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  contactNumber: { type: String },
  speciality: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Market', MarketSchema);
