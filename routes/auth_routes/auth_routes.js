const router = require('express').Router()
const {
  signup,
  login,
  refreshAuth,
} = require('../../controller/encryption_controller')

// User Auth Routes

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/refresh').get(refreshAuth)

// Admin Auth Routes



module.exports = router
