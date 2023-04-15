import 'source-map-support/register';

import type { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@/libs/apiGateway';
import { middyfy } from '@/libs/lambda';
import { getConnection } from '@/libs/mongodb';
import { getProducts } from './getProducts';
import { getProductsOptimized } from './getProductsOptimized';

const getProductsByRegion: APIGatewayProxyHandler = async (event, context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // Also needs this so that the lambda won't keep hanging with the open connection.
  // https://mongoosejs.com/docs/lambda.html
  context.callbackWaitsForEmptyEventLoop = false;

  const { id: regionId } = event.pathParameters;
  const { limit = 100, optimized = false } = event.queryStringParameters || {};

  const optimizedFlag = optimized === 'true';

  await getConnection();
  let products;
  if (optimizedFlag) {
    products = await getProductsOptimized(regionId, limit);
  } else {
    products = await getProducts(regionId, limit);
  }

  return formatJSONResponse({ products });
};

export const main = middyfy(getProductsByRegion);
