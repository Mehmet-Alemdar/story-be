const CharacterModel = require("./character.model");
const { getPresignedUrl } = require("../../r2/r2.service");

class CharacterService {
  async create(data) {
    return await CharacterModel.create(data);
  }

  async getAll() {
    const characters = await CharacterModel.find({ isActive: true });

    return await Promise.all(
      characters.map(async (char) => {
        const urls = [];

        for (const key of char.images) {
          const signedUrl = await getPresignedUrl(key);
          urls.push(signedUrl);
        }

        const { images, ...rest } = char.toObject();

        return {
          ...rest,
          imageUrls: urls,
        };
      })
    );
  }

  async getById(id) {
    const char = await CharacterModel.findOne({
      _id: id,
      isActive: true,
    });

    if (!char) return null;

    const urls = [];

    for (const key of char.images) {
      const signedUrl = await getPresignedUrl(key);
      urls.push(signedUrl);
    }

    const { images, ...rest } = char.toObject();

    return {
      ...rest,
      imageUrls: urls,
    };
  }
}

module.exports = new CharacterService();
