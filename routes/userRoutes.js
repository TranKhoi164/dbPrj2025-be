const { userLogin, userRegister, getUser, getDoctors } = require('../controller/userCtrl')

const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({msg: 'Hello user'})
})
// thongTinCaNhan { role: 'bacSi', ten, CCCD, ngaySinh, gioiTinh, sdt, namKinhNghiem, caTruc }
// thongTinCaNhan { role: 'benhNhan', ten, CCCD, ngaySinh, gioiTinh, sdt, diaChi }

router.post('/register', userRegister)
// thongTinCaNhan { CCCD }
router.post('/login', userLogin)
router.get('/doctors', getDoctors)

// localhost:5000/user/3
router.get('/:id', getUser)
// router.get('/auth/logout', userLogout)


module.exports = router