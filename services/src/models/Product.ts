import { Schema, model } from 'mongoose';

export interface IProduct {
  sku: string;
  name: string;
  description: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true },
);

const Product = model<IProduct>('Product', ProductSchema);

export default Product;
