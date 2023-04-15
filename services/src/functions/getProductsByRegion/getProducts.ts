import Region from '@/models/Region';
import { IProduct } from '@/models/Product';
import mongoose from 'mongoose';

export async function getProducts(
  regionId: string,
  limit: string | number,
): Promise<IProduct[]> {
  return Region.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(regionId) } },
    {
      $unwind: '$products',
    },
    {
      $lookup: {
        from: 'products',
        localField: 'products.sku',
        foreignField: 'sku',
        as: 'products.product',
      },
    },
    {
      $unwind: '$products.product',
    },
    { $limit: Number(limit) },
    {
      $project: {
        _id: '$products.product._id',
        sku: '$products.product.sku',
        name: '$products.product.name',
        description: '$products.product.description',
        price: '$products.price',
      },
    },
  ]);
}
