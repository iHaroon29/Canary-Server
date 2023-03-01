const { Server } = require('ws')
const news_model = require('../database/models/user_post_model')
const userModel = require('../database/models/user_auth_model')
const tagModel = require('../database/models/user_info_model')
const { decodeToken, verifyToken } = require('../utils/crypto_utils')
const ObjectId = require('mongoose').Types.ObjectId
const tag_model = require('../database/models/user_info_model')
const clientMap = []
module.exports = {
  async setupWS() {
    try {
      const wss = new Server({ noServer: true, path: '/ws/feed' })
      wss.on('connection', async (socket) => {
        if (!(await verifyToken(socket.token))) {
          socket.send(
            JSON.stringify({ message: 'Invalid Token', responseType: 'ack' })
          )
          return socket.close()
        }
        const { data } = await decodeToken(socket.token)
        clientMap.push({ uniqueId: data, socket })
        socket.send(JSON.stringify({ messageData: 'OK', responseType: 'ack' }))
        socket.on('message', async (packet) => {
          try {
            const { messageData = null, requestType = null } = JSON.parse(
              packet.toString()
            )
            if (!requestType)
              return socket.send({ message: 'Invalid Request Type' })
            switch (requestType) {
              case 'pull': {
                const updates = await this.fetchUpdates(messageData)
                return socket.send(
                  JSON.stringify({ updates, responseType: 'ack' })
                )
              }
              case 'subscribe': {
                return await this.updateClientSocket(socket.token, messageData)
              }
              case 'unsubscribe': {
                return await this.unsubscribe(socket.token, messageData)
              }
              case 'publish': {
                return await this.saveDocument(socket.token, messageData)
              }
              case 'close': {
                return await this.closeConnection(socket.token)
              }
              default: {
                return socket.send(JSON.stringify({ message: 'pong' }))
              }
            }
          } catch (e) {
            console.log(e.message)
          }
        })
        socket.on('close', () => {
          const instance = clientMap.find((node) => node.uniqueId === data)
          clientMap.splice(clientMap.indexOf(instance), 1)
        })
      })
      wss.on('close', () => {
        console.log('Connection Closed')
      })
      wss.on('error', (e) => {
        console.log(e.message)
      })
      return wss
    } catch (e) {
      console.log(e.message)
    }
  },
  async updateClientSocket(token, tags) {
    try {
      const { data } = await decodeToken(token)
      const connection = clientMap.find((node) => node.uniqueId === data)
      await tagModel.findOneAndUpdate(
        { userReferenceId: data },
        { $addToSet: { subscriptions: { $each: tags } } },
        {
          upsert: true,
        }
      )
      connection.socket.send(
        JSON.stringify({
          message: 'OK',
          responseType: 'ack',
        })
      )
    } catch (e) {
      console.log(e.message)
    }
  },
  async unsubscribe(token, tags) {
    try {
      const { data } = await decodeToken(token)
      const connection = clientMap.find((node) => node.uniqueId === data)
      await tag_model.findOneAndUpdate(
        {
          userReferenceId: data,
        },
        { $pull: { subscriptions: { $in: tags } } },
        {
          upsert: true,
        }
      )
      connection.socket.send(
        JSON.stringify({
          message: 'OK',
          responseType: 'ack',
        })
      )
    } catch (e) {
      console.log(e.message)
    }
  },
  async closeConnection(token) {
    try {
      const { data } = await decodeToken(token)
      const user = clientMap.find((node) => node.uniqueId === data)
      user.socket.send(
        JSON.stringify({
          disconnect: true,
          messageData: 'OK',
          responseType: 'disconnect',
        })
      )
      clientMap.splice(clientMap.indexOf(socket), 1)
    } catch (e) {
      console.log(e.message)
    }
  },
  async saveDocument(token, messageData) {
    try {
      const { title, subtitle, description, authorName, tags } = messageData
      const { data } = await decodeToken(token)
      const wordCount = description.split(' ').length
      const newArticle = await news_model.create({
        title,
        subtitle,
        description,
        meta: { authorName, wordCount, userReferenceId: ObjectId(data) },
        tags,
      })
      const tagRecords = await tag_model.aggregate([
        { $match: { subscriptions: { $in: tags } } },
        { $project: { userReferenceId: 1 } },
      ])
      const userId = tagRecords.map((node) =>
        ObjectId(node.userReferenceId).toString()
      )
      userId.forEach((id) => {
        const user = clientMap.find(({ uniqueId }) => uniqueId === id)
        if (user)
          user.socket.send(
            JSON.stringify({
              responseType: 'notification',
              messageData: newArticle,
            })
          )
      })
    } catch (e) {
      console.log(e.message)
    }
  },
  async verifyAdminToken(data) {
    try {
      const user = await userModel.findUser({ _id: data })
      if (user.length === 0) {
        return false
      }
      if (!user[0].isAdmin) {
        return false
      }
      return true
    } catch (e) {
      console.log(e.message)
    }
  },
  async fetchUpdates(token) {
    try {
      const results = await tagModel.aggregate([
        { $match: { $userReferenceId: ObjectId(token) } },
        {
          $unwind: {
            path: 'subscriptions',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: 'New',
            localField: 'subscriptions',
            foreignField: 'tagName',
            as: 'userSubs',
          },
        },
        {
          $unwind: '${userSubs}',
        },
      ])
      console.log(results)
    } catch (e) {
      console.log(e.message)
    }
  },
}
