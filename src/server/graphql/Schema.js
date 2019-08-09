const schemaglue = require('schemaglue');
const {makeExecutableSchema} = require('apollo-server');

const {schema, resolver} = schemaglue(`${__dirname}/types`, {
  js: '**/*.js'
});

module.exports = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolver
});