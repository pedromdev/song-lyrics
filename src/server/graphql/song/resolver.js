const Song = require('../../models/Song');
const Lyric = require('../../models/Lyric');
const {stringToRegexp} = require('../../helpers');

module.exports.resolver = {
  Song: {
    lyrics(song, args) {
      return Lyric.find({
        _song_id: song._id,
        ...stringToRegexp(args, [
          'text'
        ])
      })
    }
  },
  Query: {
    song(parentValue, {id}) {
      return Song.findById(id);
    },
    songs(parentValue, args) {
      return Song.find(stringToRegexp(args, [
        'name',
        'artist'
      ]));
    }
  }
};