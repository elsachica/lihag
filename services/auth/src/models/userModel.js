/**
 * @file Defines the user model.
 * @module models/UserModel
 * @author Anna Ståhlberg
 * @version 3.2.0
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs' // använder bcryptjs för enklare installation

// Create a schema.
const schema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required.']
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ['admin', 'tenant', 'maintenance'], // tillåt endast tenant, maintenance eller admin
      default: 'tenant',         // standard är 'tenant'
      required: true
    },
    propertyId: {
      type: String,
      required: false,
      default: null
    }

  },
  {
    timestamps: true // skapar automatiskt createdAt och updatedAt
  }
)

// Hash password before saving
schema.pre('save', async function () {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10)
  }
})

/**
 * Authenticates a user.
 *
 * @param {string} email - The email.
 * @param {string} password - The password.
 * @returns {Promise<UserModel>} A promise that resolves with the user if authentication was successful.
 */
schema.statics.authenticate = async function (email, password) {
  const userDocument = await this.findOne({ email })

  if (!userDocument || !(await bcrypt.compare(password, userDocument.password))) {
    throw new Error('Invalid credentials.')
  }

  return userDocument
}

// Create the model
export const UserModel = mongoose.model('User', schema)