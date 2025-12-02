/**
 * @file Defines the Apartment model.
 * @module models/ApartmentModel
 * @version 1.0.0
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
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
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

// Du kan lägga till fler fält om du behöver, t.ex. status, våning, etc.
