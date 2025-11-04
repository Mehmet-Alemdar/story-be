const router = require('express').Router();
const storyService = require('./story.service');

router.post('/', async(req, res) => {
  const body = req.body;

  const createdStory = await storyService.create(body);

  res.send(createdStory);
})

router.get('/', async(req, res) => {
  const stories = await storyService.getAll();

  res.send(stories);
})

router.get('/:id', async(req, res) => {
  const { id } = req.params;
  const story = await storyService.getById(id);

  res.send(story);
})

router.get('/character/:characterId', async(req, res) => {
  const { characterId } = req.params;

  const stories = await storyService.getByCharacterId(characterId);

  res.send(stories);
})
 
module.exports = router;