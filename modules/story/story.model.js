const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  character: { type: mongoose.Types.ObjectId, required: true },
  videoContent: {
    type: [String],
    required: true
  },
  type: { type: String, default: 'video'} // video | book
}, { timestamps: true })

module.exports = mongoose.model('Story', StorySchema);