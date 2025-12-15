/**
 * @file Defines the main router.
 * @module routes/router
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import express from 'express'
import { router as apartmentRouter } from './apartmentRoutes.js'

export const router = express.Router()

router.use('/apartments', apartmentRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  res.status(404).json({ error: 'Not Found' })
})
