const MongooseConnection = require('../connections/mongoose');

jest.setTimeout(15000);

beforeAll(async () => {
  await MongooseConnection.open();
});

afterAll(async () => {
  await MongooseConnection.close();
});