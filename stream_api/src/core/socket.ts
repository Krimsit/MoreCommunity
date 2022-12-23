import socket from 'socket.io'
import http from 'http'

interface IJoinStream {
  room: string
  username: string
}

export default (http: http.Server) => {
  const io = new socket.Server(http, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  })

  io.on('connection', (socket: socket.Socket) => {
    socket.on('STREAM:JOIN', ({ room, username }: IJoinStream) => {
      socket.join(room)

      io.to(room).emit('user_joined', {
        username: username
      })
    })
  })

  return io
}
