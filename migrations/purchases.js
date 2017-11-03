module.exports = async (mysql, mongoDB) => {
    const mongoPurchases = mongoDB.collection('purchases');

    const purchases = (await mysql.query('SELECT * FROM compras'))
        .reduce((purchases, item) => (
            const purchase = {
                id: item.id,
                name: item.nombre,
                description: item.descripcion,
                type: item.tipo,
                dates: {
                    purchase: {
                        start: item.fecha_inicio_compras,
                        end: item.fecha_fin_compras
                    }
                    payment: {
                        start: item.fecha_inicio_pagos,
                        end: item.fecha_fin_pagos
                    }
                    setup: {
                        start: item.fecha_inicio_armado,
                        end: item.fecha_fin_armado
                    }
                    delivery: item.fecha_entrega_compras
                }
            };

            return [...results, purchase];
        ), []);

    await mongoPurchases.insertMany(purchases);
}