/**
 * @file Authentication middleware for validating JWT tokens.
 * @module middlewares/auth
 * @author Anna Ståhlberg
 * @version 1.1.0
 */

import fs from 'fs'
import http from 'node:http'
import { JsonWebToken } from '../lib/JsonWebToken.js'

// Läs public key från fil
const jwtPublicKey = fs.readFileSync('./public.pem', 'utf8')

export const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) throw new Error('Authorization header missing.')

    const [scheme, token] = authHeader.split(' ')
    if (scheme !== 'Bearer' || !token) throw new Error('Invalid authentication format.')

    // Dekoda och verifiera token
    const user = await JsonWebToken.decodeUser(token, jwtPublicKey)

    // Lägg decoded user på req.user
    req.user = user

    next()
  } catch (error) {
    const err = new Error(http.STATUS_CODES[401])
    err.status = 401
    err.cause = error
    next(err)
  }
}

// Rollkontroll
export const authorizeRoles = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient role' })
    }

    next()
  }
}
