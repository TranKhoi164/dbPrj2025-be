const { createAppointment, deleteAppointment } = require('../controller/appointmentCtrl')

const router = require('express').Router()

// donKham: { benhLy, mucDoBenh, dieuTri, benhNhanId, bacSiId } 
router.post('/create', createAppointment)
// donKham: { id, benhLy?, mucDoBenh?, dieuTri? } 
router.patch('/delete', deleteAppointment)


module.exports = router