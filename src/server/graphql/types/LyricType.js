const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt} = require('graphql');
const Song = require('../../models/Song');

const LyricType = new GraphQLObjectType({
  name: 'LyricType',
  fields: () => ({
    _id: {
      type: GraphQLID
    },
    language: {
      type: GraphQLString
    },
    text: {
      type: GraphQLString
    },
    startAt: {
      type: GraphQLInt
    },
    endAt: {
      type: GraphQLInt
    },
    song: {
      type: require('./SongType'),
      resolve(lyric) {
        return Song.findById(lyric._song_id)
      }
    }
  })
});

module.exports = LyricType;