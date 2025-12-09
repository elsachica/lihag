import { UserModel } from '../models/userModel.js'
import { JsonWebToken } from '../lib/JsonWebToken.js'
import fs from 'fs'
import path from 'path'

// Läs private key från fil (lokalt under utveckling)
const privateKeyPath = path.resolve('./private.pem')
const JWT_PRIVATE_KEY = fs.readFileSync(privateKeyPath, 'utf8')

// Expiration time från .env
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'

export class AuthController {
  /**
   * Registers a new user and returns a JWT.
   */
  async register(req, res) {
    try {
      const { firstName, lastName, username, email, password, role } = req.body

      // Skapa ny användare
      const user = new UserModel({
        firstName,
        lastName,
        username,
        email,
        password,
        role: role || 'user'
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
      const { username, password } = req.body

      // Autentisera användare
      const user = await UserModel.authenticate(username, password)

      // Skapa JWT med RS256
      const token = await JsonWebToken.encodeUser(user, JWT_PRIVATE_KEY, JWT_EXPIRES_IN)

      res.status(200).json({ token })
    } catch (err) {
      console.error(err)
      res.status(401).json({ message: err.message })
    }
  }

 async test(req, res) {
    // req.user är satt av authenticateJWT
    res.status(200).json({
      message: `Hej ${req.user.username}, du har access till den här route!`,
      user: req.user
    })
  }
}
