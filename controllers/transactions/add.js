const { transaction: service } = require('../../services')
const { HttpCode } = require('../../helpers/constants')

const add = async (req, res, next) => {
  const { id: userId } = req.user
  try {
    const newTransaction = { ...req.body, owner: userId }
    console.log(newTransaction)
    const transaction = await service.add(newTransaction)
    res.status(HttpCode.CREATED).json({
      status: 'succes',
      code: HttpCode.CREATED,
      data: {
        transaction,
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = add
