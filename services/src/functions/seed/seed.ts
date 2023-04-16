/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import { faker } from '@faker-js/faker';
import { getConnection } from '@/libs/mongodb';
import Product from '@/models/Product';
import Region, { IRegion } from '@/models/Region';
import { logger } from '@/shared/logger';

async function createBatch(
  numProducts: number,
  optimized: boolean,
  region: IRegion,
) {
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
}

const createProductsForRegion = async (
  region: IRegion,
  numProducts: number,
  optimized: boolean,
) => {
  const batchSize = 10000;
  logger.info(`Creating ${numProducts} products for region ${region.name}`);

  const numBatches = Math.ceil(numProducts / batchSize);
  logger.info(`Inserting ${numBatches} batches of ${batchSize} products`);

  let numProductsLeft = numProducts;
  for (let i = 0; i < numBatches; i += 1) {
    logger.info(
      `Inserting batch number ${i + 1} of total of ${numBatches} batches`,
    );
    const currentBatchSize =
      numProductsLeft > batchSize ? batchSize : numProductsLeft;
    // eslint-disable-next-line no-await-in-loop
    await createBatch(currentBatchSize, optimized, region);
    numProductsLeft -= batchSize;
  }

  logger.info(`Products created for region ${region.name}!`);
};

async function createRegion(name: string): Promise<IRegion> {
  logger.info(`Creationg ${name} region...`);
  return Region.create({
    name,
    products: [],
  });
}

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

  const alaskaRegion = await createRegion('Alaska');
  await createProductsForRegion(alaskaRegion, numProductsPerRegion, optimized);

  const rioRegion = await createRegion('Rio');
  await createProductsForRegion(rioRegion, numProductsPerRegion, optimized);

  logger.info('Regions and products created!');
};

export { createRegionsWithProducts };
