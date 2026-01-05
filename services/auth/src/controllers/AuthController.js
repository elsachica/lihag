import { UserModel } from '../models/userModel.js'
import { JsonWebToken } from '../lib/JsonWebToken.js'
import fs from 'fs'
import path from 'path'

// Läs private key från fil (lokalt under utveckling)
const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_PEM

// Expiration time från .env
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'

export class AuthController {
  /**
   * Registers a new user and returns a JWT.
   */
  async register(req, res) {
    try {
      const { password, email, role, propertyId } = req.body

      // Skapa ny användare
      const user = new UserModel({
        password,
        email,
        role: role || 'tenant',
        propertyId
      })
      await user.save()

      // Skapa JWT med RS256
      const token = await JsonWebToken.encodeUser(user, JWT_PRIVATE_KEY, JWT_EXPIRES_IN)

      res.status(201).json({ token })
    } catch (err) {
      console.error(err)
      res.status(400).json({ message: err.message })
    }
  }

  /**
   * Logs in an existing user and returns a JWT.
   */
  async login(req, res) {
    try {
      const { email, password } = req.body

      // Autentisera användare
      const user = await UserModel.authenticate(email, password)

      // Skapa JWT med RS256
      const token = await JsonWebToken.encodeUser(user, JWT_PRIVATE_KEY, JWT_EXPIRES_IN)

      res.status(200).json({
        token,
        apartmentId: user.propertyId,
        role: user.role
      })
    } catch (err) {
      console.error(err)
      res.status(401).json({ message: err.message })
    }
  }

  async test(req, res) {
    res.status(200).json({ status: 'ok' })
  }
}
