import 'source-map-support/register';

import type { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@/libs/apiGateway';
import { middyfy } from '@/libs/lambda';
import { getConnection } from '@/libs/mongodb';
import Region from '@/models/Region';

const getProductsByRegion: APIGatewayProxyHandler = async (_, context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // Also needs this so that the lambda won't keep hanging with the open connection.
  // https://mongoosejs.com/docs/lambda.html
  context.callbackWaitsForEmptyEventLoop = false;

  await getConnection();
  const products = await Region.aggregate([
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

  return formatJSONResponse({ products });
};

export const main = middyfy(getProductsByRegion);
