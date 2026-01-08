/**
 * @file Defines the Express app without starting the server
 */

import '@lnu/json-js-cycle'
import cors from 'cors'
import express from 'express'
import httpContext from 'express-http-context'
import { randomUUID } from 'node:crypto'
import { router } from './routes/router.js'

export const createApp = () => {
  const app = express()

  app.use(cors({
    origin: [
      'http://lihag.172.27.62.133.nip.io',
      'http://lihag.admin.172.27.62.133.nip.io',
      'http://lihag.172.27.60.122.nip.io',
      'http://lihag.admin.172.27.60.122.nip.io'
    ],
    exposedHeaders: ['Content-Range'],
    credentials: true
  }))
  app.use(express.json())

  app.use(httpContext.middleware)

  app.use((req, res, next) => {
    req.requestUuid = randomUUID()
    httpContext.set('request', req)
    next()
  })

  app.use('/', router)

  // Error handler
  app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
      if (!err.status) {
        err.status = 500
        err.message = 'Internal Server Error'
      }
      return res.status(err.status).json({ status: err.status, message: err.message })
    }
    return res.status(err.status || 500).json(JSON.decycle(err))
  })

  return app
}
