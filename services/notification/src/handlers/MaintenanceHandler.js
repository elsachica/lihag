/**
 * @file Handles maintenance-related events from Maintenance Service.
 * @module handlers/MaintenanceHandler
 * @version 1.0.0
 */

import axios from 'axios'
import { logger } from '../config/winston.js'
import { sendEmail } from '../config/nodemailer.js'
import { NotificationModel } from '../models/NotificationModel.js'
import { getMaintenanceCreatedTemplate } from '../templates/EmailTemplates.js'

/**
 * Helper: Hämta lägenhet-detaljer från Property Service
 *
 * @param {string} apartmentId - Apartment ID from Property Service
 * @returns {Promise<object>} Apartment details or default values
 */
async function getApartmentDetails (apartmentId) {
  try {
    const response = await axios.get(
      `http://property-service:8001/apartments/${apartmentId}`,
      { timeout: 5000 }
    )
    return response.data.data
  } catch (error) {
    logger.warn(`Failed to fetch apartment ${apartmentId}:`, error.message)
    return {
      number: 'Unknown',
      tenantId: 'Unknown',
      tenantName: 'Unknown'
    }
  }
}

/**
 * Handles maintenance.created event
 * Sends email to admin about new maintenance request
 *
 * @param {object} event - Event from RabbitMQ
 * @returns {Promise<void>}
 */
export async function handleMaintenanceCreatedEvent (event) {
  try {
    const { reportId, apartmentId, category, description, status } = event

    // 1. Hämta lägenhet-detaljer från Property Service
    const apartmentDetails = await getApartmentDetails(apartmentId)

    const adminEmail = process.env.ADMIN_EMAIL

    // 2. Skapa email med all data
    const { subject, html } = getMaintenanceCreatedTemplate({
      reportId,
      apartmentAddress: apartmentDetails.number,
      tenantName: apartmentDetails.tenantName,
      tenantId: apartmentDetails.tenantId,
      category,
      description,
      status
    })

    // 3. Spara notification
    const notification = await NotificationModel.create({
      eventType: 'maintenance.created',
      recipient: adminEmail,
      subject,
      body: html,
      reportId,
      apartmentId,
      tenantId: apartmentDetails.tenantId,
      tenantName: apartmentDetails.tenantName,
      apartmentAddress: apartmentDetails.number,
      category,
      description,
      status: 'pending'
    })

    logger.info('📧 Notification created', {
      notificationId: notification._id
    })

    // 4. Skicka email
    try {
      await sendEmail(adminEmail, subject, html)

      notification.status = 'sent'
      notification.sentAt = new Date()
      await notification.save()

      logger.info('✅ Email sent', { notificationId: notification._id })
    } catch (emailError) {
      notification.status = 'failed'
      notification.error = emailError.message
      await notification.save()

      logger.error('❌ Email failed', { error: emailError.message })
    }
  } catch (error) {
    logger.error('❌ Error handling maintenance.created:', error)
    throw error
  }
}

/**
 * Handles maintenance.updated event
 * TODO: Implement when ready
 *
 * @param {object} event - Event from RabbitMQ
 * @returns {Promise<void>}
 */
export async function handleMaintenanceUpdatedEvent (event) {
  try {
    logger.info('📨 Handling maintenance.updated event', {
      reportId: event.reportId
    })
    // TODO: Implementera senare
  } catch (error) {
    logger.error('❌ Error handling maintenance.updated:', error)
    throw error
  }
}

/**
 * Handles maintenance.deleted event
 * TODO: Implement when ready
 *
 * @param {object} event - Event from RabbitMQ
 * @returns {Promise<void>}
 */
export async function handleMaintenanceDeletedEvent (event) {
  try {
    logger.info('📨 Handling maintenance.deleted event', {
      reportId: event.reportId
    })
    // TODO: Implementera senare
  } catch (error) {
    logger.error('❌ Error handling maintenance.deleted:', error)
    throw error
  }
}
