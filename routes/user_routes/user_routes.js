const router = require('express').Router()
// const upload = require('multer')({
//   limits: { fileSize: 1000000 },
//   fileFilter(req, file, cb) {
//     if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
//       cb(new Error('Please upload an image.'))
//     }
//     cb(undefined, true)
//   },
// })

const { authenticate } = require('../../controller/encryption_controller')
const {
  fetchUserInfo,
  updateUserInfo,
  fetchUserPosts,
  deleteUserPost,
  saveUserPost,
  saveUserImage,
  findUserImage,
  deleteUserImage,
} = require('../../controller/user_action_controller')

// Image Routes
router.get('/:userId/image?', [authenticate, findUserImage])
router.post('/:userId/image', [authenticate, saveUserImage])
router.delete('/:userId/image?', [authenticate, deleteUserImage])

//Blog Routes
router.get('/:userId/posts?', [authenticate, fetchUserPosts])
router.post('/:userId/posts', [saveUserPost])
router.delete('/:userId/post?', [authenticate, deleteUserPost])

// User Info Routes
router.get('/:userId/profile', [authenticate, fetchUserInfo])
router.put('/:userId/profile', [authenticate, updateUserInfo])

// User Search Routes
// router.get('/:userId/search?')

module.exports = router
