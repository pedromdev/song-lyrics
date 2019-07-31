const {GraphQLSchema} = require('graphql');
const schemaglue = require('schemaglue');
const {makeExecutableSchema} = require('graphql-tools');

const {schema, resolver} = schemaglue(`${__dirname}/types`, {
  js: '**/*.js'
});

module.exports = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolver
});