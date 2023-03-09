const user_image_model = require('../database/models/user_image_model')
const user_info_model = require('../database/models/user_info_model')
const user_post_model = require('../database/models/user_post_model')
module.exports = {
  async fetchUserInfo(req, res, next) {
    try {
      const { userId } = req.params
      const info = await user_info_model.findInfo({ userId })
      res.status(200).json(info)
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },
  async updateUserInfo(req, res, next) {
    try {
      const { fullname, about } = req.body
      const { userId } = req.params
      const info = await user_info_model.updateInfo({ fullname, about, userId })
      res.status(200).json(info)
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },
  async saveUserPost(req, res, next) {
    try {
      const { jsonData, title, tags } = req.body
      const { userId } = req.params
      const newPost = await user_post_model.savePost({
        jsonData,
        title,
        userReferenceId: userId,
        tags,
      })
      res.status(200).send({ post: newPost, message: 'OK' })
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },
  async fetchUserPosts(req, res, next) {
    try {
      const { _id, page } = req.query
      const { userId } = req.params
      const posts = await user_post_model.findPosts(
        {
          _id,
          userReferenceId: userId,
        },
        page
      )
      res.status(200).send({ posts })
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },
  async deleteUserPost(req, res, next) {
    try {
      const { _id } = req.query
      const post = await user_post_model.deletePost(_id)
      res.status(200).send({ message: 'OK', post })
    } catch (e) {
      console.log(e.message)
      res.status(500).send({ message: e.message })
    }
  },
  async userSearch(req, res, next) {
    try {
      const { userId } = req.params
      const { fullname } = req.search
    } catch (e) {
      console.log(e.message)
      res.status(500).send({ message: e.message })
    }
  },
  async saveUserImage(req, res, next) {
    try {
      const { userId } = req.params
      const newImage = await user_image_model.saveUserImage({
        imageData: req.file.buffer,
        userReferenceId: userId,
      })
      res.status(200).send({ imageId: newImage._id })
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },
  async findUserImage(req, res, next) {
    try {
      const { imageId } = req.query
      const { userId } = req.params
      if (!imageId) return res.status(400).send({ message: 'Invalid Image Id' })
      const image = await user_image_model.findUserImage({
        _id: imageId,
        userReferenceId: userId,
      })
      if (!image) return res.status(404).send({ message: 'Image Not Found' })
      res.set('Content-Type', 'image/png')
      res.status(200).send(image.imageData)
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },
  async deleteUserImage(req, res, next) {
    try {
      const { imageId } = req.query
      if (!imageId) return res.status(400).send({ message: 'Invalid Image Id' })
      const image = await user_image_model.deleteUserImage({ _id: imageId })
      if (!image) return res.status(404).send({ message: 'Image Not Found' })
      res.status(200).json(image)
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },
}
