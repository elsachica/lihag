/**
 * @file Handles notification-related requests.
 * @module controllers/NotificationController
 * @version 1.0.0
 */

import { NotificationModel } from '../models/NotificationModel.js'
import { logger } from '../config/winston.js'

/**
 * Controller for handling notification-related operations.
 */
export class NotificationController {
  /**
   * Get all notifications (Admin view).
   *
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Express next
   */
  async index (req, res, next) {
    try {
      logger.info('Fetching all notifications (admin view)')

      const notifications = await NotificationModel.find()
        .sort({ createdAt: -1 })
        .select('-body')

      logger.info(`Found ${notifications.length} notifications`)

      res.json({
        success: true,
        count: notifications.length,
        data: notifications
      })
    } catch (error) {
      logger.error('Error fetching notifications:', error)
      next(error)
    }
  }

  /**
   * Get a specific notification by ID.
   *
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Express next
   * @returns {Promise<void>} Sends a JSON response with the notification data or error.
   */
  async show (req, res, next) {
    try {
      const { id } = req.params

      const notification = await NotificationModel.findById(id)

      if (!notification) {
        logger.warn(`Notification not found: ${id}`)
        return res.status(404).json({
          success: false,
          error: 'Notification not found'
        })
      }

      logger.info(`Fetched notification: ${id}`)

      res.json({
        success: true,
        data: notification
      })
    } catch (error) {
      logger.error('Error fetching notification:', error)
      next(error)
    }
  }

  /**
   * Retrieves all notifications for a specific tenant so that tenants can view their own maintenance reports.
   *
   * @param {import('express').Request} req - Express request
   * @param {import('express').Response} res - Express response
   * @param {import('express').NextFunction} next - Express next
   */
  async getTenantNotifications (req, res, next) {
    try {
      const { tenantId } = req.params

      const notifications = await NotificationModel.find({ tenantId })
        .sort({ createdAt: -1 })
        .select('-body')

      logger.info(
        `Fetched ${notifications.length} notifications for tenant: ${tenantId}`
      )

      res.json({
        success: true,
        count: notifications.length,
        data: notifications
      })
    } catch (error) {
      logger.error('Error fetching tenant notifications:', error)
      next(error)
    }
  }
}
/**
 * TODO: Send notification to tenant when maintenance is registered
 * (Commented out for now - focus on admin emails first)
 */
// async sendTenantNotificationOnCreated (req, res, next) {
//   try {
//     // TODO: Implement
//   } catch (error) {
//     logger.error('Error sending tenant notification:', error)
//     next(error)
//   }
// }
