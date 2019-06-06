const {GraphQLObjectType, GraphQLString, GraphQLID, GraphQLList} = require('graphql');
const Lyric = require('../../models/Lyric');
const {stringToRegexp} = require('../../helpers');

const SongType = new GraphQLObjectType({
  name: 'SongType',
  fields: () => ({
    _id: {type: GraphQLID},
    name: {type: GraphQLString},
    artist: {type: GraphQLString},
    youtubeID: {type: GraphQLString},
    lyrics: {
      type: new GraphQLList(require('./LyricType')),
      args: {
        language: {type: GraphQLString},
        text: {type: GraphQLString}
      },
      resolve(song, args) {
        return Lyric.find({
          _song_id: song._id,
          ...stringToRegexp(args, [
            'text'
          ])
        })
      }
    }
  })
});

module.exports = SongType;