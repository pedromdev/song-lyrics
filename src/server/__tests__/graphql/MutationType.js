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

      const {save} = Song.prototype;

      save.mockResolvedValueOnce({
        _id,
        name,
        artist,
        youtubeID
      });

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
      expect(save).toHaveBeenCalledTimes(1);
      expect(song._id).toEqual(_id.toHexString());
      expect(song.name).toEqual(name);
      expect(song.artist).toEqual(artist);
      expect(song.youtubeID).toEqual(youtubeID);
    });

  });

  describe('addLyric mutation', () => {

    it('should add a lyric to a song', async () => {
      const _id = new ObjectID();
      const _song_id = new ObjectID();
      const language = 'en';
      const text = 'Hello my little world';
      const startAt = 2;
      const endAt = 6;

      const {save} = Lyric.prototype;

      Song.findById.mockResolvedValue({
        _id: _song_id
      });
      save.mockResolvedValueOnce({
        _id,
        _song_id,
        language,
        text,
        startAt,
        endAt
      });

      const {data: {lyric}} = await graphql(Schema, `
        mutation {
          lyric: addLyric(
            songId: "${_song_id.toHexString()}"
            language: "${language}"
            text: "${text}"
            startAt: ${startAt}
            endAt: ${endAt}
          ) {
            _id
            language
            text
            startAt
            endAt
            song {
              _id
            }
          }
        }
      `);

      expect(Song.findById).toHaveBeenCalledTimes(2);
      expect(Lyric).toHaveBeenCalledTimes(1);
      expect(Lyric).toHaveBeenCalledWith({
        _song_id,
        language,
        text,
        startAt,
        endAt
      });
      expect(save).toHaveBeenCalledTimes(1);
      expect(save).toHaveBeenCalledWith();

      expect(lyric._id).toEqual(_id.toHexString());
      expect(lyric.language).toEqual(language);
      expect(lyric.text).toEqual(text);
      expect(lyric.startAt).toEqual(startAt);
      expect(lyric.endAt).toEqual(endAt);
      expect(lyric.song).not.toBeUndefined();
      expect(lyric.song._id).toEqual(_song_id.toHexString());
    });

    it('should throw an error when a song not exist', async () => {
      const _song_id = new ObjectID();

      const {save} = Lyric.prototype;

      Song.findById.mockResolvedValueOnce(null);

      const {errors, data: {lyric}} = await graphql(Schema, `
        mutation {
          lyric: addLyric(
            songId: "${_song_id.toHexString()}"
            language: "en"
            text: "Hello my little world"
            startAt: 2
            endAt: 6
          ) {
            _id
          }
        }
      `);

      expect(Song.findById).toHaveBeenCalledTimes(1);
      expect(Song.findById).toHaveBeenCalledWith(_song_id.toHexString());
      expect(Lyric).toHaveBeenCalledTimes(0);
      expect(save).toHaveBeenCalledTimes(0);

      expect(lyric).toBeNull();
      expect(errors.length).toEqual(1);
      expect(errors[0].message).toEqual('Song not found');
    });

  });

});