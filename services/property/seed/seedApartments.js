import mongoose from 'mongoose'
import { ApartmentModel } from '../src/models/ApartmentModel.js'

const AREAS = ['Söder om järnvägen', 'Nybro', 'Kalmar', 'Lindö']

/**
 * Returns a random integer between min and max, inclusive.
 *
 * @param {number} min - The minimum integer value.
 * @param {number} max - The maximum integer value.
 * @returns {number} A random integer between min and max.
 */
function randomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Returns a random element from the given array.
 *
 * @param {Array} arr - The array to pick a random element from.
 * @returns {*} A random element from the array.
 */
function randomFromArray (arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Seeds the database with sample apartments and locales.
 */
async function seed () {
  await mongoose.connect(
    process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27020/propertyDB'
  )
  await ApartmentModel.deleteMany({})

  const apartments = []
  for (let i = 1; i <= 15; i++) {
    const type = i <= 12 ? 'apartment' : 'locale'
    apartments.push({
      number: `A${i}`,
      size: randomInt(30, 120),
      propertyId: `P${randomInt(1, 4)}`,
      area: randomFromArray(AREAS),
      type,
      price: randomInt(4000, 12000),
      isAvailable: true,
      description: `A nice ${type} in ${randomFromArray(AREAS)}`,
      floor: type === 'apartment' ? randomInt(1, 5) : null,
      roomCount: type === 'apartment' ? randomInt(1, 4) : null
    })
  }

  await ApartmentModel.insertMany(apartments)
  console.log('Seeded 15 apartments/locales!')
  process.exit(0)
}

seed()
