const { Schema } = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const connection = require('../config')

const postSchema = new Schema({
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  meta: {
    authorName: {
      type: String,
    },
    wordCount: {
      type: Number,
    },
    userReferenceId: {
      type: require('mongoose').Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  description: {
    type: String,
  },
  tags: [{ type: String }],
})

postSchema.statics.saveArticle = async function (data) {
  try {
    const {
      title,
      subtitle,
      authorName,
      description,
      tagName,
      userReferenceId,
    } = data
    const wordCount = description.split(' ').length
    return await this.create({
      title,
      subtitle,
      meta: {
        authorName,
        wordCount,
        userReferenceId: ObjectId(userReferenceId),
      },
      description,
      tagName,
    })
  } catch (e) {
    console.log(e.message)
  }
}

postSchema.statics.findPosts = async function (data, page = 0) {
  try {
    const pageNumber =
      parseInt(page) >= 0 && parseInt(page) ? parseInt(page) : 0
    const limit = 10
    const skip = pageNumber * 10
    if (data._id)
      return await this.find({ ...data, _id: ObjectId(data._id) })
        .limit(limit)
        .skip(skip)
    if (data.userReferenceId)
      return await this.find({
        $match: { 'meta.userReferenceID': ObjectId(data.userReferenceId) },
      })
        .limit(limit)
        .skip(skip)
  } catch (e) {
    console.log(e.message)
  }
}

postSchema.statics.deletePost = async function (_id) {
  try {
    return await this.findByIdAndUpdate(_id)
  } catch (e) {
    console.log(e.message)
  }
}

module.exports = connection.model('post', postSchema)
