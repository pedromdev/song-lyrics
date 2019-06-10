const {graphql} = require('graphql');
const {ObjectID} = require('mongodb');

const Song = require('../../../models/Song');
const Schema = require('../../../graphql/Schema');

jest.mock('../../../models/Song');

describe('GraphQL SongType', () => {

  it('should query a song', async () => {
    const _id = new ObjectID();
    const query = `
      {
        song(id: "${_id.toHexString()}") {
          _id
          name
          artist
          youtubeID
        }
      }
    `;
    Song.findById.mockResolvedValueOnce({
      _id,
      name: 'Name B',
      artist: 'Artist B',
      youtubeID: 'youtubeIDB',
    });

    const {data: {song}} = await graphql(Schema, query);

    expect(Song.findById).toHaveBeenCalledTimes(1);
    expect(Song.findById).toHaveBeenCalledWith(_id.toHexString());

    expect(song._id).toEqual(_id.toHexString());
    expect(song.name).toEqual('Name B');
    expect(song.artist).toEqual('Artist B');
    expect(song.youtubeID).toEqual('youtubeIDB');
  });

  it('should query a list of songs', async () => {
    const query = `
      {
        songs {
          _id
          name
          artist
        }
      }
    `;
    Song.find.mockResolvedValueOnce([
      {
        _id: new ObjectID(),
        name: 'Name A',
        artist: 'Artist A',
        youtubeID: 'youtubeIDA'
      },
      {
        _id: new ObjectID(),
        name: 'Name B',
        artist: 'Artst B',
        youtubeID: 'youtubeIDB'
      }
    ]);

    const {data: {songs}} = await graphql(Schema, query);

    expect(Song.find).toHaveBeenCalledTimes(1);
    expect(Song.find).toHaveBeenCalledWith({});

    expect(songs).toBeInstanceOf(Array);
    expect(songs.length).toEqual(2);

    songs.forEach((song) => {
      expect(song._id).not.toBeUndefined();
      expect(song.name).not.toBeUndefined();
      expect(song.artist).not.toBeUndefined();
      expect(song.youtubeID).toBeUndefined();
    });
  });

  it('should filter a list of songs', async () => {
    const query = `
      {
        songs(name: "Name", artist: "Artist", youtubeID: "yID") {
          _id
        }
      }
    `;

    await graphql(Schema, query);

    expect(Song.find).toHaveBeenCalledTimes(1);
    expect(Song.find.mock.calls[0].length).toEqual(1);
    expect(Song.find.mock.calls[0][0].name).toBeInstanceOf(RegExp);
    expect(Song.find.mock.calls[0][0].artist).toBeInstanceOf(RegExp);
    expect(Song.find.mock.calls[0][0].youtubeID).toEqual('yID');
  });

});