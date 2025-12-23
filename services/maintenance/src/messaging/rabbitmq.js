import amqp from 'amqplib'

let connection = null
let channel = null
const EXCHANGE_NAME = process.env.RABBITMQ_EXCHANGE || 'maintenance-exchange'

/**
 * Establishes a connection to RabbitMQ and creates a channel.
 * The function asserts a topic exchange used for maintenance-report events.
 *
 * A singleton pattern is used so that only one channel is created and reused
 * throughout the application lifecycle.
 *
 * @async
 * @function connectRabbitMQ
 * @returns {Promise<amqp.Channel>} A RabbitMQ channel instance.
 * @throws {Error} If the connection or channel creation fails.
 */
export async function connectRabbitMQ () {
  if (channel) return channel

  try {
    const RABBITMQ_URL = process.env.RABBITMQ_URL
    connection = await amqp.connect(RABBITMQ_URL)
    channel = await connection.createChannel()
    await channel.assertExchange(EXCHANGE_NAME, 'topic', { durable: true })
    console.log('Connected to RabbitMQ and exchange is ready')

    // Handle connection-level events
    connection.on('error', (err) =>
      console.error('RabbitMQ connection error', err)
    )
    connection.on('close', () => console.log('RabbitMQ connection closed'))

    return channel
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error)
    throw error
  }
}

/**
 * Publishes a domain event to the maintenance exchange using a routing key.
 * The message payload is JSON-encoded and marked as persistent to ensure
 * durability in RabbitMQ.
 *
 * @async
 * @function publishEvent
 * @param {string} routingKey - The routing key (e.g. 'maintenance.created').
 * @param {object} message - The event payload to publish.
 * @returns {Promise<void>}
 */
export async function publishEvent (routingKey, message) {
  try {
    const ch = await connectRabbitMQ()
    const msgBuffer = Buffer.from(JSON.stringify(message))
    ch.publish(EXCHANGE_NAME, routingKey, msgBuffer, {
      persistent: true,
      contentType: 'application/json'
    })
    console.log(`Event published: ${routingKey}`, message)
  } catch (error) {
    console.error('Failed to publish event:', error)
  }
}
