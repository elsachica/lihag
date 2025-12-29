/**
 * @file Configures RabbitMQ connection and message consumption.
 * @module config/rabbitmq
 */

import amqp from 'amqplib'
import { logger } from './winston.js'
import { routeEvent } from '../handlers/EventHandler.js'

let connection = null
let channel = null

/**
 * Connects to RabbitMQ and sets up consumer.
 */
export async function connect () {
  try {
    connection = await amqp.connect(
      process.env.RABBITMQ_URL || 'amqp://admin:password@rabbitmq:5672'
    )

    channel = await connection.createChannel()

    // ✅ SAMMA exchange-namn som Maintenance Service!
    const exchangeName = process.env.RABBITMQ_EXCHANGE || 'maintenance-exchange'
    await channel.assertExchange(exchangeName, 'topic', { durable: true })

    // Assert queue
    const queue = await channel.assertQueue('notification.events', {
      durable: true,
      arguments: {
        'x-message-ttl': 3600000 // 1 hour message TTL
      }
    })

    // ✅ Bind queue till SAMMA exchange!
    await channel.bindQueue(queue.queue, exchangeName, 'maintenance.*')

    logger.info(
      '✅ RabbitMQ consumer connected and listening on notification.events'
    )

    // Start consuming messages
    channel.consume(queue.queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString())
          const routingKey = msg.fields.routingKey

          logger.info(`📨 Event received: ${routingKey}`, {
            reportId: content.reportId
          })

          await routeEvent(routingKey, content)

          // Acknowledge message
          channel.ack(msg)
        } catch (error) {
          logger.error('❌ Error processing message:', error)
          // Negative acknowledge - requeue message
          channel.nack(msg, false, true)
        }
      }
    })

    connection.on('error', (err) => {
      logger.error('⚠️ RabbitMQ connection error:', err)
      setTimeout(() => connect(), 5000)
    })

    connection.on('close', () => {
      logger.warn('⚠️ RabbitMQ connection closed, attempting reconnect...')
      setTimeout(() => connect(), 5000)
    })
  } catch (error) {
    logger.error('❌ Failed to connect to RabbitMQ:', error)
    setTimeout(() => connect(), 5000)
  }
}

/**
 * Closes the RabbitMQ connection.
 */
export async function close () {
  try {
    if (channel) {
      await channel.close()
    }
    if (connection) {
      await connection.close()
    }
    logger.info('✅ RabbitMQ connection closed gracefully')
  } catch (error) {
    logger.error('Error closing RabbitMQ connection:', error)
  }
}

export default {
  connect,
  close
}
