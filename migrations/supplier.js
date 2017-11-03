module.exports = async (mysql, mongoDB) => {
    const mongoSupliers = mongoDB.collection('supliers');

    const supliers = (await mysql.query('SELECT * FROM suppliers'))
        .reduce((supliers, item) => (
            const supplier = {
                id: item.id,
                name: item.name,
                nature: item.nature,
                business_name: item.razon_socialo,
                address: {
                    street: item.calle,
                    zip: item.codigo_postal,
                    city: item.ciudad,
                    pais: ''
                }
                phone: {
                    phone: item.telefono
                    celphone: ''
                }
                contactMame: item.nombre_contacto,
                email: item.email,
                web: item.web,
                latitude: item.latitude,
                longitude: item.longitude,
                errorCode: item.error_code,
                description: item.description,
                logo: item.logo,
                video: item.video,
                active: item.active,
                operationType: item.operation_type,
                ivaCondition: item.iva_condition,
                identityType: item.identity_type,
                identityNumber: item.identity_number,
                inscriptionNumber: item.inscription_number,
                createdAt: item.created_at,
                updatedAt: item.updated_at
            };

            return [...results, supplier];
        ), []);

    await mongoSupliers.insertMany(supliers);
}