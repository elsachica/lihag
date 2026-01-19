/**
 * @file Defines the Apartment model.
 * @module models/ApartmentModel
 * @version 1.1.0
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  number: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: Number,
    required: true
  },
  propertyId: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true // t.ex. "Söder om järnvägen", "Nybro", "Kalmar", "Lindö"
  },
  type: {
    type: String,
    enum: ['apartment', 'locale'],
    default: 'apartment'
  },
  price: {
    type: Number,
    required: true // Månadshyra
  },
  isAvailable: {
    type: Boolean,
    default: true // true = ledig, false = uthyrd
  },
  description: {
    type: String,
    default: null
  },
  floor: {
    type: Number,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  city: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  rooms: {
    type: Number,
    required: true
  },
  built: {
    type: Number,
    default: null
  },
  features: {
    type: [String],
    default: []
  },
  available: {
    type: Date,
    default: null
  },
  deadline: {
    type: Date,
    default: null
  },
  objnr: {
    type: String,
    required: true,
    trim: true
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const ApartmentModel = mongoose.model('Apartment', schema)
