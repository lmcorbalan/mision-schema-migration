module.exports = async (mysql, mongoDB) => {
    const mongoStates = mongoDB.collection('statuses');

    const statuses = (await mysql.query('SELECT * FROM statuses'))
        .reduce((statuses, item) => (
            const state = {
                id: item.id,
                name: item.name,
                description: item.description,
                createdAt: item.created_at,
                updatedAt: item.updated_at
            };

            return [...results, state];
        ), []);

    await mongoStates.insertMany(statuses);
}