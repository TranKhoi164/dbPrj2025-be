const { userLogin } = require('../controller/authCtrl')

const router = require('express').Router()


const CLIENT_URL = process.env.CLIENT_URL

router.get('/', (req, res) => {
  res.json({msg: 'Hello user'})
})
// auth route
// router.post('/auth/refresh_token', refreshAccessTokenMiddleware, refreshAccessToken)
// router.post('/auth/register', checkCredentialsMiddleware, userRegister)
router.post('/auth/login', userLogin)
router.get('/auth/logout', userLogout)

// user route
router.get('/search_users', searchUsers)


module.exports = router