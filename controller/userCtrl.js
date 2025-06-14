const handleExceptions = require('../utils/handleExceptions')
const {ThongTinCaNhan} = require('../model/index')
const {BenhNhan} = require('../model/index')
const {BacSi} = require('../model/index')

const userRegister = async (req, res) => {
  try {
    console.log(req.body.thongTinCaNhan);
    const {role} = req.body.user
    let newUser

    if (role == 'bacSi') {
      const { ten, CCCD, ngaySinh, gioiTinh, sdt, namKinhNghiem, caTruc } = req.body.user
      newUser = await ThongTinCaNhan.create({
        CCCD: CCCD,
        ten: ten,
        ngaySinh: ngaySinh,
        gioiTinh: gioiTinh,
        sdt: sdt,
        bacSi: {
          namKinhNghiem: namKinhNghiem,
          caTruc: caTruc
        }
      }, {
        include: [{model: BacSi, as: 'bacSi'}]
      });
    } else if (role == 'benhNhan') {
      const { ten, CCCD, ngaySinh, gioiTinh, sdt, diaChi } = req.body.user
      newUser = await ThongTinCaNhan.create({
        CCCD: CCCD,
        ten: ten,
        ngaySinh: ngaySinh,
        gioiTinh: gioiTinh,
        sdt: sdt,
        benhNhan: {
          diaChi: diaChi
        }
      }, {
        include: [{model: BenhNhan, as: 'benhNhan'}]
      });
    }

    const userWithDetails = await ThongTinCaNhan.findOne({
      where: { id: newUser.id },
      include: [{ model: BenhNhan, as: 'benhNhan' }, {model: BacSi, as: 'bacSi'}]
    });

    res.json({
      user: { ...userWithDetails.dataValues },
      message: 'User register successfully!'
    })
  } catch (e) {
    if (e.name == 'SequelizeUniqueConstraintError') {
      handleExceptions(500, "User is already exist!", res)
      return
    }
    handleExceptions(500, e.message, res)
  }
}

const userLogin = async (req, res) => {
  try {
    const {id} = req.body.user
    const user = await ThongTinCaNhan.findOne({
      where: { id },
      include: [{ model: BenhNhan, as: 'benhNhan' }, {model: BacSi, as: 'bacSi'}]
    });
    if (!user) {
      handleExceptions(500, "User is not exist!", res)
      return
    }
    res.json({
      user: { ...user.dataValues },
      message: 'User login successfully!'
    })
  } catch (e) {
    handleExceptions(500, e.message, res)
  }
}

const userLogout = async (req, res) => {

}

module.exports = {
  userRegister: userRegister,
  userLogin: userLogin,
  userLogout: userLogout
}