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
  'orders'
].map(name => require(`./${name}`));
