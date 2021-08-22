const Joi = require('joi')

const { HttpCode } = require('../helpers/constants')

const schemaCreate = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string().min(6).max(20).required(),
  name: Joi.string().min(2).max(20).required(),
})

const schemaLogin = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required(),
  password: Joi.string().min(8).max(20).required(),
})

const validateUser = (schema, body, next) => {
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

module.exports.validateCreateUser = (req, _, next) => {
  return validateUser(schemaCreate, req.body, next)
}

module.exports.validateLogInUser = (req, _, next) => {
  return validateUser(schemaLogin, req.body, next)
}
