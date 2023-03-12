const router = require('express').Router()
const {
  signup,
  login,
  refreshAuth,
  logout,
} = require('../../controller/encryption_controller')

// User Auth Routes

router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/refresh').get(refreshAuth)
router.route('/logout').get(logout)
// Admin Auth Routes

router.route('/admin/signup').post(signup)
router.route('/admin/login').post(login)
router.route('/admin/refresh').get(refreshAuth)

module.exports = router
