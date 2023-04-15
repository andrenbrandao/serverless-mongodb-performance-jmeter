/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { getConnection } from '@/libs/mongodb';
import Product from '@/models/Product';
import Region, { IRegion } from '@/models/Region';
import { logger } from '@/shared/logger';

const createProductsForRegion = async (
  region: IRegion,
  numProducts: number,
  optimized: boolean,
) => {
  logger.info(`Creating ${numProducts} products for region ${region.name}`);

  const products = [];
  const productPricesData = [];
  for (let i = 0; i < numProducts; i += 1) {
    const sku = faker.random.alpha({ count: 8, casing: 'upper' });
    const price = faker.commerce.price();
    let product;

    if (optimized) {
      product = new Product({
        sku,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        regions: [{ _id: region._id, price }],
      });
    } else {
      product = new Product({
        sku,
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
      });
    }

    products.push(product);

    productPricesData.push({
      sku,
      price,
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
  optimized = false,
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

  await createProductsForRegion(alaskaRegion, numProductsPerRegion, optimized);

  logger.info('Creating Rio region...');
  const rioRegion = await Region.create({
    name: 'Rio',
    products: [],
  });

  await createProductsForRegion(rioRegion, numProductsPerRegion, optimized);

  logger.info('Regions and products created!');
};

export { createRegionsWithProducts };
