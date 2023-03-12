const router = require('express').Router()
const {
  authenticateMiddleware,
} = require('../../controller/encryption_controller')
const {
  fetchUserInfo,
  updateUserInfo,
  fetchUserPosts,
  deleteUserPost,
  saveUserPost,
  saveUserImage,
  deleteUserImage,
  saveUserDraft,
  findUserDraft,
  updateUserDraft,
  deleteUserDraft,
} = require('../../controller/user_action_controller')

// Image Routes
router.post('/:userId/image', [authenticateMiddleware, saveUserImage])
router.delete('/:userId/image?', [authenticateMiddleware, deleteUserImage])

//Blog Routes
router.get('/:userId/blogs?', [authenticateMiddleware, fetchUserPosts])
router.post('/:userId/blogs', [authenticateMiddleware, saveUserPost])
router.delete('/:userId/blogs?', [authenticateMiddleware, deleteUserPost])

// Blog Draft Routes
router.post('/:userId/draft', [authenticateMiddleware, saveUserDraft])
router.get('/:userId/draft?', [authenticateMiddleware, findUserDraft])
router.put('/:userId/draft?', [authenticateMiddleware, updateUserDraft])
router.delete('/:userId/draft?', [authenticateMiddleware, deleteUserDraft])

// User Info Routes
router.get('/:userId/profile', [authenticateMiddleware, fetchUserInfo])
router.put('/:userId/profile', [authenticateMiddleware, updateUserInfo])

// User Search Routes

module.exports = router
