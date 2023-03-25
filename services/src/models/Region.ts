import { Schema, model } from 'mongoose';
import { IProduct } from './Product';

export interface IRegion {
  name: string;
  products: {
    sku: IProduct['sku'];
    price: number;
  }[];
}

const RegionSchema = new Schema<IRegion>(
  {
    name: { type: String, required: true, index: true, unique: true },
    products: [
      {
        _id: { id: false },
        sku: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true },
);

const Region = model<IRegion>('Region', RegionSchema);

export default Region;
