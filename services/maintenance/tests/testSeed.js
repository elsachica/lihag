import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { ReportModel } from '../src/models/report.js'

dotenv.config()

/**
 * Seed the database with initial test data for maintenance reports.
 */
async function seed () {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING)
    console.log('Connected to MongoDB Atlas!')

    // Clear the collection first
    await ReportModel.deleteMany({})

    // Add some test data
    const reports = [
      {
        description: 'Faucet leaking in kitchen',
        category: 'Vatten & avlopp',
        apartmentId: new mongoose.Types.ObjectId(),
        status: 'Ny',
        priority: 'Medium',
        assignedTo: null,
        images: []
      },
      {
        description: 'My apartment is too cold',
        category: 'Värme & ventilation',
        apartmentId: new mongoose.Types.ObjectId(),
        status: 'Behandlas',
        priority: 'Låg',
        assignedTo: null,
        images: ['https://example.com/heater.jpg']
      },
      {
        description: 'Broken fridge',
        category: 'Vitvaror',
        apartmentId: new mongoose.Types.ObjectId(),
        status: 'Stängd',
        priority: 'Hög',
        assignedTo: null,
        images: ['https://example.com/fridge.jpg']
      }
    ]

    await ReportModel.insertMany(reports)
    console.log('Seed data inserted successfully!')

    process.exit(0)
  } catch (err) {
    console.error('Error seeding data:', err)
    process.exit(1)
  }
}

seed()
