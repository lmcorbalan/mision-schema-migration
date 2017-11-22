module.exports = [
  'users', // ready
  'suppliers', // ready
  'categories', // ready
  'products', // ready
  'accounts', // ready
  'identities', // EMPTY
  'purchases',  // ready
  'sectors',  // ready
  'statuses',  // ready
  'warehouses',  // EMPTY
  'circles',  // ready
  'ordersLines', // ready
  'orders'
].map(name => require(`./${name}`));
