/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { getConnection } from '@/libs/mongodb';
import Product from '@/models/Product';
import Region, { IRegion } from '@/models/Region';
import { logger } from '@/shared/logger';

const createProductsForRegion = async (
  region: IRegion,
  numProducts: number,
) => {
  logger.info(`Creating ${numProducts} products for region ${region.name}`);

  const products = [];
  const productPricesData = [];
  for (let i = 0; i < numProducts; i += 1) {
    const sku = faker.random.alpha({ count: 8, casing: 'upper' });
    products.push(
      new Product({
        sku,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
      }),
    );

    productPricesData.push({
      sku,
      price: faker.commerce.price(),
    });
  }

  logger.info('Bulk saving products...');
  await Product.bulkSave(products);

  logger.info('Pushing products to region...');
  await Region.updateOne(
    { _id: region.id },
    {
      $push: { products: { $each: productPricesData } },
    },
  );

  logger.info(`Products created for region ${region.name}!`);
};

const createRegionsWithProducts = async (
  numProductsPerRegion = 10000,
): Promise<void> => {
  logger.info('Connecting to mongodb...');
  await getConnection();

  logger.info('Deleting all products...');
  await Product.deleteMany();

  logger.info('Deleting all regions...');
  await Region.deleteMany();

  logger.info('Creating Alaska region...');
  const alaskaRegion = await Region.create({
    name: 'Alaska',
    products: [],
  });

  await createProductsForRegion(alaskaRegion, numProductsPerRegion);

  logger.info('Creating Rio region...');
  const rioRegion = await Region.create({
    name: 'Rio',
    products: [],
  });

  await createProductsForRegion(rioRegion, numProductsPerRegion);

  logger.info('Regions and products created!');
};

export { createRegionsWithProducts };
