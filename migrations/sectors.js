module.exports = async (mysql, mongoDB) => {
    const mongoSectors = mongoDB.collection('sectors');

    const sectors = (await mysql.query('SELECT * FROM sectors'))
        .reduce((sectors, item) => (
            const sector = {
                id: item.id,
                name: item.name,
                description: item.description,
                createdAt: item.created_at,
                updatedAt: item.updated_at
            };

            return [...results, sector];
        ), []);

    await mongoSectors.insertMany(sectors);
}