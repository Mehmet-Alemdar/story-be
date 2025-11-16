const StoryModel = require("./story.model");
const { getPresignedUrl } = require("../../r2/r2.service");

class StoryService {
  async create(data) {
    return await StoryModel.create(data);
  }

  async getAll() {
    const stories = await StoryModel.find({ isActive: true });

    return await Promise.all(
      stories.map(async (story) => {
        const urls = [];

        for (const key of story.videoContent) {
          const signedUrl = await getPresignedUrl(key);
          urls.push(signedUrl);
        }

        const { videoContent, ...rest } = story.toObject();

        return {
          ...rest,
          videoUrls: urls,
        };
      })
    );
  }

  async getById(id) {
    const story = await StoryModel.findOne({ _id: id, isActive: true });

    if (!story) return null;

    const urls = [];

    for (const key of story.videoContent) {
      urls.push(await getPresignedUrl(key));
    }

    const { videoContent, ...rest } = story.toObject();

    return {
      ...rest,
      videoUrls: urls,
    };
  }

  async getByCharacterId(characterId) {
    const stories = await StoryModel.find({
      character: characterId,
      isActive: true,
    });

    return await Promise.all(
      stories.map(async (story) => {
        const urls = [];

        for (const key of story.videoContent) {
          urls.push(await getPresignedUrl(key));
        }

        const { videoContent, ...rest } = story.toObject();

        return {
          ...rest,
          videoUrls: urls,
        };
      })
    );
  }
}

module.exports = new StoryService();
