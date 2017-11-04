const config = require('./config/db');
const mysql = require('promise-mysql');;
const connectMongo = require('./mongo-connector');

const start = async () => {
  const connectMySQL = await mysql.createConnection(config.mysql);
  const mongoDB = await connectMongo();

  await mongoDB.dropDatabase();

  try {
    const migrations = require('./migrations');
    for (let migration of migrations) {
      await migration(connectMySQL, mongoDB);
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
