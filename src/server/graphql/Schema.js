const {GraphQLSchema} = require('graphql');

const Schema = new GraphQLSchema({
  query: require('./QueryType'),
  mutation: require('./MutationType'),
});

module.exports = Schema;