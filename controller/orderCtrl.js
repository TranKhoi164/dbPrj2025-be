const handleExceptions = require('../utils/handleExceptions')
const BenhNhan = require('../model')
const DonKham = require('../model')
// const BenhNhan = require('../model/benhNhan')
// const BacSi = require('../model/bacSi')

const createOrder = async (req, res) => {
  try {
    const { benhLy, mucDoBenh, dieuTri } = req.body.donKham
    const newOrder = await DonKham.create({
      benhLy: benhLy,
      mucDoBenh: mucDoBenh,
      dieuTri: dieuTri
    })
    res.json({
      donKham: { ...newOrder.dataValues },
      message: 'Thanh cong'
    })
  } catch (e) {
    handleExceptions(500, e.message, res)
  }
}

const updateOrder = async (req, res) => {
  try {
    const { benhLy, mucDoBenh, dieuTri } = req.body.donKham
    const newOrder = await DonKham.create({
      benhLy: benhLy,
      mucDoBenh: mucDoBenh,
      dieuTri: dieuTri
    })
    res.json({
      donKham: { ...newOrder.dataValues },
      message: 'Thanh cong'
    })
  } catch (e) {
    handleExceptions(500, e.message, res)
  }
}

const deleteOrder = async (req, res) => {
  try {
    const { benhLy, mucDoBenh, dieuTri } = req.body.donKham
    const newOrder = await DonKham.create({
      benhLy: benhLy,
      mucDoBenh: mucDoBenh,
      dieuTri: dieuTri
    })
    res.json({
      donKham: { ...newOrder.dataValues },
      message: 'Thanh cong'
    })
  } catch (e) {
    handleExceptions(500, e.message, res)
  }
}

module.exports = {
  createOrder: createOrder,
  updateOrder: updateOrder,
  deleteOrder: deleteOrder,
}