const Song = require('../../models/Song');
const MongooseConnection = require('../../connections/mongoose');

describe('Song model', () => {

  beforeAll(async () => {
    await MongooseConnection.open();
  });

  afterAll(async () => {
    await MongooseConnection.close();
  });

  describe('Validations', () => {

    it('should return an error when I try to save a song without required fields', async () => {});

  });

});