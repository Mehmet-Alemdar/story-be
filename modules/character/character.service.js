const CharacterModel = require('./character.model');

class CharacterService {
  async create(data) {
    return await CharacterModel.create(data);
  }

  async getAll() {
    return await CharacterModel.find();
  }

  async getById(id) {
    return await CharacterModel.findById(id);
  }
}

module.exports = new CharacterService();