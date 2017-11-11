module.exports = async (mysql, mongoDB, orderId) => {
  console.log('=============Migrating Orders Lines=============');
  console.time('migratingOrderLines');

  let mongoOrdersLines = mongoDB.collection('ordersLines');
  let mongoSuppliers = mongoDB.collection('suppliers');
  let mongoProducts = mongoDB.collection('products');

  let [suppliers, products] = await Promise.all([
    mongoSuppliers.find().toArray(),
    mongoProducts.find().toArray()
  ]);

  let suppliersLookup = suppliers
    .reduce((lookup, item) => {
      lookup[item.id] = item;
      return lookup;
    }, {});

  let productsLookup = products
    .reduce((lookup, item) => {
      lookup[item.id] = item;
      return lookup;
    }, {});

  const count = await mysql.query('SELECT count(*) as count FROM pedidos_details');
  const pages = Math.ceil(count[0].count/100000);
  const pageSize = 100000;

  for (let i = 0; i < pages; i++) {
    let lineBatch = [];
    let offset = i * pageSize;

    (await mysql.query(`SELECT * FROM pedidos_details limit ${pageSize} offset ${offset}`))
      .forEach(async (item) => {
        const supplier = item.supplier_id && suppliersLookup[item.supplier_id]
          ? suppliersLookup[item.supplier_id]._id
          : null;

        const product = item.product_id && productsLookup[item.product_id]
          ? productsLookup[item.product_id]._id
          : null;

        lineBatch.push({
          id: item.id,
          order: item.pedido_id,
          invoiceId: item.invoice_id,
          warehouse: item.warehouse,
          maiId: item.mai_id,
          supplier: {
            id: supplier,
            name: item.supplier_name,
          },
          product: {
            id: product,
            code: item.product_codigo,
            name: item.product_name,
            qty: item.product_qty,
            price: item.product_price
          },
          totalLine: item.total_line,
          createdAt: item.created_at,
          updatedAt: item.updated_at
        });
      });

    if (lineBatch.length) {
      await mongoOrdersLines.insertMany(lineBatch);
    }
  }

  console.timeEnd('migratingOrderLines');
}
