/**
 * @file Defines the main application.
 * @module src/index
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import 'dotenv/config'
import express from 'express'
import { connectToDatabase } from './config/mongoose.js'
import './config/rabbitmq.js'
import { router } from './routes/router.js'
import { morganLogger } from './config/morgan.js'
import { logger } from './config/winston.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
app.use(express.json())
app.use(morganLogger)

const port = process.env.PORT || 8888

/**
 * Starts the Property service by connecting to the MongoDB database,
 * setting up middleware, and starting the HTTP server.
 *
 * @async
 * @function
 * @throws {Error} If the DB_CONNECTION_STRING environment variable is not defined or if the server fails to start.
 */
async function start () {
  try {
    if (!process.env.DB_CONNECTION_STRING) {
      throw new Error(
        'DB_CONNECTION_STRING environment variable is not defined'
      )
    }
    await connectToDatabase(process.env.DB_CONNECTION_STRING)
    logger.info('MongoDB connected')

    app.use('/', router)

    // Global error handler - MUST be last middleware
    app.use(errorHandler)

    app.listen(port, () => {
      logger.info(`Property service running on port ${port}`)
    })
  } catch (err) {
    logger.error('Failed to start server:', { error: err })
    process.exit(1)
  }
}

start()
