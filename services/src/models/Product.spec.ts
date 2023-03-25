import Product from './Product';

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
