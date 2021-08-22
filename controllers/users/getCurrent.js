const { HttpCode } = require('../../helpers/constants')
const { user: service } = require('../../services')

const getCurrent = async (req, res, next) => {
  try {
    const user = req.user

    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        message: 'Unauthorized',
      })
    }

    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      message: 'Find current user',
      data: {
        user: {
          name: user.name,
          email: user.email,
          totalBalance: user.totalBalance,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = getCurrent
