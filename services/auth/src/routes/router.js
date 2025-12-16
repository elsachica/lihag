/**
 * @file Defines the main router.
 * @module router
 * @author Anna Ståhlberg
 */

import express from 'express'
import http from 'node:http'
import { router as authRouter } from './authRouter.js'
import { router as apartmentRouter } from './apartmentRouter.js'
import { router as maintenanceRouter } from './maintenanceRouter.js'

export const router = express.Router()

router.use('/', authRouter)
router.use('/property', apartmentRouter)
router.use('/maintenance', maintenanceRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  console.log('404 Not Found:', req.originalUrl)
  const statusCode = 404
  const error = new Error(http.STATUS_CODES[statusCode])
  error.status = statusCode
  next(error)
})
