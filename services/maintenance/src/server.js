/**
 * The starting point of the maintenance microservice.
 *
 * @author Liv Åberg
 * @version 1.0.0
 */

import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import { connectToDatabase } from '../config/db.js'
import { router } from './routes/maintenanceRouter.js'

dotenv.config()

// Connect to MongoDB.
await connectToDatabase(process.env.DB_CONNECTION_STRING_MAINTENANCE || 'mongodb://localhost:27017/lihag-maintenance')

// Create an Express application.
const app = express()

// Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"]
      }
    }
  })
)

// Middleware för att tolka JSON-body
app.use(express.json())

// Setup and use session middleware (https://github.com/expressjs/session)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}

app.get('/', (req, res) => {
  res.send('Maintenance service is running')
})

app.use('/maintenance', router)

// Error handler.
app.use((err, req, res, next) => {
  console.error(err.message, { error: err })

  // 404 Not Found.
  if (err.status === 404) {
    return res.status(404).json({ error: err.message })
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (process.env.NODE_ENV === 'production') {
    return res
      .status(err.status || 500)
      .json({ error: 'Internal Server Error' })
  }

  // ---------------------------------------------------
  // ⚠️ WARNING: Development Environment Only!
  //             Detailed error information is provided.
  // ---------------------------------------------------

  // Development - detailed error response.
  res.status(err.status || 500).json({ error: err.message, stack: err.stack })
})

// Starts the HTTP server listening for connections.
const server = app.listen(process.env.PORT || 8002, () => {
  console.log(
    `Server running at http://localhost:${server.address().port}/maintenance`
  )
  console.log('Press Ctrl-C to terminate...')
})
