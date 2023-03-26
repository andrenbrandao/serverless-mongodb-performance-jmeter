/* eslint-disable import/no-extraneous-dependencies */
import type { Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import Product from '@/models/Product';
import Region from '@/models/Region';
import createEvent from 'mock-aws-events';
import { main as handler } from './handler';

describe('Get Products By Region Handler', () => {
  it('should fetch products filtered by region', async () => {
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
      description: 'Special running shoes',
    });

    await Product.create({
      sku: '222222',
      name: 'Sleeping Tent',
      description: 'Waterproff sleeping tent',
    });

    const region = await Region.create({
      name: 'Alaska',
      products: [
        { sku: '123456', price: 50.5 },
        { sku: '111111', price: 105.99 },
      ],
    });

    await Region.create({
      name: 'Rio',
      products: [{ sku: '222222', price: 250.99 }],
    });

    const event = createEvent('aws:apiGateway', {
      pathParameters: { id: region.id },
    });

    const response: APIGatewayProxyResult = (await handler(
      event,
      context,
      callback,
    )) as APIGatewayProxyResult;

    const responseBody = JSON.parse(response.body);
    expect(response.statusCode).toEqual(200);
    expect(responseBody.products).toHaveLength(2);
    expect(responseBody).toMatchObject({
      products: expect.arrayContaining([
        expect.objectContaining({
          sku: product1.sku,
          name: product1.name,
          price: 50.5,
        }),
        expect.objectContaining({
          sku: product2.sku,
          name: product2.name,
          price: 105.99,
        }),
      ]),
    });
  });
});
