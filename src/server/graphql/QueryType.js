const {GraphQLObjectType, GraphQLNonNull, GraphQLList, GraphQLID, GraphQLString} = require('graphql');

const Song = require('../models/Song');

const {stringToRegexp} = require('../helpers');

const QueryType = new GraphQLObjectType({
  name: 'QueryType',
  fields: () => {
    const SongType = require('./types/SongType');

    return {
      song: {
        type: SongType,
        args: {
          id: {type: new GraphQLNonNull(GraphQLID)}
        },
        resolve(parentValue, {id}) {
          return Song.findById(id);
        }
      },
      songs: {
        type: new GraphQLList(SongType),
        args: {
          name: {type: GraphQLString},
          artist: {type: GraphQLString},
          youtubeID: {type: GraphQLString},
        },
        resolve(parentValue, args) {
          return Song.find(stringToRegexp(args, [
            'name',
            'artist'
          ]));
        }
      }
    };
  }
});

module.exports = QueryType;