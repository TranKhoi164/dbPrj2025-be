const handleExceptions = require('../utils/handleExceptions')
const thongTinCaNhan = require('../model/thongTinCaNhan')

const userLogin = (req, res) => {
  try {
    
  } catch(e) {
    handleExceptions(500, e.message, res)
  }
}

const userLogout = async (req, res) => {

}