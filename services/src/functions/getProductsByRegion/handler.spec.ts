/* eslint-disable no-underscore-dangle */
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

  it('should fetch products filtered by region with regions embedded when flag optimized is true', async () => {
    const context = {} as Context;
    const callback = null as Callback;

    const region = await Region.create({
      name: 'Alaska',
      products: [],
    });

    await Region.create({
      name: 'Rio',
      products: [{ sku: '222222', price: 250.99 }],
    });

    const product1 = await Product.create({
      sku: '123456',
      name: 'Jump Rope',
      description:
        'The perfect exercise tool for burning calories and improving coordination',
      regions: [{ _id: region._id, price: 50.5 }],
    });

    const product2 = await Product.create({
      sku: '111111',
      name: 'Running Shoes',
      description: 'Special running shoes',
      regions: [{ _id: region._id, price: 105.99 }],
    });

    await Product.create({
      sku: '222222',
      name: 'Sleeping Tent',
      description: 'Waterproff sleeping tent',
    });

    const event = createEvent('aws:apiGateway', {
      pathParameters: { id: region.id },
      queryStringParameters: { optimized: 'true' },
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

  it('should return 404 if region does not exist', async () => {
    const context = {} as Context;
    const callback = null as Callback;

    await Product.create({
      sku: '123456',
      name: 'Jump Rope',
      description:
        'The perfect exercise tool for burning calories and improving coordination',
    });

    await Product.create({
      sku: '111111',
      name: 'Running Shoes',
      description: 'Special running shoes',
    });

    await Region.create({
      name: 'Alaska',
      products: [
        { sku: '123456', price: 50.5 },
        { sku: '111111', price: 105.99 },
      ],
    });

    const event = createEvent('aws:apiGateway', {
      pathParameters: { id: '645c38d52f5c6ee098f9a39' },
    });

    const response: APIGatewayProxyResult = (await handler(
      event,
      context,
      callback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(404);
  });
});
