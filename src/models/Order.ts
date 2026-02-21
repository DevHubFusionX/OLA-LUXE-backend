import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariation?: string;
}

export interface IOrder extends Document {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  deliveryZone: string;
  deliveryFee: number;
  items: IOrderItem[];
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  selectedVariation: { type: String },
});

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    notes: { type: String },
    deliveryZone: { type: String, required: true },
    deliveryFee: { type: Number, required: true, min: 0 },
    items: { type: [OrderItemSchema], required: true },
    totalPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
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

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
