const router = require('express').Router()

router.use('/api/v1/auth', require('./auth_routes/auth_routes'))
router.use('/api/v1/users', require('./user_routes/user_routes'))
// router.use('/api/v1/admin')
module.exports = router
