/**
 * @file Defines the main router.
 * @module routes/router
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import express from 'express'
import { router as notificationRoutes } from './notificationRoutes.js'

export const router = express.Router()

router.use('/notifications', notificationRoutes)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  res.status(404).json({ error: 'Not Found' })
})
