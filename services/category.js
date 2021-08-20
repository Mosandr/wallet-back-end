const { Category } = require('../models')

const add = async ({ name }) => {
  const newCategory = await new Category({ name })
  await newCategory.save()
  return newCategory
}

module.exports = {
  add,
}
