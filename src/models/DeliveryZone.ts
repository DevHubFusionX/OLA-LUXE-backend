import mongoose, { Document, Schema } from 'mongoose';

export interface IDeliveryZone extends Document {
  name: string;
  fee: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryZoneSchema = new Schema<IDeliveryZone>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    fee: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: Record<string, unknown>) => {
        ret['id'] = String(ret['_id']);
        delete ret['_id'];
        delete ret['__v'];
        return ret;
      },
    },
  }
);

export const DeliveryZone = mongoose.model<IDeliveryZone>('DeliveryZone', DeliveryZoneSchema);
