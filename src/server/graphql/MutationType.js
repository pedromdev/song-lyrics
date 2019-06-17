const {GraphQLObjectType, GraphQLString, GraphQLNonNull, GraphQLInt} = require('graphql');

const Song = require('../models/Song');
const Lyric = require('../models/Lyric');

const MutationType = new GraphQLObjectType({
  name: 'MutationType',
  fields: () => {
    const SongType = require('./types/SongType');
    const LyricType = require('./types/LyricType');

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
      },
      addLyric: {
        type: LyricType,
        args: {
          songId: {type: new GraphQLNonNull(GraphQLString)},
          language: {type: new GraphQLNonNull(GraphQLString)},
          text: {type: new GraphQLNonNull(GraphQLString)},
          startAt: {type: new GraphQLNonNull(GraphQLInt)},
          endAt: {type: new GraphQLNonNull(GraphQLInt)},
        },
        async resolve(parentValue, {songId, language, text, startAt, endAt}) {
          const song = await Song.findById(songId);

          if (song === null) throw new Error('Song not found');

          const lyric = new Lyric({
            _song_id: song._id,
            language,
            text,
            startAt,
            endAt
          });

          return await lyric.save();
        }
      }
    };
  }
});

module.exports = MutationType;