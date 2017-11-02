const config = require('./config/db');
const mysql = require('promise-mysql');;
const connectMongo = require('./mongo-connector');

const start = async () => {
  const connectMySQL = await mysql.createConnection(config.mysql);
  const mongoDB = await connectMongo();

  await mongoDB.dropDatabase();

  // let migrate = require('./migrations/categorias');
  try {
    for (let migration of ['categorias']) {
      let migrate = require(`./migrations/${migration}`);
      await migrate(connectMySQL, mongoDB);
    }
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    mongoDB.close();
    connectMySQL.end();
  }
};

start();
