const express = require('express')
const router = express.Router()
const { transactions: ctrl } = require('../controllers')
const auth = require('../middlewares/auth')

const { validateCreateTransaction } = require('../validation/transaction')

router.post('/', auth, validateCreateTransaction, ctrl.add)

module.exports = router
