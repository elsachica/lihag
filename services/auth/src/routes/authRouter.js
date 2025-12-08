/**
 * @file Defines the home router.
 * @module homeRouter
 * @author Anna Ståhlberg
 */

import express from 'express'
import { AutController } from '../controllers/AuthController.js'

export const router = express.Router()

const controller = new AuthController()

router.get('/', (req, res, next) => controller.index(req, res, next))