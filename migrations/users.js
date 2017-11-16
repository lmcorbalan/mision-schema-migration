module.exports = async (mysql, mongoDB) => {
  console.log('=============Migrating Users=============')
  console.time('accountsUsers');

  const mongoUsers = mongoDB.collection('users');
  const mongoCircles = mongoDB.collection('circles');

  let circlesLookup = (await mongoCircles.find().toArray())
    .reduce((lookup, item) => {
      lookup[item.id] = item;
      return lookup;
    }, {});

  const users = (await mysql.query('SELECT * FROM usuarios'))
    .reduce((users, item) => {
      const circle = item.circulo_id && circlesLookup[item.circulo_id]
        ? circlesLookup[item.circulo_id]._id
        : null;

      const user = {
        id: item.id,
        type: item.type,
        firstName: item.name,
        lastName: item.apellido,
        birthday: item.fecha_de_nacimiento,
        dni: item.dni,
        address: {
          street: item.calle,
          zip: item.codigo_postal,
          city: item.ciudad,
          country: item.pais
        },
        phone: {
          phone: item.tel1,
          celphone: item.cel1
        },
        email: item.email,
        circle: circle,
        nameIva: item.nombre_iva,
        zone: item.zona,
        login: {
          encryptedPassword: item.encrypted_password,
          resetPasswordToken: item.reset_password_token,
          resetPasswordSentAt: item.reset_password_sent_at,
          rememberCreatedAt: item.remember_created_at,
          signInCount: item.sign_in_count,
          currentSignInAt: item.current_sign_in_at,
          lastSignInAt: item.last_sign_in_at,
          currentSignInIp: item.current_sign_in_ip,
          lastSignInIp: item.last_sign_in_ip,
          confirmedAt: item.confirmed_at,
          confirmationToken: item.confirmation_token,
          confirmationSentAt: item.confirmation_sent_at,
          unconfirmedEmail: item.unconfirmed_email
        },
        codigoVendedor: item.codigo_vendedor,
        tipoOperacion: item.tipo_operacion,
        inscripcionIva: item.inscripcion_iva,
        tipoIdentificacion: item.tipo_identificacion,
        numeroIdentificacion: item.numero_identificacion,
        numeroIngresosBrutos: item.numero_ingresos_brutos,
        codigoTransporte: item.codigo_transporte,
        codigoClasificacion: item.codigo_clasificacion,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };

      return [...users, user];
    }, []);

  if (users.length) {
    await mongoUsers.insertMany(users);
  }

  console.timeEnd('accountsUsers');
}
