const Song = require('../../../models/Song');
const Lyric = require('../../../models/Lyric');
const {stringToRegexp} = require('../../../helpers');

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
  },
  Mutation: {
    async addLyric(parentValue, {songId, language, text, startAt, endAt}) {
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
    },
    async updateLyrics(parentValue, {songId, language, text, startAt, endAt, filter}) {
      if (!filter || !Object.keys(filter).length) return [];

      const props = {songId, language, text, startAt, endAt};
      const lyrics = await Lyric.find(filter);

      return await Promise.all(lyrics.map(async lyric => {
        Object.keys(props)
          .filter(key => !!key)
          .forEach(key => lyric[key] = props[key]);
        await lyric.save();
        return lyric;
      }))
    }
  }
};