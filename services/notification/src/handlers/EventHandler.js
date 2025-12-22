/**
 * @file Routes events to appropriate handlers.
 * @module handlers/EventHandler
 */

import { logger } from '../config/winston.js'
import {
  handleMaintenanceCreatedEvent,
  handleMaintenanceUpdatedEvent,
  handleMaintenanceDeletedEvent
} from './MaintenanceHandler.js'

/**
 * Routes incoming RabbitMQ event to correct handler.
 *
 * @param {string} routingKey - RabbitMQ routing key
 * @param {object} event - Event data
 * @returns {Promise<void>}
 */
export async function routeEvent (routingKey, event) {
  try {
    logger.info(`📨 Event received: ${routingKey}`, {
      reportId: event.reportId
    })

    switch (routingKey) {
      case 'maintenance.created':
        await handleMaintenanceCreatedEvent(event)
        break

      case 'maintenance.updated':
        await handleMaintenanceUpdatedEvent(event)
        break

      case 'maintenance.deleted':
        await handleMaintenanceDeletedEvent(event)
        break

      default:
        logger.warn(`Unknown routing key: ${routingKey}`)
    }
  } catch (error) {
    logger.error(`Error routing event ${routingKey}:`, error)
    throw error
  }
}
