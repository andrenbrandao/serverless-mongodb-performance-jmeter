/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { getConnection } from '@/libs/mongodb';
import Product from '@/models/Product';
import { logger } from '@/shared/logger';

const createProducts = async (): Promise<void> => {
  logger.info('Connecting to mongodb...');
  await getConnection();

  logger.info('Creating products...');

  const numProducts = 100;
  for (let i = 0; i < numProducts; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await Product.create({
      sku: faker.random.alpha({ count: 8, casing: 'upper' }),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
    });
  }

  logger.info('Products created!');
};

export { createProducts };
