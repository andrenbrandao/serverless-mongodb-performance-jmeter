import 'source-map-support/register';

import type { APIGatewayProxyHandler } from 'aws-lambda';
import { formatJSONResponse } from '@/libs/apiGateway';
import { middyfy } from '@/libs/lambda';
import { getConnection } from '@/libs/mongodb';
import Region from '@/models/Region';

const getProducts: APIGatewayProxyHandler = async (event, context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // Also needs this so that the lambda won't keep hanging with the open connection.
  // https://mongoosejs.com/docs/lambda.html
  context.callbackWaitsForEmptyEventLoop = false;
  await getConnection();

  const { limit = 10 } = event.queryStringParameters || {};

  const regions = await Region.find({}, { name: 1 })
    .limit(Number(limit))
    .lean();

  return formatJSONResponse({ regions });
};

export const main = middyfy(getProducts);
