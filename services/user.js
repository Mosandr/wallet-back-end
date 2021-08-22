const { User } = require('../models')

const add = async ({ name, email, password }) => {
  const totalBalance = 0
  const newUser = await new User({ name, email, totalBalance })
  newUser.setPassword(password)
  await newUser.save()
  return newUser
}

const getOne = async filter => {
  return await User.findOne(filter)
}

const getValidUser = async body => {
  const { email, password } = body
  const user = await getOne({ email })
  if (!user || !user.validPassword(password)) {
    return null
  }
  return user
}

module.exports = {
  getOne,
  add,
  getValidUser,
}
