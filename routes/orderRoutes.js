const { createOrder, deleteOrder, updateOrder } = require('../controller/orderCtrl')

const router = require('express').Router()

// donKham: { benhLy, mucDoBenh, dieuTri, benhNhanId, bacSiId } 
router.post('/create_order', createOrder)
// donKham: { id, benhLy?, mucDoBenh?, dieuTri? } 
router.patch('/update_order', updateOrder)
// donKham: {id}
router.delete('/delete_order', deleteOrder)
// router.get('/auth/logout', userLogout)


module.exports = router