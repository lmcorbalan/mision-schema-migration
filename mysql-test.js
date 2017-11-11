const config = require('./config/db');
const mysql = require('promise-mysql');

const start = async () => {
  const connectMySQL = await mysql.createConnection(config.mysql);

  const orders = (await connectMySQL.query('SELECT * FROM pedidos limit 4')).map((pedido) => {
    console.log(pedido.items)
  })
};

start();
