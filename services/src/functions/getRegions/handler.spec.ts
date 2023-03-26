/* eslint-disable import/no-extraneous-dependencies */
import type { Context, Callback, APIGatewayProxyResult } from 'aws-lambda';
import Region from '@/models/Region';
import createEvent from 'mock-aws-events';
import { main as handler } from './handler';

describe('Get Products Handler', () => {
  it('should fetch all regions', async () => {
    const event = createEvent('aws:apiGateway', {});
    const context = {} as Context;
    const callback = null as Callback;

    await Region.create({
      name: 'Alaska',
      products: [],
    });

    await Region.create({
      name: 'Rio',
      products: [],
    });

    const response: APIGatewayProxyResult = (await handler(
      event,
      context,
      callback,
    )) as APIGatewayProxyResult;

    expect(response.statusCode).toEqual(200);
    expect(JSON.parse(response.body)).toMatchObject({
      regions: expect.arrayContaining([
        expect.objectContaining({ name: 'Alaska' }),
        expect.objectContaining({ name: 'Rio' }),
      ]),
    });
  });
});
