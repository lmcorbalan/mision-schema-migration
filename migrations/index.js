module.exports = [
  'users',
  'suppliers',
  'categories',
  'products',
  'accounts',
  'identities',
  'purchases',
  'sectors',
  'statuses',
  'warehouses',
  'circles',
  'ordersLines',
  'orders'
].map(name => require(`./${name}`));
