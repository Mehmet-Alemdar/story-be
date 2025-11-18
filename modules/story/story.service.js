const StoryModel = require("./story.model");
const { getPresignedUrl } = require("../../r2/r2.service");

async function formatStoryResponse(story) {
  const { videoContent, image, ...rest } = story.toObject();

  const videoUrls = await Promise.all(
    (videoContent || []).map((key) => getPresignedUrl(key))
  );

  const imageUrl = image ? await getPresignedUrl(image) : null;

  return {
    ...rest,
    videoUrls,
    imageUrl,
  };
}

class StoryService {
  async create(data) {
    return await StoryModel.create(data);
  }

  async getAll() {
    const stories = await StoryModel.find({ isActive: true });
    return Promise.all(stories.map((story) => formatStoryResponse(story)));
  }

  async getById(id) {
    const story = await StoryModel.findOne({ _id: id, isActive: true });
    if (!story) return null;

    return formatStoryResponse(story);
  }

  async getByCharacterId(characterId) {
    const stories = await StoryModel.find({
      character: characterId,
      isActive: true,
    });

    return Promise.all(stories.map((story) => formatStoryResponse(story)));
  }
}

module.exports = new StoryService();
