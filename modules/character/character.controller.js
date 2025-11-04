const router = require('express').Router();
const characterService = require('./character.service');

router.post('/', async(req, res) => {
  const body = req.body;

  const createdCharacter = await characterService.create(body);

  return res.send(createdCharacter);
})

router.get('/', async(req, res) => {
  const characters = await characterService.getAll();

  return res.send(characters);
})

router.get('/:id', async(req, res) => {
  const { id } = req.params;
  const character = await characterService.getById(id);

  return res.send(character);
})

module.exports = router;