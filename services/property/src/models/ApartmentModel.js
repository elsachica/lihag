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
    required: true // t.ex. "Söder om järnvägen", "Nybro", "Kalmar"
  },
  type: {
    type: String,
    enum: ['apartment', 'locale'],
    default: 'apartment'
  },
  tenants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant'
  }],
  contracts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  }]
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const ApartmentModel = mongoose.model('Apartment', schema)