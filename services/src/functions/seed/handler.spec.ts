/* eslint-disable import/no-extraneous-dependencies */
import type { Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import createEvent from 'mock-aws-events';
import Region from '@/models/Region';
import Product from '@/models/Product';
import { main as handler } from './handler';

describe('Seed', () => {
  it('should create 2 regions and 200 products', async () => {
    const context = {} as Context;
    const callback = null as Callback;

    const event = createEvent('aws:apiGateway', {
      headers: { 'Content-Type': 'application/json' },
      httpMethod: 'POST',
      body: JSON.stringify({ numProductsPerRegion: 100 }),
    });

    const response: APIGatewayProxyResult = (await handler(
      event,
      context,
      callback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);

    const productCount = await Product.count();
    const regionCount = await Region.count();
    expect(productCount).toBe(200);
    expect(regionCount).toBe(2);

    const region = await Region.findOne();
    expect(region.products).toHaveLength(100);
  });

  it('should create products with embedded regions if flag optimized=true', async () => {
    const context = {} as Context;
    const callback = null as Callback;

    const event = createEvent('aws:apiGateway', {
      headers: { 'Content-Type': 'application/json' },
      queryStringParameters: { optimized: 'true' },
      httpMethod: 'POST',
      body: JSON.stringify({ numProductsPerRegion: 100 }),
    });

    const response: APIGatewayProxyResult = (await handler(
      event,
      context,
      callback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);

    const product = await Product.findOne();
    expect(product.regions).toHaveLength(1);
  });
});
