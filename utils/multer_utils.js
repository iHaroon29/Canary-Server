const path = require('path')
const storage = require('multer').diskStorage({
  destination: (req, file, cb) => {
    const { userId } = req.params
    cb(null, `static/${userId}/images`)
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + '_' + Date.now() + path.extname(file.originalname)
    )
  },
})

const upload = require('multer')({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      cb(new Error('Please upload an image.'))
    }
    cb(undefined, true)
  },
})

module.exports = upload
