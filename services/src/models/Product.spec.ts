/* eslint-disable no-underscore-dangle */
import Product from './Product';
import Region from './Region';

it('should be able to create a new product', async () => {
  await Product.create({
    sku: '123456',
    name: 'Jump Rope',
    description:
      'The perfect exercise tool for burning calories and improving coordination',
  });

  const productSaved = await Product.findOne().lean();

  expect(productSaved).toMatchObject({
    sku: '123456',
    name: 'Jump Rope',
    description:
      'The perfect exercise tool for burning calories and improving coordination',
  });
});

it('should create a product with a region embedded in it', async () => {
  await Region.create({
    name: 'Alaska',
  });
  const region = await Region.findOne().lean();

  await Product.create({
    sku: '123456',
    name: 'Jump Rope',
    description:
      'The perfect exercise tool for burning calories and improving coordination',
    regions: [{ _id: region._id, price: 55.99 }],
  });

  const productSaved = await Product.findOne().lean();

  expect(productSaved).toMatchObject({
    sku: '123456',
    name: 'Jump Rope',
    description:
      'The perfect exercise tool for burning calories and improving coordination',
    regions: [{ _id: region._id, price: 55.99 }],
  });
});
