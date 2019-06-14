const {GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt} = require('graphql');

const Song = require('../models/Song');
const Lyric = require('../models/Lyric');

const MutationType = new GraphQLObjectType({
  name: 'MutationType',
  fields: () => {
    const SongType = require('./types/SongType');

    return {
      addSong: {
        type: SongType,
        args: {
          name: {type: new GraphQLNonNull(GraphQLString)},
          artist: {type: new GraphQLNonNull(GraphQLString)},
          youtubeID: {type: new GraphQLNonNull(GraphQLString)}
        },
        resolve(parentValue, {name, artist, youtubeID}) {
          const song = new Song({name, artist, youtubeID});

          return song.save();
        }
      }
    };
  }
});

module.exports = MutationType;