const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: {
    type: [String],
    required: true
  },
  description: { type: String, default: null },
  isPremium: { type: Boolean, default: false},
  isActive: { type: Boolean, default: true},
  statusKey: { type: String, default: "ready" } // ready | soon etc.
}, { timestamps: true });

module.exports = mongoose.model('Character', CharacterSchema);
