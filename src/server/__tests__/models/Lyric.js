const Lyric = require('../../models/Lyric');
const Song = require('../../models/Song');
const MongooseConnection = require('../../connections/mongoose');

describe('Lyric model', () => {

  beforeAll(async () => {
    await MongooseConnection.open();
  });

  afterAll(async () => {
    await MongooseConnection.close();
  });

  describe('Validations', () => {

    it('should return an error when I try to save a lyric without required fields', async () => {
      const lyric = new Lyric({
        text: ''
      });

      try {
        await lyric.save();
        fail(new Error('Lyric saved'));
      } catch (e) {
        expect(e.errors._song_id.kind).toEqual('required');
        expect(e.errors.language.kind).toEqual('required');
        expect(e.errors.text.kind).toEqual('required');
        expect(e.errors.startAt.kind).toEqual('required');
        expect(e.errors.endAt.kind).toEqual('required');
      }
    });

    it('should return an error when I try to save a lyric language with less than 2 characters', async () => {
      const lyric = new Lyric({
        language: 'a'
      });

      try {
        await lyric.save();
        fail(new Error('Lyric saved'));
      } catch (e) {
        expect(e.errors.language.kind).toEqual('minlength');
      }
    });

    it('should return an error when I try to save a lyric language with more than 5 characters', async () => {
      const lyric = new Lyric({
        language: 'abcdef'
      });

      try {
        await lyric.save();
        fail(new Error('Lyric saved'));
      } catch (e) {
        expect(e.errors.language.kind).toEqual('maxlength');
      }
    });

    it('should return an error when I try to save a lyric startAt before zero', async () => {
      const lyric = new Lyric({
        startAt: -1
      });

      try {
        await lyric.save();
        fail(new Error('Lyric saved'));
      } catch (e) {
        expect(e.errors.startAt.kind).toEqual('min');
      }
    });

  });

  describe('Data', () => {

    let song;

    beforeEach(async () => {
      song = new Song({
        name: 'name',
        artist: 'artist',
        youtubeID: 'youtubeID',
      });

      await song.save();
    });

    afterEach(async () => {
      song = undefined;
      await Song.deleteMany({});
      await Lyric.deleteMany({});
    });

    describe('trim', () => {

      it('should remove whitespaces from both ends', async () => {
        const lyric = new Lyric({
          _song_id: song._id,
          language: '    pt_BR',
          text: 'text     ',
          startAt: 1,
          endAt: 2,
        });

        try {
          await lyric.save();

          expect(lyric.language).toEqual('pt_BR');
          expect(lyric.text).toEqual('text');
        } catch (e) {
          fail(e);
        }
      });

    });

    it('should retrieve the song object', async () => {
      const lyric = new Lyric({
        _song_id: song._id,
        language: '    pt_BR',
        text: 'text     ',
        startAt: 1,
        endAt: 2,
      });

      try {
        await lyric.save();
        const lyricSong = await lyric.getSong();

        expect(lyricSong._id.toHexString()).toEqual(song._id.toHexString());
      } catch (e) {
        fail(e);
      }
    })

  });

});