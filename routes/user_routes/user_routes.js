const router = require('express').Router()
const { authenticate } = require('../../controller/encryption_controller')
const {
  fetchUserInfo,
  updateUserInfo,
  fetchUserPosts,
  deleteUserPost,
} = require('../../controller/user_action_controller')

// Post Routes
router.get('/:userId/posts?', [authenticate, fetchUserPosts])
// router.update('/:userId/post?')
router.delete('/:userId/post?', [authenticate, deleteUserPost])

// User Info Routes
router.get('/:userId/profile', [authenticate, fetchUserInfo])
router.put('/:userId/profile', [authenticate, updateUserInfo])

// User Search Routes
// router.get('/:userId/search?')

module.exports = router
