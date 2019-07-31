const Song = require('../../models/Song');
const Lyric = require('../../models/Lyric');
const {stringToRegexp} = require('../../helpers');

module.exports.resolver = {
  Lyric: {
    song(lyric) {
      return Song.findById(lyric._song_id)
    }
  },
  Query: {
    lyrics(song, args) {
      return Lyric.find(stringToRegexp(args, [
        'text'
      ]))
    }
  }
};