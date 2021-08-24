const express = require('express')
const router = express.Router()
const { categories: ctrl } = require('../controllers')
const auth = require('../middlewares/auth')

const { validateCreateCategory } = require('../validation/category')

// router.post('/', validateCreateCategory, ctrl.add)
router.get('/', auth, ctrl.getAll)

module.exports = router
