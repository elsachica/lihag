/**
 * @file  Provides helper methods for working with JSON Web Tokens (JWTs).
 * @module lib/JsonWebToken
 * @author Anna Ståhlberg
 * @version 1.0.0
 */

import jwt from 'jsonwebtoken'

/**
 * Encodes and decodes JWT tokens.
 */
export class JsonWebToken {
  /**
   * Encodes user information into a JWT.
   *
   * @param {object} user - User object with at least an `id` property.
   * @param {string} secret - Secret key to sign the token.
   * @param {string|number} expiresIn - Expiration time, e.g. '1h' or 3600.
   * @returns {Promise<string>} The generated JWT.
   */
  static async encodeUser(user, secret, expiresIn) {
    const payload = {
      sub: user._id || user.id,
      username: user.username,
      role: user.role || 'user'
    }

    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn }, (err, token) => {
        if (err) reject(err)
        else resolve(token)
      })
    })
  }

  /**
   * Decodes and verifies a JWT.
   *
   * @param {string} token - JWT token.
   * @param {string} secret - Secret key used for signing.
   * @returns {Promise<object>} The decoded payload.
   */
  static async decodeToken(token, secret) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) reject(err)
        else resolve(decoded)
      })
    })
  }
}

