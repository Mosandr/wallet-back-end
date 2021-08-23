const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const { HttpCode } = require('./helpers/constants')
const helmet = require('helmet')
const { apiLimiter } = require('./middlewares/limiters')

const usersRouter = require('./routes/users')
const transactionsRouter = require('./routes/transactions')
const categoriesRouter = require('./routes/categories')

const app = express()
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

const swaggerUi = require('swagger-ui-express')
const specs = require('./specs/swagger.json')

app.use(helmet())
app.disable('x-powered-by')
app.set('trust proxy', 1)

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json({ limit: 10000 }))

require('./configs/passport-config')

app.use('/api', apiLimiter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))

app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)
app.use('/api/categories', categoriesRouter)

app.use((req, res, next) => {
  res.status(HttpCode.NOT_FOUND).json({
    status: 'error',
    code: HttpCode.NOT_FOUND,
    message: `Read docs on /api-docs`,
    data: 'Not Found',
  })
})

app.use((err, req, res, next) => {
  err.status = err.status ? err.status : HttpCode.INTERNAL_SERVER_ERROR
  res.status(err.status).json({
    status: err.status === 500 ? 'fail' : 'error',
    code: err.status,
    message: err.message,
    data: err.status === 500 ? 'Internal Server Error' : err.data,
  })
})

module.exports = app
