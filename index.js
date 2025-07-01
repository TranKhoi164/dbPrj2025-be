const express = require('express')
'use strict'
const app = express()
const cors = require('cors')
require('dotenv').config()
require('./databaseConnection')
const {BE_PORT} = process.env || 5000

const userRoutes = require('./routes/userRoutes')
const examinationRoutes = require('./routes/examinationRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const paymentRoutes = require('./routes/paymentRoutes')

// Enable CORS for all routes
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello world')
})

app.use(express.json())
app.use('/user', userRoutes)
app.use('/examination', examinationRoutes)
app.use('/appointment', appointmentRoutes)
app.use('/payment', paymentRoutes)

app.listen(BE_PORT, () => {
  console.log('Server running on http://localhost:' + BE_PORT);
});
