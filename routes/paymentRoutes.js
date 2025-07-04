const {
  createPayment,
  updatePayment,
  getPaymentsByPatient,
  getPaymentByAppointment,
  getPaymentDetails
} = require('../controller/paymentCtrl')

const router = require('express').Router()

// donKham: { benhLy, mucDoBenh, dieuTri, benhNhanId, bacSiId } 
router.post('/create', createPayment)
// donKham: { id, benhLy?, mucDoBenh?, dieuTri? } 
router.patch('/update', updatePayment)
// Get payments by patient: benhNhanId
router.get('/patient/:benhNhanId', getPaymentsByPatient)
// Get payment by appointment: lichKhamId
router.get('/appointment/:lichKhamId', getPaymentByAppointment)
// Get payment details: id
router.get('/details/:id', getPaymentDetails)

module.exports = router