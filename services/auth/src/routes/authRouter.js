import express from 'express'
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.js'
import { AuthController } from '../controllers/AuthController.js'

export const router = express.Router()
const controller = new AuthController()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this auth-service API!' }))

// Skapa ny användare
router.post('/register', (req, res, next) => controller.register(req, res, next))

// Logga in existerande användare
router.post('/login', (req, res, next) => controller.login(req, res, next))

router.get('/test', authenticateJWT, (req, res, next) => controller.test(req, res, next))