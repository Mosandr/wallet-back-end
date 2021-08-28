const { Category } = require('../models')

const add = async ({ name, type, color }) => {
  const newCategory = await new Category({ name, type, color })
  await newCategory.save()
  return newCategory
}

const getAll = async () => {
  return Category.find({}, ['_id', 'name', 'type', 'color'])
}

module.exports = {
  add,
  getAll,
}
