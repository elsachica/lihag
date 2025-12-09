/**
 * @file Defines the user model.
 * @module models/UserModel
 * @author Anna Ståhlberg
 * @version 3.2.0
 */

import mongoose from 'mongoose'
import bcrypt from 'bcryptjs' // använder bcryptjs för enklare installation
import validator from 'validator'

const { isEmail } = validator

// Create a schema.
const schema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required.'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required.'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required.'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [isEmail, 'Please provide a valid email address.']
    },
    username: {
      type: String,
      required: [true, 'Username is required.'],
      unique: true,
      match: [/^[A-Za-z][A-Za-z0-9_-]{2,255}$/, 'Please provide a valid username.']
    },
    password: {
      type: String,
      required: [true, 'Password is required.'],
      minLength: [10, 'The password must be of minimum length 10 characters.'],
      maxLength: [256, 'The password must be of maximum length 256 characters.']
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // tillåt endast user eller admin
      default: 'user',         // standard är 'user'
      required: true
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
 * @param {string} username - The username.
 * @param {string} password - The password.
 * @returns {Promise<UserModel>} A promise that resolves with the user if authentication was successful.
 */
schema.statics.authenticate = async function (username, password) {
  const userDocument = await this.findOne({ username })

  if (!userDocument || !(await bcrypt.compare(password, userDocument.password))) {
    throw new Error('Invalid credentials.')
  }

  return userDocument
}

// Create the model
export const UserModel = mongoose.model('User', schema)