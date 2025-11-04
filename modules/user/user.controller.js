const router = require('express').Router();
const userService = require('./user.service');

router.post('/', async(req, res) => {
  const body = req.body;
  const createdUser = await userService.create(body);

  return res.send(createdUser);
})

module.exports = router;