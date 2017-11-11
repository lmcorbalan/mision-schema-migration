module.exports = async (mysql, mongoDB) => {
  console.log('=============Getting CirclesPurchases=============')

  const mongoUsers = mongoDB.collection('users');
  const mongoPurchases = mongoDB.collection('purchases');
  const mongoWarehouses = mongoDB.collection('warehouses');

  let [users, purchases, warehouses] = await Promise.all([
    mongoUsers.find().toArray(),
    mongoPurchases.find().toArray(),
    mongoWarehouses.find().toArray()
  ]);

  let usersLookup = users
      .reduce((lookup, item) => {
        lookup[item.id] = item;
        return lookup;
      }, {});
  let purchasesLookup = purchases
      .reduce((lookup, item) => {
        lookup[item.id] = item;
        return lookup;
      }, {});
  let warehousesLookup = warehouses
      .reduce((lookup, item) => {
        lookup[item.id] = item;
        return lookup;
      }, {});

  const circlesPurchases = (await mysql.query('SELECT * FROM circulos_compras'))
    .reduce((lookup, item) => {
      let user = null;
      if (item.usuarios_id && usersLookup[item.usuarios_id]) {
        user = usersLookup[item.usuarios_id]._id
      }

      let warehouse = null;
      if (item.warehouses_id && warehousesLookup[item.warehouses_id]) {
        warehouse = warehousesLookup[item.warehouses_id]._id
      }

      const cp = {
        id: item.id,
        circle: item.circulo_id,
        user: user,
        warehouse: warehouse,
        checkpoint: item.checkpoint,
        deliveryTime: item.delivery_time,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };

      if (item.compra_id && purchasesLookup[item.compra_id]) {
        const purchase = purchasesLookup[item.compra_id]._id
        let byCircle = lookup[cp.circle] || {};

        byCircle[cp.purchase] = cp;
        lookup[cp.circle] = byCircle;
      }

      return lookup
    }, {});

    return circlesPurchases;
}
