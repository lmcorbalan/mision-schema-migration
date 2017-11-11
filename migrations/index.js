module.exports = [
  'categories',
  'products',
  'users',
  'suppliers',
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
