const { transaction: service } = require('../../services')
const { HttpCode } = require('../../helpers/constants')

const getAll = async (req, res, next) => {
  const { id: userId } = req.user

  try {
    const transactionsList = await service.getAll(userId, req.query)

    res.status(HttpCode.OK).json({
      status: 'succes',
      code: HttpCode.OK,
      message: 'Transactions have found',
      data: transactionsList,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = getAll
