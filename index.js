const config = require('./config/db');
const mysql = require('promise-mysql');;
const connectMongo = require('./mongo-connector');

const start = async () => {
  const connectMySQL = await mysql.createConnection(config.mysql);
  const mongoDB = await connectMongo();

  let migrate = require('./migrations/categorias');
  await migrate(connectMySQL, mongoDB);

  // ['categorias'].forEach(async (migration) => {
  //   let migrate = require(`./migrations/${migration}`);
  //   await migrate(connectMySQL, mongoDB);
  // })

  mongoDB.close();
  connectMySQL.end();
};

start();
