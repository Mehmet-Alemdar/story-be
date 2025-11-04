require('dotenv').config()
require('./mongo-connection')

const express = require('express')
const cors = require('cors')

const user = require('./modules/user/user.controller')
const character = require('./modules/character/character.controller')
const story = require('./modules/story/story.controller')

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hi')
})

app.use('/user', user)
app.use('/character', character)
app.use('/story', story)

const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})