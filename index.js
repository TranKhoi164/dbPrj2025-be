const express = require('express')
const {Sequelize} = require('sequelize')

const app = express()
require('./dbConnection')
require('dotenv').config()

const {BE_PORT} = process.env || 5000

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use(express.json())

app.listen(BE_PORT, () => {
  console.log('Server running on http://localhost:' + BE_PORT);
});