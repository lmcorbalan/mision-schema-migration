module.exports = async (mysql, mongoDB) => {
  console.log('=============Getting Orders Lines=============');
  console.time('gettingOrderLines');

  const mongoSuppliers = mongoDB.collection('suppliers');
  const mongoProducts = mongoDB.collection('products');

  let [suppliers, products] = await Promise.all([
    mongoSuppliers.find().toArray(),
    mongoProducts.find().toArray()
  ]);

  let suppliersLookup = suppliers
    .reduce((lookup, item) => (lookup[item.id] = item), {});

  let productsLookup = products
    .reduce((lookup, item) => (lookup[item.id] = item), {});


  const orderLines = (await mysql.query('SELECT * FROM pedidos_details'))
    .reduce((lines, item) => {
      let supplierId = null;
      if (item.supplier_id && suppliersLookup[item.supplier_id]) {
        supplierId = suppliersLookup[item.supplier_id]._id;
      }

      let productId = null;
      if (item.product_id && productsLookup[item.product_id]) {
        productId = productsLookup[item.product_id]._id;
      }

      const line = {
        id: item.id,
        order: item.pedido_id,
        invoiceId: item.invoice_id,
        warehouse: item.warehouse,
        maiId: item.mai_id,
        supplier: {
          id: supplierId,
          name: item.supplier_name,
        },
        product: {
          id: productId,
          code: item.product_codigo,
          name: item.product_name,
          qty: item.product_qty,
          price: item.product_price
        },
        totalLine: item.total_line,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };

      return [...lines, line];
    }, []);

  console.log('=============Build Lookup=============');

  const retObj = orderLines.reduce((lookup, item) => (lookup[item.order] = item), {});

  console.timeEnd('gettingOrderLines');

  return retObj
}
