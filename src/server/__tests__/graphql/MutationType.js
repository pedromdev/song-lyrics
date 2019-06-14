const {graphql} = require('graphql');
const {ObjectID} = require('mongodb');

const Schema = require('../../graphql/Schema');
const Song = require('../../models/Song');
const Lyric = require('../../models/Lyric');

jest.mock('../../models/Song');
jest.mock('../../models/Lyric');

describe('GraphQL MutationType', () => {

  describe('addSong mutation', () => {

    it('should add a song', async () => {
      const _id = new ObjectID();
      const name = 'Name';
      const artist = 'Artist';
      const youtubeID = 'youtubeID';

      Song.mockImplementationOnce(() => ({
        async save() {
          return {
            _id,
            name,
            artist,
            youtubeID
          };
        }
      }));

      const {data: {song}} = await graphql(Schema, `
        mutation {
          song: addSong(name: "${name}", artist: "${artist}", youtubeID: "${youtubeID}") {
            _id
            name
            artist
            youtubeID
          }
        }
      `);

      expect(Song).toHaveBeenCalledTimes(1);
      expect(Song).toHaveBeenCalledWith({name, artist, youtubeID});
      expect(song._id).toEqual(_id.toHexString());
      expect(song.name).toEqual(name);
      expect(song.artist).toEqual(artist);
      expect(song.youtubeID).toEqual(youtubeID);
    });

  });

});