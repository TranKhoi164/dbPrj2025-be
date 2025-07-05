const express = require('express')
'use strict'
const app = express()
const cors = require('cors')
const path = require('path')
require('dotenv').config()
require('./databaseConnection')
const BE_PORT = process.env.BE_PORT || 3000

const userRoutes = require('./routes/userRoutes')
const examinationRoutes = require('./routes/examinationRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const paymentRoutes = require('./routes/paymentRoutes')

// Enable CORS for all routes
app.use(cors())

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use(express.json())
app.use('/api/patients', userRoutes)
app.use('/api/doctors', userRoutes)
app.use('/api/examinations', examinationRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/payments', paymentRoutes)

app.listen(BE_PORT, () => {
  console.log('Server running on http://localhost:' + BE_PORT);
  console.log('Frontend available at: http://localhost:' + BE_PORT);
});
