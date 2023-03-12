const app = require('express')()
const routes = require('./routes/route_handler')

//Config
app.use(require('cors')({ origin: 'http://localhost:3000', credentials: true }))
app.use(require('helmet')())
app.use(require('cookie-parser')())
app.use(require('express').urlencoded({ extended: true }))
app.use(require('express').json({ limit: '10mb' }))
app.use(require('morgan')('tiny'))

//Routes

app.use((err, req, res, next) => {
  if (err.status === 400) {
    return res
      .status(err.status)
      .send({ status: err.status, message: 'Invalid JSON format' })
  }
  return next(err)
})

app.use('/images', require('express').static('static/images'))

app.use(routes)

app.use((err, req, res, next) => {
  res.status(404).json({
    name: 'Error',
    status: 404,
    message: 'Invalid Request',
    statusCode: 404,
  })
})

module.exports = app
