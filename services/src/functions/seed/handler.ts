import 'source-map-support/register';

import {
  formatJSONResponse,
  ValidatedEventAPIGatewayProxyEvent,
} from '@/libs/apiGateway';
import { middyfy } from '@/libs/lambda';
import { createRegionsWithProducts } from './seed';
import schema from './schema';

const seed: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (
  event,
  context,
) => {
  // Make sure to add this so you can re-use `conn` between function calls.
  // Also needs this so that the lambda won't keep hanging with the open connection.
  // https://mongoosejs.com/docs/lambda.html
  context.callbackWaitsForEmptyEventLoop = false;

  const { numProductsPerRegion = 100000 } = event.body || {};
  const { optimized = false } = event.queryStringParameters || {};
  const optimizedFlag = optimized === 'true';

  await createRegionsWithProducts(numProductsPerRegion, optimizedFlag);

  return formatJSONResponse({
    message: 'Seed successfully generated!',
  });
};

export const main = middyfy(seed);
