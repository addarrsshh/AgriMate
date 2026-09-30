import mongoose, { Schema } from 'mongoose';
import { IPriceRecordDocument } from '../types';

const PriceRecordSchema = new Schema<IPriceRecordDocument>({
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

const PriceRecord = (mongoose.models.PriceRecord as mongoose.Model<IPriceRecordDocument>) || mongoose.model<IPriceRecordDocument>('PriceRecord', PriceRecordSchema);

export default PriceRecord;
