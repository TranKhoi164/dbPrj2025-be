const {
  createExamination,
  updateExamination,
  getExaminationsByPatient,
  getExaminationsByDoctor,
  getExaminationDetails
} = require('../controller/examinationCtrl')

const router = require('express').Router()

// Add GET route for examinations list (for frontend)
router.get('/', async (req, res) => {
  try {
    // Mock data for now - you should implement actual logic
    res.json({
      donKhams: [],
      message: "Thành công!"
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

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