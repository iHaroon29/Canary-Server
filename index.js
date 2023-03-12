const http = require('http')
const app = require('./app')
const port = process.env.NODE_ENV === 'prod' ? process.env.PORT : 8000
if (process.env.NODE_ENV === 'dev') {
  const server = http.createServer(app)
  server.listen(port)
  server.on('listening', () => console.log('listening on 8000'))
  server.on('upgrade', async (req, socket, head) => {
    if (req.url.includes('/ws')) {
      const token = req.url.split('?token=')[1]
      const wss = await require('./controller/wsController').setupWS()
      wss.handleUpgrade(req, socket, head, (socket) => {
        socket.token = token
        wss.emit('connection', socket, req)
      })
    } else {
      const wss = await require('./test/test').setupFakeWs()
      wss.handleUpgrade(req, socket, head, (socket) => {
        wss.emit('connection', socket, req)
      })
    }
  })
  server.on('error', (e) => {
    console.log(e.message)
  })
}
