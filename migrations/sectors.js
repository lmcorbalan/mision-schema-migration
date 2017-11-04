module.exports = async (mysql, mongoDB) => {
  console.log('=============Migrating Sectors=============')
  console.time('accountsSectors');

  const mongoSectors = mongoDB.collection('sectors');

  const sectors = (await mysql.query('SELECT * FROM sectors'))
    .reduce((sectors, item) => {
      const sector = {
        id: item.id,
        name: item.name,
        description: item.description,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };

      return [...sectors, sector];
    }, []);

  if (sectors.length) {
    await mongoSectors.insertMany(sectors);
  }

  console.timeEnd('accountsSectors');
}
