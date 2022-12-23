import cors from 'cors'
import { Server as SocketServer } from 'socket.io'
import express from 'express'
import bodyParser from 'body-parser'

import unauthorizedErrorHandling from '../middleware/unauthorizedErrorHandling'

import { MessageController, StreamController } from '../controllers'

export default (app: express.Application, io: SocketServer) => {
  const Stream = new StreamController(io)
  const Message = new MessageController(io)

  app.use(cors())
  app.use(bodyParser.json())

  app.get('/stream', Stream.getData)
  app.post('/stream/start', unauthorizedErrorHandling, Stream.start)
  app.post('/stream/stop', unauthorizedErrorHandling, Stream.stop)

  app.get('/stream/messages', Message.getAll)
  app.post('/stream/messages', unauthorizedErrorHandling, Message.create)
}
