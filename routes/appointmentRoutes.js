const { 
  createAppointment, 
  deleteAppointment, 
  getDoctorSchedule, 
  markAsBusy, 
  getPatientSchedule,
  getAppointmentDetails,
  completeAppointment
} = require('../controller/appointmentCtrl')

const router = require('express').Router()

// Add GET route for appointments list (for frontend)
router.get('/', async (req, res) => {
  try {
    // Mock data for now - you should implement actual logic
    res.json({
      lichKhams: [],
      message: "Thành công!"
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// lichKham: { ngay, gio, benhNhanId, bacSiId }
router.post('/create', createAppointment)
// lichKham: { id } 
router.patch('/delete', deleteAppointment)
// Get doctor's schedule: bacSiId, ngayBatDau?, ngayKetThuc?
router.get('/doctor-schedule/:bacSiId', getDoctorSchedule)
// Mark time slot as busy: lichKham: { ngay, gio, bacSiId }
router.post('/mark-busy', markAsBusy)
// Get patient schedule: benhNhanId
router.get('/patient-schedule/:benhNhanId', getPatientSchedule)
// Get appointment details: id
router.get('/details/:id', getAppointmentDetails)
// Complete appointment: lichKham: { id }
router.patch('/complete', completeAppointment)

module.exports = router
