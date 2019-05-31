const {Schema, model} = require('mongoose');
const Song = require('./Song');

const LyricSchema = new Schema({
  _song_id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  language: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 5,
    trim: true,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  startAt: {
    type: Number,
    required: true,
    min: 0
  },
  endAt: {
    type: Number,
    required: true,
  }
});

LyricSchema.methods.getSong = async function () {
  return await Song.findById(this._song_id);
};

module.exports = model('lyric', LyricSchema);