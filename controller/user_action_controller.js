const user_auth_model = require('../database/models/user_auth_model')
const user_image_model = require('../database/models/user_image_model')
const user_info_model = require('../database/models/user_info_model')
const user_blog_model = require('../database/models/user_blog_model')
const { createImageFile, deleteImageFile } = require('../utils/fs_utils')
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
      const user = await user_auth_model.findUser({ _id: userId })
      if (user.length === 0 || !user)
        return res.status(400).send({ message: 'User does not exist!' })
      const newPost = await user_blog_model.saveBlog({
        jsonData,
        title,
        userReferenceId: userId,
        tags,
        authorName: user[0].username,
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
      const posts = await user_blog_model.findBlog(
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
      const post = await user_blog_model.deleteBlog(_id)
      res.status(200).send({ message: 'OK', post })
    } catch (e) {
      console.log(e.message)
      res.status(500).send({ message: e.message })
    }
  },
  async saveUserImage(req, res, next) {
    try {
      const filename = await createImageFile(req.body.upload)
      res.status(200).send({ url: `http://localhost:8000/images/${filename}` })
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
      res.set('Content-Type', 'image/jpeg')
      res.status(200).send(Buffer.from(image[0].imageData.toString(), 'binary'))
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },
  async deleteUserImage(req, res, next) {
    try {
      const { imageName } = req.query
      const { userId } = req.params
      const filePath = './static/images/' + imageName
      const { isDeleted, message } = await deleteImageFile(filePath)
      if (!isDeleted) return res.status(404).send({ message })
      res.status(200).send({ message: `${imageName} has been deleted` })
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },

  async saveUserDraft(req, res, next) {
    try {
      const { id } = req.body
      const exitingBlog = await user_blog_model.findBlog({ uniqueId })
      const newDraft = await user_blog_model.saveBlog({
        ...req.body,
        isDraft: true,
      })
      res.status(200).send({})
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },
  async findUserDraft(req, res, next) {
    try {
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },
  async updateUserDraft(req, res, next) {
    try {
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },
  async deleteUserDraft(req, res, next) {
    try {
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },
}
