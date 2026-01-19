// seedApartments.js
import mongoose from 'mongoose'
import { ApartmentModel } from '../src/models/ApartmentModel.js'
import { apartments } from './apartments.js' // ändra till rätt filväg
/**
 * Seeds the MongoDB database with apartment and locale data, including images.
 */
async function seed () {
  try {
    await mongoose.connect(
      process.env.DB_CONNECTION_STRING_PROPERTY || 'mongodb://localhost:27017/propertyDB'
    )
    console.log('Connected to DB!')

    // Rensa gamla dokument
    await ApartmentModel.deleteMany({})
    console.log('Cleared old data.')

    // Mappa listan till modellen
    const docs = apartments.map(a => ({
      number: `A${a.id}`,
      type: a.type === 'lägenhet' ? 'apartment' : 'locale',
      city: a.city,
      address: a.address,
      area: a.area,
      rooms: a.rooms,
      price: a.price,
      size: a.size,
      floor: a.floor,
      description: a.description,
      built: a.built,
      objnr: a.objnr,
      features: a.features,
      image: a.image,
      available: a.available,
      deadline: a.deadline,
      propertyId: `P${a.id}`,
      isAvailable: true
    }))

    const result = await ApartmentModel.insertMany(docs)
    console.log(`Seeded ${result.length} apartments/locales with images!`)
  } catch (err) {
    console.error('Error seeding DB:', err)
  } finally {
    mongoose.connection.close()
  }
}

seed()
