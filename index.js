const express = require('express')
'use strict'
const app = express()
require('dotenv').config()
require('./databaseConnection')
const {BE_PORT} = process.env || 5000

const userRoutes = require('./routes/userRoutes')
const examinationRoutes = require('./routes/examinationRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use(express.json())
app.use('/user', userRoutes)
app.use('/examination', examinationRoutes)
app.use('/appointment', appointmentRoutes)

app.listen(BE_PORT, () => {
  console.log('Server running on http://localhost:' + BE_PORT);
});