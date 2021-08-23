const { Transaction } = require('../models')
const { getMonth, getYear } = require('../helpers/dateParser')

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
  monthlyBalance,
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
    monthlyBalance,
  })
  await newTransaction.save()
  return newTransaction
}

const getlastTransaction = async (userId, month, year) => {
  const { docs } = await Transaction.paginate(
    { owner: userId, month, year },
    {
      select: 'date timeStamp category sum monthlyBalance',
      sort: { timeStamp: -1 },
    },
  )

  return docs.length === 0 ? null : docs[0]
}

const getAll = async (userId, query) => {
  const date = Date.now()
  const currentMonth = getMonth(date)
  const currentYear = getYear(date)

  const {
    page = 1,
    limit = 5000,
    month = currentMonth,
    year = currentYear,
    sortOrder = -1,
  } = query

  const options = {
    page,
    limit,
    sort: { timeStamp: sortOrder },
    select:
      'timeStamp date month year type category comment sum owner monthlyBalance',
  }

  const opt = { ...options }

  return await Transaction.paginate({ owner: userId, year, month }, opt)
}

module.exports = {
  add,
  getlastTransaction,
  getAll,
}
