const {GraphQLSchema} = require('graphql');

const Schema = new GraphQLSchema({
  query: require('./QueryType')
});

module.exports = Schema;