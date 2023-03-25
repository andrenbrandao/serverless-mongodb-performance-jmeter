/* eslint-disable import/no-extraneous-dependencies */
import type { Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import Product from '@/models/Product';
import createEvent from 'mock-aws-events';
import { main as handler } from './handler';

describe('Get Products Handler', () => {
  it('should fetch all products', async () => {
    const event = createEvent('aws:apiGateway', {});
    const context = {} as Context;
    const callback = null as Callback;

    const product1 = await Product.create({
      sku: '123456',
      name: 'Jump Rope',
      description:
        'The perfect exercise tool for burning calories and improving coordination',
    });

    const product2 = await Product.create({
      sku: '111111',
      name: 'Running Shoes',
      description: 'Special running shoes.',
    });

    const response: APIGatewayProxyResult = (await handler(
      event,
      context,
      callback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toMatchObject({
      products: expect.arrayContaining([
        expect.objectContaining({ sku: product1.sku }),
        expect.objectContaining({ sku: product2.sku }),
      ]),
    });
  });
});
