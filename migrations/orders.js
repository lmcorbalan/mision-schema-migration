module.exports = async (mysql, mongoDB) => {
  console.log('=============Migrating Orders=============')
  console.time('accountsOrders');

  let mongoOrders = mongoDB.collection('orders');
  let mongoUsers = mongoDB.collection('users');
  let mongoCircles = mongoDB.collection('circles');
  let mongoPurchases = mongoDB.collection('purchases');

  let [users, circles, purchases, products] = await Promise.all([
    mongoUsers.find().toArray(),
    mongoCircles.find().toArray(),
    mongoPurchases.find().toArray(),
  ]);

  let usersLookup = users
    .reduce((lookup, item) => {
      lookup[item.id] = item;
      return lookup;
    }, {});

  let circlesLookup = circles
    .reduce((lookup, item) => {
      lookup[item.id] = item;
      return lookup;
    }, {});

  let purchasesLookup = purchases
    .reduce((lookup, item) => {
      lookup[item.id] = item;
      return lookup;
    }, {});

  const count = await mysql.query('SELECT count(*) as count FROM pedidos');
  const pageSize = 1000;
  const pages = Math.ceil(count[0].count/pageSize);

  for (let i = 0; i < pages; i++) {
    let orderBatch = [];
    let offset = i * pageSize;

    const orders = (await mysql.query(`SELECT * FROM pedidos limit ${pageSize} offset ${offset}`));

    for (let item of orders) {
      let user = null;
      if (item.usuario_id && usersLookup[item.usuario_id]) {
        user = usersLookup[item.usuario_id]._id;
      }

      let circle = null;
      if (item.circulo_id && circlesLookup[item.circulo_id]) {
        circle = circlesLookup[item.circulo_id]._id;
      }

      let purchase = null;
      if (item.compra_id && purchasesLookup[item.compra_id]) {
        purchase = purchasesLookup[item.compra_id]._id;
      }

      orderBatch.push({
        id: item.id,
        user: user,
        circle: circle,
        purchase: purchase,
        totalDiscount: item.total_discount,
        total: item.total,
        totalProducts: item.total_products,
        invoiceNumber: item.invoice_number,
        invoiceDate: item.invoice_date,
        active: Boolean(item.active),
        saving: item.saving,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      });
    };

    if (orderBatch.length) {
      await mongoOrders.insertMany(orderBatch);
    }
  }

  console.timeEnd('accountsOrders');
}
