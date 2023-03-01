const { Schema } = require('mongoose')
const connection = require('../config')
const ObjectId = require('mongoose').Types.ObjectId
const userInfoSchema = new Schema({
  username: {
    type: String,
  },
  fullname: {
    type: String,
  },
  email: {
    type: String,
  },
  About: {
    type: String,
  },
  userReferenceId: {
    type: require('mongoose').Schema.Types.ObjectId,
    ref: 'User',
  },
  subscriptions: [{ type: String }],
})

userInfoSchema.statics.saveUserInfo = async function (data) {
  try {
    return await this.create({
      ...data,
      userReferenceId: ObjectId(data.userReferenceId),
    })
  } catch (e) {
    console.log(e.message)
  }
}

userInfoSchema.statics.findInfo = async function ({ userId, username }) {
  try {
    return await this.findOne({ userReferenceId: ObjectId(userId) })
  } catch (e) {
    console.log(e.message)
  }
}

userInfoSchema.statics.updateInfo = async function ({
  fullname,
  about,
  userId,
}) {
  try {
    let update = {}
    if (fullname) update.fullname = fullname
    if (about) update.about = about
    return await this.findOneAndUpdate(
      { userReferenceId: ObjectId(userId) },
      update
    )
  } catch (e) {
    console.log(data)
  }
}

userInfoSchema.statics.updateTagData = async function (update) {
  try {
    const { userReferenceId, tagName, type } = update
    if (type === 'add') {
      const record = await this.findOneAndUpdate(
        { userReferenceId },
        {
          $push: { subscriptions: { $each: tagName } },
        }
      )
      return record
    }
    return await this.findOneAndUpdate(
      { userReferenceId },
      { $pull: { subscriptions: { tagName } } }
    )
  } catch (e) {
    console.log(e.message)
  }
}

module.exports = connection.model('user-info', userInfoSchema)
