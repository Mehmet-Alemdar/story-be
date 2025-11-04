const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: {
    type: [String],
    required: true
  },
  description: { type: String, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Character', CharacterSchema);
