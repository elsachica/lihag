/**
 * @file Defines the main router.
 * @module routes/router
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import express from 'express'
import { router as apartmentRouter } from './apartmentRoutes.js'
import { router as tenantRouter } from './tenantRoutes.js'
import { router as contractRouter } from './contractRoutes.js'

export const router = express.Router()

router.use('/apartments', apartmentRouter)
router.use('/tenants', tenantRouter)
router.use('/contracts', contractRouter)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  res.status(404).json({ error: 'Not Found' })
})