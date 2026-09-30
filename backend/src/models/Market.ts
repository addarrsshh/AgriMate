import mongoose, { Schema } from 'mongoose';
import { IMarketDocument } from '../types';

const MarketSchema = new Schema<IMarketDocument>({
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

const Market = (mongoose.models.Market as mongoose.Model<IMarketDocument>) || mongoose.model<IMarketDocument>('Market', MarketSchema);

export default Market;
