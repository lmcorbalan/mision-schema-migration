module.exports = async (mysql, mongoDB) => {
  const mysqlToMongo = {
    suppliers: 'suppliers',
    compras: 'purchases',
    sectors: 'sectors',
    statuses: 'states',
    usuarios: 'users',
    // warehouses: 'warehouses' 
  };

  for (const table of Object.keys(mysqlToMongo)) {
    const collection = mongoDB.collection(mysqlToMongo[table]);

    const results = (await mysql.query(`select * from ${table}`))
      .reduce((results, item) => (
        [...results, {...item}]
      ),[]);

    if (results.length) {
      const ids = await collection.insertMany(results);
    }
  }
};
