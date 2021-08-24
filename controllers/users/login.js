const { user: service } = require('../../services')
const { HttpCode } = require('../../helpers/constants')
const { User } = require('../../models')
const jwt = require('jsonwebtoken')

require('dotenv').config()
const { PASSPORT_SECRET_KEY } = process.env

const login = async (req, res, next) => {
  try {
    const user = await service.getValidUser(req.body)
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Email or password is wrong',
      })
    }

    const payload = {
      id: user._id,
    }

    const token = jwt.sign(payload, PASSPORT_SECRET_KEY, { expiresIn: '12h' })
    await User.updateOne({ _id: user._id }, { token })

    res.json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Successful login',
      data: {
        user: {
          email: user.email,
          name: user.name,
          token: token,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = login
