const { Transaction } = require('../models')

const add = async ({ date, type, category, comment, sum, owner }) => {
  const newTransaction = await new Transaction({
    date,
    type,
    category,
    comment,
    sum,
    owner,
  })
  await newTransaction.save()
  return newTransaction
}

module.exports = {
  add,
}
