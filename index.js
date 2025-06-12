const express = require('express')

const app = express()
require('dotenv').config()
require('./databaseConnection')
const {BE_PORT} = process.env || 5000


const authRoutes = require('./routes/authRoutes')

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use(express.json())
app.use('/user', authRoutes)

app.listen(BE_PORT, () => {
  console.log('Server running on http://localhost:' + BE_PORT);
});