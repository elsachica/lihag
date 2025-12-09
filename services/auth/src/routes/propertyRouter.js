import express from 'express'
import { authenticateJWT } from '../middlewares/auth.js'
import { PropertyController } from '../controllers/PropertyController.js'

export const router = express.Router()
const controller = new PropertyController()