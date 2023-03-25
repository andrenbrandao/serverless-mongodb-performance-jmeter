import 'source-map-support/register';

import type { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@/libs/apiGateway';
import { middyfy } from '@/libs/lambda';
import { getConnection } from '@/libs/mongodb';
import Product from '@/models/Product';

const getProducts: APIGatewayProxyHandler = async (_, context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // Also needs this so that the lambda won't keep hanging with the open connection.
  // https://mongoosejs.com/docs/lambda.html
  context.callbackWaitsForEmptyEventLoop = false;
  await getConnection();

  const products = await Product.find().lean();

  return formatJSONResponse({ products });
};

export const main = middyfy(getProducts);
