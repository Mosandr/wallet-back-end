const { transaction: service } = require('../../services')
const { HttpCode } = require('../../helpers/constants')
const dateParser = require('../../helpers/dateParser')
const { User, Transaction, Category } = require('../../models')

const add = async (req, res, next) => {
  const { id: userId } = req.user

  const { timeStamp, sum, category } = req.body

  try {
    const { type } = await Category.findOne({ _id: category }, ['type'])

    let newSum
    type === '+' ? (newSum = Number(sum)) : (newSum = -Number(sum))

    const date = dateParser.getDate(+timeStamp)
    const month = dateParser.getMonth(+timeStamp)
    const year = dateParser.getYear(+timeStamp)

    const balance = newSum

    const newTransaction = {
      ...req.body,
      type,
      date,
      month,
      year,
      owner: userId,
      balance,
    }

    const previousTransaction = await service.getPreviousTransaction(
      userId,
      timeStamp,
    )

    if (previousTransaction) {
      newTransaction.balance = previousTransaction.balance + newSum
    }

    const transaction = await service.add(newTransaction)
    const user = await User.findOne({ _id: userId })

    const totalBalance = Number(user.totalBalance) + Number(newSum)
    await User.updateOne({ _id: userId }, { totalBalance })

    const afterTransactions = await service.getAfterTransactions(
      userId,
      timeStamp,
    )

    if (afterTransactions) {
      await Promise.all(
        afterTransactions.map(item => {
          const { _id, balance } = item
          const newBalance = balance + newSum
          return Transaction.updateOne({ _id }, { balance: newBalance })
        }),
      )
    }

    return res.status(HttpCode.CREATED).json({
      status: 'succes',
      code: HttpCode.CREATED,
      message: 'Transaction successfully created',
      data: {
        transaction: {
          _id: transaction._id,
          timeStamp: transaction.timeStamp,
          date: transaction.date,
          type: transaction.type,
          category: transaction.category,
          ['comment']: transaction['comment'],
          sum: transaction.sum,
          balance: transaction.balance,
        },
      },
    })
  } catch (error) {
    if (error.message.includes('Cast to ObjectId')) {
      return res.status(HttpCode.BAD_REQUEST).json({
        status: 'error',
        code: HttpCode.BAD_REQUEST,
        message: 'Incorrect category ID',
        data: 'Bad request',
      })
    }
    next(error)
  }
}

module.exports = add
