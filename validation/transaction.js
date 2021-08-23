const Joi = require('joi')

const { HttpCode } = require('../helpers/constants')

const schemaCreate = Joi.object({
  timeStamp: Joi.number().min(1629657231450).required(),
  type: Joi.string().valid('+', '-').required(),
  category: Joi.string().required(),
  comment: Joi.string().min(3).max(300),
  sum: Joi.number().required(),
})

const validateTransaction = (schema, body, next) => {
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

module.exports.validateCreateTransaction = (req, _, next) => {
  return validateTransaction(schemaCreate, req.body, next)
}
