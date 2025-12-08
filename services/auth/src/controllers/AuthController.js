import { UserModel } from '../models/UserModel.js'
import { JsonWebToken } from '../lib/JsonWebTokens.js'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'
const JWT_EXPIRES_IN = '1h' // 1 timme

export class AuthController {
  /**
   * Registers a new user and returns a JWT.
   */
  async register(req, res) {
    try {
      const { firstName, lastName, username, email, password } = req.body

      // Skapa ny användare
      const user = new UserModel({ firstName, lastName, username, email, password })
      await user.save()

      // Skapa JWT
      const token = await JsonWebToken.encodeUser(user, JWT_SECRET, JWT_EXPIRES_IN)

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

      // Skapa JWT
      const token = await JsonWebToken.encodeUser(user, JWT_SECRET, JWT_EXPIRES_IN)

      res.status(200).json({ token })
    } catch (err) {
      console.error(err)
      res.status(401).json({ message: err.message })
    }
  }
}
