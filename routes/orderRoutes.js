const { createOrder, deleteOrder, updateOrder } = require('../controller/orderCtrl')

const router = require('express').Router()


router.post('/create_order', createOrder)
router.patch('/update_order', updateOrder)
router.delete('/delete_order', deleteOrder)
// router.get('/auth/logout', userLogout)


module.exports = router