module.exports = async (mysql, mongoDB) => {
    const mongoAccounts = mongoDB.collection('accounts');
    const mongoUsers = mongoDB.collection('users');

    const accounts = (await mysql.query('SELECT * FROM accounts'))
        .reduce((accounts, item) => (
            const account = {
                id: item.id,
                user: item.usuario_id,
                status: item.status,
                balance: item.balance,
                createdAt: item.created_at,
                updatedAt: item.updated_at
            };

            return [...results, account];
        ), []);

    await mongoAccounts.insertMany(accounts);

    const usersLookup = (await mongoUsers.find().toArray())
        .reduce((lookup, item) => (lookup[item.id] = item), {});

    const accountsFromMongo = await mongoAccounts.find();

    for (const account of accountsFromMongo) {
        if (account.user) {
            const user = usersLookup[account.user];
            if (user) {
                account.user = user._id;
            }
        }
        mongoAccounts.updateOne({_id: account._id}, account);
    }
}