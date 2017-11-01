const connectMongo = require('./mongo-connector');

const test = async () => {
  const mongo = await connectMongo();
  const testResponse = await mongo.Test.insert({foo: 'bar'});

  console.log(testResponse);

  const find = await mongo.Test.find().toArray();

  console.log(find);
};

test();
