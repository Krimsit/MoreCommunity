import express from 'express'
import { createServer } from 'http'
import dotenv from 'dotenv'

dotenv.config()

import './core/baseDb'
import './core/db'
import { initRoutes, initRtmp, initSocket } from './core'

const app = express()
const http = createServer(app)
const io = initSocket(http)

initRoutes(app, io)
initRtmp(io)

http.listen(process.env.STREAM_API_PORT || 3003, () => {
  console.log(
    `Stream API running is http://localhost:${
      process.env.STREAM_API_PORT || 3003
    }`
  )
})
