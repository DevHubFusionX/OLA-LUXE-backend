import mongoose, { Document, Schema } from 'mongoose';

export interface IVariation {
  type: string;
  options: string[];
}

export interface IProduct extends Document {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  description: string;
  variations?: IVariation[];
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VariationSchema = new Schema<IVariation>({
  type: { type: String, required: true },
  options: [{ type: String, required: true }],
});

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    category: {
      type: String,
      required: true,
    },
    description: { type: String, required: true },
    variations: { type: [VariationSchema], default: undefined },
    inStock: { type: Boolean, default: true },
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

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
