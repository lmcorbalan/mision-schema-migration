module.exports = [
  'users',
  'suppliers', // ready
  'categories', // ready
  'products', // ready
  'accounts',
  'identities', // EMPTY
  'purchases',  // ready
  'sectors',  // ready
  'statuses',  // ready
  'warehouses',  // EMPTY
  'circles',
  'ordersLines',
  'orders'
].map(name => require(`./${name}`));
