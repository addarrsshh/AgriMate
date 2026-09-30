import mongoose, { Schema } from 'mongoose';
import { IFertilizerDocument } from '../types';

const FertilizerSchema = new Schema<IFertilizerDocument>({
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

const Fertilizer = (mongoose.models.Fertilizer as mongoose.Model<IFertilizerDocument>) || mongoose.model<IFertilizerDocument>('Fertilizer', FertilizerSchema);

export default Fertilizer;
