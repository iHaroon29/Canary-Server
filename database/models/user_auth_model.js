const { Schema } = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId
const connection = require('../config')

const userSchema = new Schema(
  {
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.statics.saveUser = async function (data) {
  try {
    const { email, password, username } = data
    return await this.create({ email, password, username })
  } catch (e) {
    console.log(e.message)
  }
}

userSchema.statics.findUser = async function (data, page = 0) {
  try {
    const pageNumber =
      parseInt(page) >= 0 && parseInt(page) ? parseInt(page) : 0
    const limit = 10
    const skip = 10 * pageNumber
    if (!data._id)
      return await this.find({ ...data })
        .limit(limit)
        .skip(skip)
    return await this.find({ ...data, _id: ObjectId(data._id) })
  } catch (e) {
    console.log(e.message)
  }
}

userSchema.statics.deleteUser = async function (data) {
  try {
    return await this.findOneAndDelete({ ...data, _id: ObjectId(data._id) })
  } catch (e) {
    console.log(e.message)
  }
}

module.exports = connection.model('User', userSchema)
