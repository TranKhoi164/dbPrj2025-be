const handleExceptions = require('../utils/handleExceptions')
const ThongTinCaNhan = require('../model/thongTinCaNhan')
// const BenhNhan = require('../model/benhNhan')
// const BacSi = require('../model/bacSi')

const userLogin = async (req, res) => {
  try {
    const {ten, CCCD, ngaySinh, gioiTinh, sdt} = req.body.thongTinCaNhan
    const [newUser, created] = await ThongTinCaNhan.findOrCreate({
      where: {CCCD: CCCD},
      defaults: {
        CCCD: CCCD,
        ten: ten,
        ngaySinh: ngaySinh,
        gioiTinh: gioiTinh,
        sdt: sdt
      }
    })
    res.json({
      thongTinCaNhan: {...newUser.dataValues},
      message: 'Thanh cong'
    })
  } catch(e) {
    handleExceptions(500, e.message, res)
  }
}

const userLogout = async (req, res) => {

}

module.exports = {
  userLogin: userLogin,
  userLogout: userLogout
}