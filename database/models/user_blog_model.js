const { Schema } = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const connection = require('../config')

const blogSchema = new Schema(
  {
    uniqueId: {
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
    isDraft: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
)

blogSchema.statics.saveBlog = async function (data) {
  try {
    const { title, authorName, jsonData, tags, userReferenceId, isDraft } = data
    return await this.create({
      title,
      meta: {
        authorName,
        userReferenceId: ObjectId(userReferenceId),
      },
      jsonData,
      tags: [...tags],
      isDraft,
    })
  } catch (e) {
    console.log(e.message)
  }
}

blogSchema.statics.findBlog = async function (data, page = 0) {
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

blogSchema.statics.deleteBlog = async function (_id) {
  try {
    return await this.findByIdAndUpdate(_id)
  } catch (e) {
    console.log(e.message)
  }
}

module.exports = connection.model('blog', blogSchema)
