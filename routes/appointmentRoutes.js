const { 
  createAppointment, 
  deleteAppointment, 
  getDoctorSchedule, 
  markAsBusy, 
  getAppointmentDetails, 
  completeAppointment 
} = require('../controller/appointmentCtrl')

const router = require('express').Router()

// lichKham: { ngay, gio, benhNhanId, bacSiId } 
router.post('/create', createAppointment)
// lichKham: { id } 
router.patch('/delete', deleteAppointment)
// Get doctor's schedule: bacSiId, ngayBatDau?, ngayKetThuc?
router.get('/doctor-schedule/:bacSiId', getDoctorSchedule)
// Mark time slot as busy: lichKham: { ngay, gio, bacSiId }
router.post('/mark-busy', markAsBusy)
// Get appointment details: id
router.get('/details/:id', getAppointmentDetails)
// Complete appointment: lichKham: { id }
router.patch('/complete', completeAppointment)

module.exports = router
