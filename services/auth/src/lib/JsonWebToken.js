/**
 * @file  Provides helper methods for working with JSON Web Tokens (JWTs).
 * @module lib/JsonWebToken
 * @author Anna Ståhlberg
 * @version 1.1.0
 */

import jwt from 'jsonwebtoken'

export class JsonWebToken {
  /**
   * Encodes user information into a JWT using RS256.
   *
   * @param {object} user - User object with at least `_id`, `username` and `role`.
   * @param {string} privateKey - Private key in PEM format.
   * @param {string|number} expiresIn - Expiration time, e.g. '1h' or 3600.
   * @returns {Promise<string>} The generated JWT.
   */
  static async encodeUser(user, privateKey, expiresIn) {
    const payload = {
      sub: user._id || user.id,
      username: user.username,
      role: user.role || 'user'
    }

    return new Promise((resolve, reject) => {
      jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn }, (err, token) => {
        if (err) reject(err)
        else resolve(token)
      })
    })
  }

  /**
   * Decodes and verifies a JWT using RS256.
   *
   * @param {string} token - JWT token.
   * @param {string} publicKey - Public key in PEM format.
   * @returns {Promise<object>} The decoded payload.
   */
  static async decodeUser(token, publicKey) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
        if (err) reject(err)
        else resolve(decoded)
      })
    })
  }
}


