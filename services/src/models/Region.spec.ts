import Region from './Region';

it('should be able to create a new region with products skus referenced inside it', async () => {
  await Region.create({
    name: 'Alaska',
    products: [
      { sku: '123456', price: 50.5 },
      { sku: '111111', price: 105.99 },
    ],
  });

  const regionSaved = await Region.findOne().lean();

  expect(regionSaved).toMatchObject({
    name: 'Alaska',
    products: [
      { sku: '123456', price: 50.5 },
      { sku: '111111', price: 105.99 },
    ],
  });
});
