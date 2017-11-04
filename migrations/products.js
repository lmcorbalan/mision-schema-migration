module.exports = async (mysql, mongoDB) => {
  console.log('=============Migrating Products=============')
  console.time('accountsProducts');

  const mongoCategories = mongoDB.collection('categories');
  const mongoProducts = mongoDB.collection('products');

  const products = (await mysql.query('SELECT * FROM productos'))
    .reduce((products, item) => {
      const product = {
        id: item.id,
        price: item.precio,
        name: item.nombre,
        remitoName: item.remito_name,
        description: item.descripcion,
        allowedAmount: item.cantidad_permitida,
        image: item.imagen,
        marketPrice: item.precio_super,
        supplier: item.supplier_id,
        code: item.codigo,
        hidden: item.oculto,
        saleType: item.sale_type,
        order: item.orden,
        highlight: item.highlight,
        outOfStock: item.faltante,
        pack: item.pack,
        stock: item.stock,
        orden_remito: item.orden_remito,
        cost: item.costo,
        currency: item.moneda,
        margin: item.margen,
        aliquot: item.alicuota,
        createdAt: item.created_at,
        updatedAt: item.updated_at
    };
    return [...products, product];
  }, []);

  if (products.length) {
    const allIds = await mongoProducts.insertMany(products);
  }

  const categoriesLookup = (await mongoCategories.find().toArray())
    .reduce((lookup, item) => {
      lookup[item.id] = item
      return lookup;
    }, {});

  const productsLookup = (await mongoProducts.find().toArray())
    .reduce((lookup, item) => {
      lookup[item.id] = item
      return lookup;
    }, {});

  const categoriesProducts = await mysql.query('select * from categorias_productos');
  for (let cP of categoriesProducts) {
    const categoryId = cP.categoria_id;
    const productId = cP.producto_id;
    if (categoriesLookup[categoryId] && productsLookup[productId]) {
      categoriesLookup[categoryId].products = categoriesLookup[categoryId].products || [];
      categoriesLookup[categoryId].products.push(productsLookup[productId]._id);

      productsLookup[productId].categories = productsLookup[productId].categories || [];
      productsLookup[productId].categories.push(categoriesLookup[categoryId]._id);
    }
  }

  for (let id of Object.keys(categoriesLookup)) {
      const category = categoriesLookup[id];
      const _id = category._id;
      if (_id) {
          mongoCategories.updateOne({_id: _id}, category);
      }
  }

  for (let id of Object.keys(productsLookup)) {
    const product = productsLookup[id];
    const _id = product._id;
    if (_id) {
        mongoProducts.updateOne({_id: _id}, product);
    }
  }

  console.timeEnd('accountsProducts');
}
