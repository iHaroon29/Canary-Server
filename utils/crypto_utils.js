require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

module.exports = {
  async hashPassword(data) {
    try {
      return bcrypt.hash(data, 10)
    } catch (e) {
      console.log(e.message)
    }
  },
  async verifyPassword(data, hash) {
    try {
      return bcrypt.compare(data, hash)
    } catch (e) {
      console.log(e.message)
    }
  },
  async generateToken(data, duration) {
    try {
      return jwt.sign({ data }, process.env.JWT_SECRET, {
        expiresIn: duration,
      })
    } catch (e) {
      console.log(e.message)
    }
  },
  async verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET)
    } catch (e) {
      console.log(e.message)
    }
  },
  async decodeToken(token) {
    try {
      return jwt.decode(token)
    } catch (e) {
      console.log(e.message)
    }
  },
  generateId(size) {
    try {
      return crypto.randomBytes(size).toString('hex')
    } catch (e) {
      console.log(e.message)
    }
  },
}
