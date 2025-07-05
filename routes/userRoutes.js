const { userLogin, userRegister, getUser } = require('../controller/userCtrl')
const userService = require('../service/userService');

const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({msg: 'Hello user'})
})

// Patients endpoints
router.get('/patients', async (req, res) => {
  try {
    const patients = await userService.getAllPatients();
    res.json({
      benhNhans: patients,
      message: "Thành công!"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/patients/:id', async (req, res) => {
  try {
    const patient = await userService.getPatientById(req.params.id);
    res.json({
      benhNhan: patient,
      message: "Thành công!"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/patients', async (req, res) => {
  try {
    const patient = await userService.createPatient(req.body.benhNhan);
    res.json({
      benhNhan: patient,
      message: "Thành công!"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/patients/:id', async (req, res) => {
  try {
    const patient = await userService.updatePatient(req.params.id, req.body.benhNhan);
    res.json({
      benhNhan: patient,
      message: "Thành công!"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/patients/:id', async (req, res) => {
  try {
    await userService.deletePatient(req.params.id);
    res.json({
      message: "Xóa thành công!"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Doctors endpoints
router.get('/doctors', async (req, res) => {
  try {
    const doctors = await userService.getAllDoctors();
    res.json({
      bacSis: doctors,
      message: "Thành công!"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/register', userRegister)
// thongTinCaNhan { CCCD }
router.post('/login', userLogin)

// localhost:5000/user/3
router.get('/:id', getUser)
// router.get('/auth/logout', userLogout)


module.exports = router