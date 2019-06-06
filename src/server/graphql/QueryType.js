const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID} = require('graphql');

const Song = require('../models/Song');

const QueryType = new GraphQLObjectType({
  name: 'QueryType',
  fields: () => ({
    song: {
      type: require('./types/SongType'),
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID)
        }
      },
      resolve(parentValue, {id}) {
        return Song.findById(id);
      }
    }
  })
});

module.exports = QueryType;