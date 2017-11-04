module.exports = async (mysql, mongoDB) => {
  console.log('=============Migrating Orders=============')
  console.time('accountsOrders');

  const mongoOrders = mongoDB.collection('orders');
  const mongoUsers = mongoDB.collection('users');
  const mongoCircles = mongoDB.collection('circles');
  const mongoPurchases = mongoDB.collection('purchases');

  let [users, circles, purchases, ordersLines] = await Promise.all([
    mongoUsers.find().toArray(),
    mongoCircles.find().toArray(),
    mongoPurchases.find().toArray(),
    (require('./ordersLines')(mysql, mongoDB)
  ]);

  let usersLookup = users
    .reduce((lookup, item) => (lookup[item.id] = item), {});
  let circlesLookup = circles
    .reduce((lookup, item) => (lookup[item.id] = item), {});
  let purchasesLookup = purchases
    .reduce((lookup, item) => (lookup[item.id] = item), {});

  const orders = (await mysql.query('SELECT * FROM pedidos'))
    .reduce((orders, item) => {
      let lines = [];
      if (ordersLines[item.id]) {
        lines = ordersLines[item.id];
      }

      let user = null;
      if (item.usuario_id && usersLookup[item.usuario_id]) {
        user = usersLookup[item.usuario_id]._id;
      }

      let circle = null;
      if (item.circulo_id && circlesLookup[item.circulo_id]) {
        circle = circlesLookup[item.circulo_id]._id;
      }

      let purchases = null;
      if (item.compra_id && purchasesLookup[item.compra_id]) {
        purchases = purchasesLookup[item.compra_id]._id;
      }

      const order = {
        id: item.id,
        lines: lines,
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
      };

      return [...orders, order];
    }, []);

  if (orders.length) {
    await mongoOrders.insertMany(orders);
  }

  console.timeEnd('accountsOrders');
}
