const mongoose = require('mongoose')

require('dotenv').config()
const { DB_USER, DB_PASS, DB_NAME } = process.env
const DB_HOST = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.xs0ub.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`

const connection = mongoose.connect(DB_HOST, {
  promiseLibrary: global.Promise,
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open')
})

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose connection error: ${err.message}`)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected')
})

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection disconnected app termination')
    process.exit(1)
  })
})

module.exports = connection
