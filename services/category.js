const { Category } = require('../models')

const add = async ({ name, type }) => {
  const newCategory = await new Category({ name, type })
  await newCategory.save()
  return newCategory
}

const getAll = async () => {
  return Category.find({}, ['_id', 'name', 'type'])
}

module.exports = {
  add,
  getAll,
}
