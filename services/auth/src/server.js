/**
 * @file Defines the main application.
 * @module src/server
 * @author Anna Ståhlberg
 * @version 3.1.0
 */

import dotenv from 'dotenv'
dotenv.config()

import { connectToDatabase } from './config/mongoose.js'
import { createApp } from './app.js'

try {
  await connectToDatabase(process.env.DB_CONNECTION_STRING)

  const app = createApp()
  const port = process.env.PORT || 3000

  const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.log(err.message, { error: err })
  process.exitCode = 1
}
