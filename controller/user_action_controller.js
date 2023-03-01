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
}
