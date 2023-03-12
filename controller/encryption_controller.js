const userInfoModel = require('../database/models/user_info_model')
const userModel = require('../database/models/user_auth_model')
const {
  hashPassword,
  generateToken,
  verifyPassword,
  verifyToken,
  decodeToken,
} = require('../utils/crypto_utils')

module.exports = {
  async signup(req, res, next) {
    try {
      const { email, password, username } = req.body
      const hashedPassword = await hashPassword(password)
      const existingUser = await userModel.findUser({ username, email })
      if (existingUser.length !== 0)
        return res
          .status(400)
          .send({ message: 'email taken', authorization: false })
      const newUser = await userModel.saveUser({
        email,
        password: hashedPassword,
        username,
      })
      await userInfoModel.saveUserInfo({
        username,
        email,
        userReferenceId: newUser._id,
      })
      const accessToken = await generateToken(newUser._id, 15 * 60)
      const refreshToken = await generateToken(newUser._id, 24 * 60 * 60 * 2)
      res.cookie('canary_refresh', refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + 48 * 3600000),
        sameSite: 'none',
      })
      res.status(200).send({ authorization: true, accessToken })
    } catch (e) {
      res.status(500).send({ message: e.message, authorization: false })
    }
  },
  async login(req, res, next) {
    try {
      const { password, username } = req.body
      const existingUser = await userModel.findUser({ username })
      if (existingUser.length === 0)
        return res
          .status(400)
          .send({ message: 'User Does not exists!', authorization: false })
      if (!(await verifyPassword(password, existingUser[0].password))) {
        return res
          .status(400)
          .send({ message: 'Invalid Credentials', authorization: false })
      }
      const accessToken = await generateToken(existingUser[0]._id, 15 * 60)
      const refreshToken = await generateToken(
        existingUser[0]._id,
        24 * 60 * 60 * 2
      )
      res.cookie('canary_refresh', refreshToken, {
        maxAge: 900000,
        httpOnly: true,
        sameSite: 'none',
      })
      res.status(200).send({ authorization: true, accessToken })
    } catch (e) {
      res.status(500).send({ message: e.message, authorization: false })
    }
  },
  async authenticateMiddleware(req, res, next) {
    try {
      const { authorization } = req.headers
      if (!authorization)
        return res.status(400).send({
          message: 'Missing Token, Please Signup/login!',
          authorization: false,
        })
      if (!/Bearer /.test(authorization)) {
        return res
          .status(400)
          .send({ message: 'Invalid Token Format', authorization: false })
      }
      const token = authorization.trim().split(' ')[1]
      if (!(await verifyToken(token)))
        return res
          .status(400)
          .send({ message: 'Token Invalid', authorization: false })
      next()
    } catch (e) {
      res.status(500).send({ message: e.message, authorization: false })
    }
  },

  async refreshAuth(req, res, next) {
    try {
      const { canary_refresh } = req.cookies
      if (!(await verifyToken(canary_refresh))) {
        return res
          .status(400)
          .send({ message: 'Token Invalid', authorization: false })
      }
      const data = await decodeToken(canary_refresh).data
      const accessToken = await generateToken(data, 10 * 60)
      res.status(200).send({ accessToken, authorization: true })
    } catch (e) {
      res.status(500).send({ message: e.message, authorization: false })
    }
  },
  async logout(req, res, next) {
    try {
      res.clearCookie('canary_refresh')
      res.status(200).send({ logout: true })
    } catch (e) {
      res.status(500).send({ message: e.message })
    }
  },
}
