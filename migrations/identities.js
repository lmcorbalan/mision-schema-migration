module.exports = async (mysql, mongoDB) => {
    const mongoIdentities = mongoDB.collection('identities');
    const mongoUsers = mongoDB.collection('users');

    const identities = (await mysql.query('SELECT * FROM identities'))
        .reduce((identities, item) => (
            const identity = {
                id: item.id,
                user: item.usuario_id,
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

            return [...results, identity];
        ), []);

    await mongoIdentities.insertMany(identities);

    const usersLookup = (await mongoUsers.find().toArray())
        .reduce((lookup, item) => (lookup[item.id] = item), {});

    const identitiesFromMongo = await mongoIdentities.find();

    for (const identity of identitiesFromMongo) {
        if (identity.user) {
            const user = usersLookup[identity.user];
            if (user) {
                identity.user = user._id;
            }
        }
        mongoIdentities.updateOne({_id: identity._id}, identity);
    }
}