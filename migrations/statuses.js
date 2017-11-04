module.exports = async (mysql, mongoDB) => {
  console.log('=============Migrating Statuses=============')
  console.time('accountsStatuses');

  const mongoStates = mongoDB.collection('statuses');

  const statuses = (await mysql.query('SELECT * FROM statuses'))
    .reduce((statuses, item) => {
      const status = {
        id: item.id,
        name: item.name,
        description: item.description,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };

    return [...statuses, status];
  }, []);

  if (statuses.length) {
    await mongoStates.insertMany(statuses);
  }

  console.timeEnd('accountsStatuses');
}
