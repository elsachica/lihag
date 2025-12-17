import nodemailer from 'nodemailer'
import { logger } from './winston.js'

let transporter = null

/**
 * Initializes the email transporter.
 * Supports both Gmail (production) and Mailhog (development)
 * 
 * @returns {Promise<void>}
 */
export async function initializeEmailService () {
  try {
    // Development mode with Mailhog
    if (process.env.NODE_ENV === 'development' && !process.env.SMTP_USER) {
      logger.warn('⚠️ Email service not configured - using Mailhog for testing')
      transporter = nodemailer.createTransport({
        host: 'mailhog',      // Docker service name
        port: 1025,
        auth: false
      })
      logger.info('✅ Using Mailhog for development email testing')
      return
    }

    // Production mode with Gmail (or other SMTP)
    // Requires Google App Password: https://support.google.com/accounts/answer/185833
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_PORT === '465', // true for 465, false for 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })

    // Verify connection with Gmail
    await transporter.verify()
    logger.info('✅ Email service initialized successfully with Gmail')
  } catch (error) {
    logger.error('❌ Failed to initialize email service:', error)
    
    if (process.env.NODE_ENV === 'production') {
      logger.error('⚠️ Production mode requires valid SMTP configuration!')
      throw error
    }
    
    logger.warn('⚠️ Falling back to Mailhog for testing')
  }
}

/**
 * Sends an email via Gmail or Mailhog.
 *
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML format)
 * @returns {Promise<Object>} - Email send result with messageId
 * @throws {Error} If email service is not initialized or sending fails
 */
export async function sendEmail (to, subject, html) {
  try {
    if (!transporter) {
      throw new Error('Email service not initialized')
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@lihag.se',
      to,
      subject,
      html
    }

    const info = await transporter.sendMail(mailOptions)
    
    logger.info(`📧 Email sent successfully`, { 
      messageId: info.messageId,
      to,
      subject,
      provider: process.env.SMTP_USER ? 'Gmail' : 'Mailhog'
    })
    
    return info
  } catch (error) {
    logger.error('❌ Failed to send email:', error)
    throw error
  }
}

export default {
  sendEmail,
  initializeEmailService
}