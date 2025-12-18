import mongoose from 'mongoose'

/**
 * Establishes a connection to a database.
 *
 * @param {string} connectionString - The connection string.
 * @returns {Promise<mongoose.Mongoose>} Resolves to a Mongoose instance if connection succeeded.
 */
export const connectToDatabase = async (connectionString) => {
  const { connection } = mongoose

  // Will cause errors to be produced instead of dropping the bad data.
  mongoose.set('strict', 'throw')

  // Turn on strict mode for query filters.
  mongoose.set('strictQuery', true)

  // Bind connection to events (basic console logging)
  connection.on('connected', () =>
    console.log('Mongoose connected to MongoDB.')
  )
  connection.on('error', (err) =>
    console.error(`Mongoose connection error: ${err}`)
  )
  connection.on('disconnected', () =>
    console.log('Mongoose disconnected from MongoDB.')
  )

  // Close connection gracefully on app exit
  for (const signalEvent of ['SIGINT', 'SIGTERM']) {
    process.on(signalEvent, async () => {
      try {
        await connection.close()
        console.log(
          `Mongoose disconnected from MongoDB through ${signalEvent}.`
        )
      } catch (err) {
        console.error(`Error closing connection: ${err}`)
      } finally {
        process.exit(0)
      }
    })
  }

  // Connect to MongoDB
  console.log('Mongoose connecting to MongoDB...')
  return mongoose.connect(connectionString)
}
