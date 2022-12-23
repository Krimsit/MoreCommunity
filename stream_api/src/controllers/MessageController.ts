import { Request, Response } from 'express'
import socket from 'socket.io'

import { Message } from '../models'

class MessageController {
  io: socket.Server

  constructor(io: socket.Server) {
    this.io = io
  }

  getAll = (req: Request, res: Response) => {
    const streamId = req.query.stream

    Message.find({ streamId: streamId })
      .then((messages) => {
        if (!messages) {
          return res.status(404).json({
            status: 404,
            message: 'Сообщения не найдены',
            data: null
          })
        }

        return res.status(200).json({
          status: 200,
          message: 'Запрос успешно выполнен',
          data: messages
        })
      })
      .catch(() => {
        return res.status(500).json({
          status: 500,
          message: 'Возникли ошибки при получении сообщений',
          data: null
        })
      })
  }

  create = (req: Request, res: Response) => {
    const { room, text, username, streamId } = req.body

    const postData = {
      text: text,
      username: username,
      streamId: streamId
    }

    const message = new Message(postData)

    message
      .save()
      .then((messageObj) => {
        this.io.to(room).emit('STREAM:NEW_MESSAGE', { message: messageObj })

        return res.status(200).json({
          status: 200,
          message: 'Запрос успешно выполнен',
          data: messageObj
        })
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message: 'Возникли ошибки при отправке сообщения',
          data: error.message
        })
      })
  }
}

export default MessageController
