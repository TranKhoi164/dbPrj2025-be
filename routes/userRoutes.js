const { userLogin, userRegister, } = require('../controller/userCtrl')

const router = require('express').Router()

router.get('/', (req, res) => {
  res.json({msg: 'Hello user'})
})
router.get('/test', (req, res) => {
  res.send('test user')
})

router.post('/register', userRegister)
router.post('/login', userLogin)
// router.get('/auth/logout', userLogout)


module.exports = router