/**
 * @file Defines the Notification model.
 * @module models/NotificationModel
 */

import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ['maintenance.created', 'maintenance.updated', 'maintenance.deleted'],
    required: true
  },
  recipient: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: true
  },
  body: {
    type: String,
    default: null
  },
  // Från Maintenance Service event
  reportId: {
    type: String,
    required: true,
    index: true
  },
  apartmentId: {
    type: String,
    required: true,
    index: true
  },
  tenantId: {
    type: String,
    required: true,
    index: true
  },
  tenantName: {
    type: String,
    required: true
  },
  apartmentAddress: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: null
  },
  description: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending'
  },
  error: {
    type: String,
    default: null
  },
  sentAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

schema.index({ reportId: 1, createdAt: -1 })
schema.index({ tenantId: 1, createdAt: -1 })

export const NotificationModel = mongoose.model('Notification', schema)
