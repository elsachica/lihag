/**
 * @file Routes for notification endpoints.
 * @module routes/notificationRoutes
 * @version 1.0.0
 */

import express from 'express'
import { NotificationController } from '../controllers/NotificationController.js'

export const router = express.Router()
const controller = new NotificationController()

/**
 * Get all notifications (Admin)
 * GET /notifications
 */
router.get('/', (req, res, next) => controller.index(req, res, next))

/**
 * Get specific notification by ID
 * GET /notifications/:id
 */
router.get('/:id', (req, res, next) => controller.show(req, res, next))

/**
 * Get all notifications for a tenant
 * GET /notifications/tenant/:tenantId
 */
router.get('/tenant/:tenantId', (req, res, next) =>
  controller.getTenantNotifications(req, res, next)
)
