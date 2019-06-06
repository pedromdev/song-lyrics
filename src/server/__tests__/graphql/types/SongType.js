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
    Song.findById.mockReturnValueOnce(new Promise((resolve) => {
      resolve({
        _id,
        name: 'Name B',
        artist: 'Artist B',
        youtubeID: 'youtubeIDB',
      })
    }));

    const {data: {song}} = await graphql(Schema, query);

    expect(Song.findById).toHaveBeenCalledTimes(1);
    expect(Song.findById).toBeCalledWith(_id.toHexString());

    expect(song._id).toEqual(_id.toHexString());
    expect(song.name).toEqual('Name B');
    expect(song.artist).toEqual('Artist B');
    expect(song.youtubeID).toEqual('youtubeIDB');
  });

});