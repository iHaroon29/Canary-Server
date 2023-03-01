const app = require('express')()
const routes = require('./routes/route_handler')

app.use(require('cors')())
app.use(require('helmet')())
app.use(require('express').urlencoded({ extended: true }))
app.use(require('express').json())

app.use(routes)

module.exports = app
