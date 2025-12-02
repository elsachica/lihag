/**
 * @file Defines the Contract model.
 * @module models/ContractModel
 * @version 1.0.0
 */

import mongoose from 'mongoose'
import { BASE_SCHEMA } from './baseSchema.js'

// Create a schema.
const schema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Apartment',
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
})

schema.add(BASE_SCHEMA)

// Create a model using the schema.
export const ContractModel = mongoose.model('Contract', schema)