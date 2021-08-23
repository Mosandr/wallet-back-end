const app = require('../app')

const db = require('../db/connect-mongoose')

require('dotenv').config()

const { PORT = 3001 } = process.env

db.then(() => {
  console.log('Database connection successful')
  app.listen(PORT, async () => {
    console.log(`Server running. Use our API on port: ${PORT}`)
    console.log(`Read Documentation on: http://localhost:${PORT}/api-docs`)
    console.log(Date.now())
  })
}).catch(error => {
  console.log(`Server not running. Error message:${error.message}`)
})
