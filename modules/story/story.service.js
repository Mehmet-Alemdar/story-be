const StoryModel = require('./story.model');

class StroyService {
  async create(data) {
    return await StoryModel.create(data);
  }

  async getAll() {
    return await StoryModel.find();
  }

  async getById(id) {
    return await StoryModel.findById(id);
  }

  async getByCharacterId(characterId) {
    return await StoryModel.find({character: characterId})
  }
}

module.exports = new StroyService();