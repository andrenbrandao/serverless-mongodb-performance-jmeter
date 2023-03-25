import 'source-map-support/register';

import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { formatJSONResponse } from '@/libs/apiGateway';
import { middyfy } from '@/libs/lambda';
import { createProducts } from './seed';

const seed: APIGatewayProxyHandlerV2 = async (_, context) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // Also needs this so that the lambda won't keep hanging with the open connection.
  // https://mongoosejs.com/docs/lambda.html
  context.callbackWaitsForEmptyEventLoop = false;

  await createProducts();

  return formatJSONResponse({
    message: 'Seed successfully generated!',
  });
};

export const main = middyfy(seed);
