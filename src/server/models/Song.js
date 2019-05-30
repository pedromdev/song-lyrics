const {Schema, model} = require('mongoose');

const SongSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  youtubeID: {
    type: String,
    required: true,
    trim: true,
  }
});

module.exports = model('song', SongSchema);