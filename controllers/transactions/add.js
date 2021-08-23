const { transaction: service } = require('../../services')
const { HttpCode } = require('../../helpers/constants')
const dateParser = require('../../helpers/dateParser')
const { User, Transaction, Category } = require('../../models')

const add = async (req, res, next) => {
  const { id: userId } = req.user

  const { timeStamp, sum, category } = req.body

  try {
    const { type } = await Category.findOne({ _id: category }, ['type'])

    let balance
    type === '+' ? (balance = Number(sum)) : (balance = -Number(sum))

    const date = dateParser.getDate(+timeStamp)
    const month = dateParser.getMonth(+timeStamp)
    const year = dateParser.getYear(+timeStamp)

    let monthlyBalance = 0

    const newTransaction = {
      ...req.body,
      type,
      date,
      month,
      year,
      owner: userId,
      monthlyBalance,
    }

    const lastTransaction = await service.getlastTransaction(
      userId,
      month,
      year,
    )

    if (lastTransaction && lastTransaction.timeStamp < timeStamp) {
      newTransaction.monthlyBalance = lastTransaction.monthlyBalance + balance

      const transaction = await service.add(newTransaction)
      const user = await User.findOne({ _id: userId })

      const totalBalance = Number(user.totalBalance) + Number(balance)
      await User.updateOne({ _id: userId }, { totalBalance })

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
            monthlyBalance: transaction.monthlyBalance,
          },
        },
      })
    }

    const transaction = await service.add(newTransaction)
    const user = await User.findOne({ _id: userId })

    const totalBalance = Number(user.totalBalance) + Number(balance)
    await User.updateOne({ _id: userId }, { totalBalance })

    const { docs: listOfMonthTransactions } = await service.getAll(userId, {
      month,
      year,
      sortOrder: 1,
    })

    await Promise.all(
      listOfMonthTransactions.map(item => {
        const { _id, type, sum } = item
        type === '+'
          ? (monthlyBalance += Number(sum))
          : (monthlyBalance -= Number(sum))
        return Transaction.updateOne({ _id }, { monthlyBalance })
      }),
    )

    const updateTransaction = await Transaction.findOne({
      _id: transaction._id,
    })

    return res.status(HttpCode.CREATED).json({
      status: 'succes',
      code: HttpCode.CREATED,
      message: 'Transaction successfully created',
      data: {
        transaction: {
          _id: updateTransaction._id,
          timeStamp: updateTransaction.timeStamp,
          date: updateTransaction.date,
          type: updateTransaction.type,
          category: updateTransaction.category,
          ['comment']: updateTransaction['comment'],
          sum: updateTransaction.sum,
          monthlyBalance: updateTransaction.monthlyBalance,
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
