const { Server } = require('ws')
const fs = require('fs')
const jsonReadStream = fs.createReadStream('testFeed.json')
const clientMap = []
var fakeJSON = ''
;(async () => {
  for await (const chunk of jsonReadStream) fakeJSON += chunk.toString()
})()

module.exports = {
  async setupFakeWs() {
    const ws = new Server({ noServer: true })
    ws.on('connection', (socket) => {
      clientMap.push(socket)
      socket.on('message', (buffer) => {
        const randomUpdate = Math.floor(
          Math.random() * JSON.parse(fakeJSON).length
        )
        const { requestType } = JSON.parse(buffer.toString())
        if (requestType === 'ping') {
          socket.send(
            JSON.stringify({
              responseType: 'pong',
              data: JSON.parse(fakeJSON)[randomUpdate],
            })
          )
        }
      })
      socket.on('close', () => {
        const instance = clientMap.find((node) => node === socket)
        clientMap.splice(clientMap.indexOf(instance), 1)
      })
    })
    return ws
  },
}
