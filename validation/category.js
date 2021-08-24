const Joi = require('joi')

const { HttpCode } = require('../helpers/constants')

const schemaCreate = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  type: Joi.valid('+', '-').required(),
  color: Joi.string().min(7).max(7).required(),
})

const validateCategory = (schema, body, next) => {
  const { error } = schema.validate(body)
  if (error) {
    const [{ message }] = error.details
    return next({
      status: HttpCode.BAD_REQUEST,
      message,
      data: 'Bad Request',
    })
  }
  next()
}

module.exports.validateCreateCategory = (req, _, next) => {
  return validateCategory(schemaCreate, req.body, next)
}
