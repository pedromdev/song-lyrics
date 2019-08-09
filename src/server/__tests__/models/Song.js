const Song = require('../../models/Song');

describe('Song model', () => {

  describe('Validations', () => {

    it('should return an error when I try to save a song without required fields', async () => {
      const song = new Song({
        name: ''
      });

      try {
        await song.save();
        fail(new Error('Song saved'));
      } catch (e) {
        expect(e.errors.name.kind).toEqual('required');
        expect(e.errors.artist.kind).toEqual('required');
        expect(e.errors.youtubeID.kind).toEqual('required');
      }
    });

  });

  describe('Data', () => {

    afterEach(async () => {
      await Song.deleteMany({});
    });

    describe('trim', () => {

      it('should remove whitespaces from both ends', async () => {
        const song = new Song({
          name: '    name',
          artist: 'artist     ',
          youtubeID: '    youtubeID    '
        });

        try {
          await song.save();

          expect(song.name).toEqual('name');
          expect(song.artist).toEqual('artist');
          expect(song.youtubeID).toEqual('youtubeID');
        } catch (e) {
          fail(e);
        }
      });

    });

  });

});