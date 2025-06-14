const express = require('express')
'use strict'
const app = express()
require('dotenv').config()
require('./databaseConnection')
const {BE_PORT} = process.env || 5000

const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use(express.json())
app.use('/user', userRoutes)
app.use('/order', orderRoutes)

app.listen(BE_PORT, () => {
  console.log('Server running on http://localhost:' + BE_PORT);
});