const { transaction: service } = require('../../services')
const { HttpCode } = require('../../helpers/constants')
const dateParser = require('../../helpers/dateParser')
const { User } = require('../../models')

const add = async (req, res, next) => {
  const { id: userId } = req.user

  const { timeStamp, sum, type } = req.body
  let balance
  type === '+' ? (balance = Number(sum)) : (balance = -Number(sum))

  const date = dateParser.getDate(+timeStamp)
  const month = dateParser.getMonth(+timeStamp)
  const year = dateParser.getYear(+timeStamp)

  let monthlyBalance = 0

  try {
    const lastTransaction = await service.getlastTransaction(
      userId,
      month,
      year,
    )

    !lastTransaction
      ? (monthlyBalance = Number(balance))
      : (monthlyBalance =
          Number(lastTransaction.monthlyBalance) + Number(balance))

    const newTransaction = {
      ...req.body,
      date,
      month,
      year,
      owner: userId,
      monthlyBalance,
    }
    const transaction = await service.add(newTransaction)
    const user = await User.findOne({ _id: userId })

    const totalBalance = Number(user.totalBalance) + Number(balance)
    await User.updateOne({ _id: userId }, { totalBalance })

    res.status(HttpCode.CREATED).json({
      status: 'succes',
      code: HttpCode.CREATED,
      message: 'Transaction successfully created',
      data: {
        transaction: {
          timeStamp: transaction.timeStamp,
          date: transaction.date,
          type: transaction.type,
          category: transaction.category,
          comment: transaction.comment,
          sum: transaction.sum,
          monthlyBalance: transaction.monthlyBalance,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

module.exports = add
