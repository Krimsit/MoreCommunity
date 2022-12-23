import { Request, Response } from 'express'
import socket from 'socket.io'

import { baseDb } from '../core'

import { getUserIdFromToken } from '../utils/helper'

import { Stream } from '../models'

class StreamController {
  io: socket.Server

  constructor(io: socket.Server) {
    this.io = io
  }

  getData = (req: Request, res: Response) => {
    const streamId = req.query.stream

    Stream.findById(streamId)
      .then((stream) => {
        if (!stream) {
          return res.status(404).json({
            status: 404,
            message: 'Стрим не найден',
            data: null
          })
        }

        return res.status(200).json({
          status: 200,
          message: 'Запрос успешно выполнен',
          data: stream
        })
      })
      .catch(() => {
        return res.status(500).json({
          status: 500,
          message: 'Возникли ошибки при получении данных трансляции',
          data: null
        })
      })
  }

  start = (req: Request, res: Response) => {
    const userId = getUserIdFromToken(req)

    if (typeof userId === 'number') {
      baseDb.query(
        'SELECT "OwnerId" FROM public."Communities" WHERE "Id" = $1',
        [req.body.communityId],
        (error, result) => {
          if (error) {
            return res.status(500).json({
              status: 500,
              message: 'Возникли ошибки при обновлении данных сообщества',
              data: null
            })
          }

          const communityOwnerId = result?.rows[0]?.OwnerId

          if (communityOwnerId !== userId) {
            return res.status(403).json({
              status: 403,
              message: 'У вас нет доступа',
              data: null
            })
          }

          Stream.find({ communityId: req.body.communityId })
            .then((obj) => {
              if (!!obj.length) {
                return res.status(500).json({
                  status: 500,
                  message: 'Данное сообщество уже ведёт стрим',
                  data: null
                })
              }

              const stream = new Stream(req.body)

              stream
                .save()
                .then((streamObj) => {
                  baseDb.query(
                    'UPDATE public."Communities" SET "StreamId" = $1 WHERE "Id" = $2',
                    [streamObj.id, req.body.communityId],
                    (error, result) => {
                      if (error) {
                        return res.status(500).json({
                          status: 500,
                          message:
                            'Возникли ошибки при обновлении данных сообщества',
                          data: null
                        })
                      }

                      this.io.emit('COMMUNITY:STREAM_STATUS', {
                        communityId: req.body.communityId,
                        isOnline: true
                      })

                      return res.status(200).json({
                        status: 200,
                        message: 'Запрос успешно выполнен',
                        data: streamObj
                      })
                    }
                  )
                })
                .catch(() => {
                  return res.status(500).json({
                    status: 500,
                    message: 'Возникли ошибки при создании стрима',
                    data: null
                  })
                })
            })
            .catch(() => {
              return res.status(500).json({
                status: 500,
                message: 'Возникли ошибки при создании стрима',
                data: null
              })
            })
        }
      )
    } else {
      return res.status(403).json({
        status: 403,
        message: 'Вы не авторизованы',
        data: null
      })
    }
  }

  stop = (req: Request, res: Response) => {
    const { communityId, streamId } = req.body

    const userId = getUserIdFromToken(req)

    baseDb.query(
      'SELECT "OwnerId" FROM public."Communities" WHERE "Id" = $1',
      [communityId],
      (error, result) => {
        if (error) {
          return res.status(500).json({
            status: 500,
            message: 'Возникли ошибки при обновлении данных сообщества',
            data: null
          })
        }

        const communityOwnerId = result?.rows[0]?.OwnerId

        if (communityOwnerId !== userId) {
          return res.status(403).json({
            status: 403,
            message: 'У вас нет доступа',
            data: null
          })
        }

        Stream.findByIdAndDelete(streamId)
        .then((obj) => {
          if (!obj) {
            return res.status(404).json({
              status: 404,
              message: 'Данное сообщество не ведёт стрим',
              data: null
            })
          }

          baseDb.query(
            'UPDATE public."Communities" SET "StreamId" = $1 WHERE "Id" = $2',
            ['', communityId],
            (error, result) => {
              if (error) {
                return res.status(500).json({
                  status: 500,
                  message:
                    'Возникли ошибки при обновлении данных сообщества',
                  data: null
                })
              }

              this.io.emit('COMMUNITY:STREAM_STATUS', {
                communityId,
                isOnline: false
              })

              return res.status(200).json({
                status: 200,
                message: 'Запрос успешно выполнен',
                data: true
              })
            }
          )
        })
        .catch(() => {
          return res.status(500).json({
            status: 500,
            message: 'Возникли ошибки при остановке стрима',
            data: null
          })
        })
      }
    )
  }
}

export default StreamController
