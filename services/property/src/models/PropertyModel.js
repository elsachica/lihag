/**
 * @file Defines the Property model.
 * @module models/PropertyModel
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  address: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  apartments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment'
  }]
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const