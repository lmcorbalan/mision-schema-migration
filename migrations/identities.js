module.exports = async (mysql, mongoDB) => {
  console.log('=============Migrating Identities=============')
  console.time('accountsIdentities');

  const mongoIdentities = mongoDB.collection('identities');
  const mongoUsers = mongoDB.collection('users');

  const usersLookup = (await mongoUsers.find().toArray())
    .reduce((lookup, item) => (lookup[item.id] = item), {});

  const identities = (await mysql.query('SELECT * FROM identities'))
    .reduce((identities, item) => {
      let user = null;
      if (item.usuario_id && usersLookup[item.usuario_id]) {
        user = usersLookup[item.usuario_id]._id;
      }
      const identity = {
        id: item.id,
        user: user,
        provider: item.provider,
        uid: item.uid,
        token: item.token,
        secret: item.secret,
        refreshToken: item.refresh_token,
        name: item.name,
        email: item.email,
        nickname: item.nickname,
        image: item.image,
        phone: item.phone,
        urls: item.urls,
        expires_at: item.expires_at,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };

      return [...identities, identity];
    }, []);

  if (identities.length) {
    await mongoIdentities.insertMany(identities);
  }

  console.timeEnd('accountsIdentities');
}
