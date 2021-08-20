const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const { signupLimiter } = require('../middlewares/limiters')

const { users: ctrl } = require('../controllers')

const { validateCreateUser, validateLogInUser } = require('../validation/user')

router.post('/signup', signupLimiter, validateCreateUser, ctrl.register)
router.post('/login', validateLogInUser, ctrl.login)
router.post('/logout', auth, ctrl.logout)
router.get('/current', auth, ctrl.getCurrent)

module.exports = router
