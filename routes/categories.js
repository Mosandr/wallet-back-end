const express = require('express')
const router = express.Router()
const { categories: ctrl } = require('../controllers')
const auth = require('../middlewares/auth')

const { validateCreateCategory } = require('../validation/category')

router.post('/', auth, validateCreateCategory, ctrl.add)

module.exports = router
