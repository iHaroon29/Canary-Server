const app = require('express')()
const routes = require('./routes/route_handler')
const upload = require('multer')({
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      cb(new Error('Please upload an image.'))
    }
    cb(undefined, true)
  },
})

//Config

app.use(require('cors')())
app.use(require('helmet')())
app.use(require('express').urlencoded({ extended: true }))
app.use(require('express').json())
app.use(upload.single('upload'))

//Routes

app.use((err, req, res, next) => {
  if (err.status === 400) {
    return res
      .status(err.status)
      .send({ status: err.status, message: 'Invalid JSON format' })
  }
  return next(err)
})

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
