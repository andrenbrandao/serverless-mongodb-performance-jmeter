import Product, { IProduct } from '@/models/Product';
import mongoose from 'mongoose';

export async function getProductsOptimized(
  regionId: string,
  limit: string | number,
): Promise<IProduct[]> {
  const mongoRegionId = new mongoose.Types.ObjectId(regionId);
  return Product.aggregate([
    { $match: { regions: { $elemMatch: { _id: mongoRegionId } } } },
    {
      $unwind: '$regions',
    },
    {
      $match: { 'regions._id': mongoRegionId },
    },
    { $limit: Number(limit) },
    {
      $project: {
        _id: 1,
        sku: 1,
        name: 1,
        description: 1,
        price: '$regions.price',
      },
    },
  ]);
}
