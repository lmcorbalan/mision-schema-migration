const config = require('./config/db').mongo;
const {Logger, MongoClient} = require('mongodb');

const MONGO_URL = `mongodb://${config.host}:${config.port}/${config.database}`;

module.exports = async () => {
  return await MongoClient.connect(MONGO_URL);

  // Logger.setCurrentLogger((msg, state) => {
  //   console.log(`MONGO DB REQUEST: ${msg}`);
  // });
  // Logger.setLevel('debug');
  // Logger.filter('class', ['Cursor']);

  // return {
  //   Categories: db.collection('categories'),
  //   Test: db.collection('test'),
  // };
}
