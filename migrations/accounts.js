module.exports = async (mysql, mongoDB) => {
  console.log('=============Migrating Accounts=============')
  console.time('accountsMigration');

  const mongoAccounts = mongoDB.collection('accounts');
  const mongoUsers = mongoDB.collection('users');

  const usersLookup = (await mongoUsers.find().toArray())
    .reduce((lookup, item) => {
      lookup[item.id] = item;
      return lookup;
    }, {});

  const accounts = (await mysql.query('SELECT * FROM accounts'))
    .reduce((accounts, item) => {
      const account = {
        id: item.id,
        user: (item.usuario_id && usersLookup[item.usuario_id]) ? usersLookup[item.usuario_id]._id : null,
        status: item.status,
        balance: item.balance,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };

      return [...accounts, account];
    }, []);

  if (accounts.length) {
    await mongoAccounts.insertMany(accounts);
  }

  console.timeEnd('accountsMigration');
}
