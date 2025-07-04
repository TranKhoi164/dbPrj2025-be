const {
  createExamination,
  updateExamination,
  getExaminationsByPatient,
  getExaminationsByDoctor,
  getExaminationDetails
} = require('../controller/examinationCtrl')

const router = require('express').Router()

// donKham: { benhLy, mucDoBenh, dieuTri, lichKhamId, benhNhanId, bacSiId }
router.post('/create', createExamination)
// donKham: { id, benhLy?, mucDoBenh?, dieuTri? } 
router.patch('/update', updateExamination)
// Get examinations by patient: benhNhanId
router.get('/patient/:benhNhanId', getExaminationsByPatient)
// Get examinations by doctor: bacSiId
router.get('/doctor/:bacSiId', getExaminationsByDoctor)
// Get examination details: id
router.get('/details/:id', getExaminationDetails)

module.exports = router