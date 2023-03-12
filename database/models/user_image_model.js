const { Schema } = require('mongoose')
const connection = require('../config')
const ObjectId = require('mongoose').Types.ObjectId
const imageSchema = new Schema(
  {
    imageName: {
      type: String,
    },
    imageData: {
      type: Buffer,
    },
    userReferenceId: {
      type: require('mongoose').Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
)

imageSchema.statics.saveUserImage = async function ({
  imageName,
  imageData,
  userReferenceId,
}) {
  try {
    const newImage = await this.create({
      imageName,
      imageData,
      userReferenceId,
    })
    return newImage
  } catch (e) {
    console.log(e.message)
  }
}

imageSchema.statics.findUserImage = async function ({ _id, userReferenceId }) {
  try {
    let query = {}
    if (_id) query._id = ObjectId(_id)
    if (userReferenceId) query.userReferenceId = ObjectId(userReferenceId)
    return await this.find(query)
  } catch (e) {
    console.log(e.message)
  }
}

imageSchema.statics.deleteUserImage = async function ({ _id }) {
  try {
    return await this.findOneAndDelete(_id, { image: 0 })
  } catch (e) {
    console.log(e.message)
  }
}

module.exports = connection.model('images', imageSchema)
