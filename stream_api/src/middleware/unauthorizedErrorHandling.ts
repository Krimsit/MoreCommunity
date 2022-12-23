import { RequestHandler } from 'express'
import { parseJwt, verifyToken } from "../utils/helper"

const errorHandler: RequestHandler = (req, res, next) => {
  if (!req.headers['authorization']) {
    return res.status(403).json({
      status: 403,
      message: 'Вы не авторизованы',
      data: null
    })
  }

  const jwt = parseJwt(verifyToken(req.headers['authorization'] || ""))

  if (!jwt) {
    return res.status(403).json({
      status: 403,
      message: 'Вы не авторизованы',
      data: null
    })
  }

  next()
}

export default errorHandler
