const { Transaction } = require('../models')

const add = async ({
  timeStamp,
  date,
  month,
  year,
  type,
  category,
  comment,
  sum,
  owner,
  balance,
}) => {
  const newTransaction = await new Transaction({
    timeStamp,
    date,
    month,
    year,
    type,
    category,
    comment,
    sum,
    owner,
    balance,
  })
  const transaction = await newTransaction.save()

  return await Transaction.findOne({ _id: transaction._id }).populate(
    'category',
    'name type color',
  )
}

const getPreviousTransaction = async (userId, timeStamp) => {
  const { docs } = await Transaction.paginate(
    { owner: userId, timeStamp: { $lt: timeStamp } },
    {
      select: 'date timeStamp category sum balance',
      sort: { timeStamp: -1, createdAt: -1 },
    },
  )

  return docs.length === 0 ? null : docs[0]
}

const getAfterTransactions = async (userId, timeStamp) => {
  const { docs } = await Transaction.paginate(
    { owner: userId, timeStamp: { $gt: timeStamp } },
    {
      select: 'date timeStamp category sum balance',
      sort: { timeStamp: 1, createdAt: 1 },
    },
  )

  return docs.length === 0 ? null : docs
}

const getAll = async (userId, query) => {
  const { page = 1, limit = 5000, month, year, sortOrder = -1 } = query

  const options = {
    page,
    limit,
    sort: { timeStamp: sortOrder, createdAt: sortOrder },
    select: 'timeStamp date month year type category comment sum owner balance',
    populate: { path: 'category', select: 'type name color' },
  }

  const opt = { ...options }

  if (month && year) {
    return await Transaction.paginate({ owner: userId, year, month }, opt)
  }

  return await Transaction.paginate({ owner: userId }, opt)
}

module.exports = {
  add,
  getPreviousTransaction,
  getAll,
  getAfterTransactions,
}
