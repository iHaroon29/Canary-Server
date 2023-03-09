const { Schema } = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const connection = require('../config')

const postSchema = new Schema(
  {
    title: {
      type: String,
    },
    meta: {
      authorName: {
        type: String,
      },

      userReferenceId: {
        type: require('mongoose').Schema.Types.ObjectId,
        ref: 'User',
      },
    },
    jsonData: {
      type: String,
    },
    tags: [{ type: String }],
  },
  { timestamps: true }
)

postSchema.statics.savePost = async function (data) {
  try {
    const { title, authorName, jsonData, tags, userReferenceId } = data
    return await this.create({
      title,
      meta: {
        authorName,
        userReferenceId: ObjectId(userReferenceId),
      },
      jsonData,
      tags: [...tags],
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
