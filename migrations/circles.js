module.exports = async (mysql, mongoDB) => {
  console.log('=============Migrating Circles=============')
  console.time('accountsCircles');

  const mongoCircles = mongoDB.collection('circles');
  const mongoUsers = mongoDB.collection('users');

  let [users, circlesPurchases] = await Promise.all([
    mongoUsers.find().toArray(),
    require('./circlesPurchases')(mysql, mongoDB)
  ]);

  let usersLookup = users
    .reduce((lookup, item) => (lookup[item.id] = item), {});

  const circles = (await mysql.query('SELECT * FROM circulos'))
    .reduce((circles, item) => {
      let coordinator = null;
      if (item.coordinador_id && usersLookup[item.coordinador_id]) {
        coordinator = usersLookup[item.coordinador_id];
      }

      const circle = {
        id: item.id,
        coordinator: coordinator,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };

      if (circlesPurchases[item.id]) {
        circle.purchases = circlesPurchases[item.id];
      }

      return [...circles, circle];
    }, []);

  if (circles.length) {
    await mongoCircles.insertMany(circles);
  }

  console.timeEnd('accountsCircles');
}
