require('dotenv').config()
const mongoose = require('mongoose')

const connection = mongoose.createConnection(process.env.DB_URL_LOCAL)

connection.on('connecting', (test) => {
  console.log(test)
})
connection.on('disconnected', (e) => {
  console.log(e.message)
})

connection.on('connected', () => {
  console.log('Connection Established')
})

module.exports = connection
