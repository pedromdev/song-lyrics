const {graphql} = require('graphql');
const {ObjectID} = require('mongodb');

const Song = require('../../../models/Song');
const Lyric = require('../../../models/Lyric');
const Schema = require('../../../graphql/Schema');

jest.mock('../../../models/Song');
jest.mock('../../../models/Lyric');

describe('GraphQL SongType', () => {

  const _song_id = new ObjectID();
  const _id = new ObjectID();

  it('should list the song lyrics', async () => {
    const query = `
      {
        song(id: "${_song_id.toHexString()}") {
          _id
          lyrics {
            _id
            language
            text
            startAt
            endAt
          }
        }
      }
    `;
    Song.findById.mockResolvedValueOnce({
      _id: _song_id
    });
    Lyric.find.mockResolvedValueOnce([
      {
        _id,
        language: 'en',
        text: 'Hello my little world',
        startAt: 2,
        endAt: 6
      }
    ]);

    const {data: {song: {lyrics}}} = await graphql(Schema, query);

    expect(Song.findById).toHaveBeenCalledTimes(1);
    expect(Song.findById).toHaveBeenCalledWith(_song_id.toHexString());
    expect(Lyric.find).toHaveBeenCalledTimes(1);
    expect(Lyric.find).toHaveBeenCalledWith({_song_id});

    expect(lyrics).toBeInstanceOf(Array);
    expect(lyrics.length).toEqual(1);
    expect(lyrics[0]._id).toEqual(_id.toHexString());
    expect(lyrics[0].language).toEqual('en');
    expect(lyrics[0].text).toEqual('Hello my little world');
    expect(lyrics[0].startAt).toEqual(2);
    expect(lyrics[0].endAt).toEqual(6);
  });

  it('should filter the song lyrics', async () => {
    const query = `
      {
        song(id: "${_song_id.toHexString()}") {
          _id
          lyrics(language: "en", text: "Hello my little world") {
            _id
          }
        }
      }
    `;
    Song.findById.mockResolvedValueOnce({
      _id: _song_id
    });
    Lyric.find.mockResolvedValueOnce([
      {
        _id,
        language: 'en',
        text: 'Hello my little world',
        startAt: 2,
        endAt: 6
      }
    ]);

    await graphql(Schema, query);

    expect(Song.findById).toHaveBeenCalledTimes(1);
    expect(Song.findById).toHaveBeenCalledWith(_song_id.toHexString());
    expect(Lyric.find).toHaveBeenCalledTimes(1);
    expect(Lyric.find.mock.calls[0].length).toEqual(1);
    expect(Lyric.find.mock.calls[0][0]._song_id.toHexString()).toEqual(_song_id.toHexString());
    expect(Lyric.find.mock.calls[0][0].language).toEqual('en');
    expect(Lyric.find.mock.calls[0][0].text).toBeInstanceOf(RegExp);
  });

  it('should retrive the song from the lyric', async () => {
    const query = `
      {
        song(id: "${_song_id.toHexString()}") {
          lyrics {
            song {
              _id
            }
          }
        }
      }
    `;
    Song.findById.mockResolvedValue({
      _id: _song_id
    });
    Lyric.find.mockResolvedValueOnce([
      {
        _id,
        _song_id
      }
    ]);

    const {data: {song: {lyrics: [lyric]}}} = await graphql(Schema, query);

    expect(Song.findById).toHaveBeenCalledTimes(2);
    expect(Song.findById).toHaveBeenCalledWith(_song_id.toHexString());

    expect(lyric.song._id).toEqual(_song_id.toHexString());
  });

  it('should list the lyrics', async () => {
    const query = `
      {
        lyrics {
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
    `;
    Song.findById.mockResolvedValue({
      _id: _song_id
    });
    Lyric.find.mockResolvedValueOnce([
      {
        _id: new ObjectID(),
        language: 'en',
        text: 'Hello my little world',
        startAt: 2,
        endAt: 6,
        _song_id
      },
      {
        _id: new ObjectID(),
        language: 'en',
        text: 'I\'ll love anyone',
        startAt: 2,
        endAt: 6,
        _song_id
      }
    ]);

    const {data: {lyrics}} = await graphql(Schema, query);

    expect(Song.findById).toHaveBeenCalledTimes(2);
    expect(Song.findById).toHaveBeenCalledWith(_song_id);
    expect(Lyric.find).toHaveBeenCalledTimes(1);
    expect(Lyric.find).toHaveBeenCalledWith({});

    expect(lyrics).toBeInstanceOf(Array);
    expect(lyrics.length).toEqual(2);

    lyrics.forEach(lyric => {
      expect(lyric._id).not.toBeUndefined();
      expect(lyric.language).toEqual('en');
      expect(lyric.text).not.toBeUndefined();
      expect(lyric.startAt).not.toBeUndefined();
      expect(lyric.endAt).not.toBeUndefined();
      expect(lyric.song).not.toBeUndefined();
      expect(lyric.song._id).toEqual(_song_id.toHexString());
    })
  });

});