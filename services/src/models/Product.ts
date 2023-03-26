import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  sku: string;
  name: string;
  description: string;
  regions: {
    _id: Schema.Types.ObjectId;
    price: number;
  }[];
}

const ProductSchema = new Schema<IProduct>(
  {
    sku: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    regions: [
      {
        _id: { type: Schema.Types.ObjectId, required: true, index: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

const Product = model<IProduct>('Product', ProductSchema);

export default Product;
