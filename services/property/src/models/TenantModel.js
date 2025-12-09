/**
 * @file Defines the Tenant model.
 * @module models/TenantModel
 * @version 1.0.0
 */

import mongoose from "mongoose";
import { BASE_SCHEMA } from "./baseSchema.js";

// Create a schema.
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  contactInfo: {
    type: String,
    required: true,
    trim: true,
  },
  apartment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Apartment",
    required: true,
  },
  rent: {
    type: Number,
    required: true,
    min: 0,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: null,
  },
});

schema.add(BASE_SCHEMA);

// Create a model using the schema.
export const TenantModel = mongoose.model("Tenant", schema);

// Du kan lägga till fler fält om du behöver, t.ex. personnummer, adress, etc.
