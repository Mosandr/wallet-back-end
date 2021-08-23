const { user: service } = require('../../services')
const { HttpCode } = require('../../helpers/constants')
const jwt = require('jsonwebtoken')

require('dotenv').config()
const { PASSPORT_SECRET_KEY } = process.env

const register = async (req, res, next) => {
  const { email } = req.body
  const user = await service.getOne({ email })
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email is already in use',
    })
  }

  try {
    const newUser = await service.add(req.body)

    const payload = {
      id: newUser._id,
    }

    const token = jwt.sign(payload, PASSPORT_SECRET_KEY, { expiresIn: '12h' })
    await newUser.updateOne({ token })

    res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      message: 'Registration successful',
      data: {
        user: {
          email: newUser.email,
          name: newUser.name,
          token: token,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = register
