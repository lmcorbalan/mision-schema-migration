module.exports = async (mysql, mongoDB) => {
    const mongoWarehouses = mongoDB.collection('warehouses');

    const warehouses = (await mysql.query('SELECT * FROM warehouses'))
        .reduce((warehouses, item) => (
            const warehouse = {
                id: item.id,
                name: item.name,
                description: item.description,
                address: item.address,
                telephone: item.telephone,
                workingHours: item.working_hours,
                attendant: item.attendant,
                createdAt: item.created_at,
                updatedAt: item.updated_at
            };

            return [...results, warehouse];
        ), []);

    await mongoWarehouses.insertMany(warehouses);
}