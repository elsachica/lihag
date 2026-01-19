import express from 'express'
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.js'
import { UserController } from '../controllers/UserController.js'

export const router = express.Router()
const controller = new UserController()

router.use(authenticateJWT)
router.use(authorizeRoles('admin'))

// Get all users
router.get('/', (req, res, next) => controller.getAllUsers(req, res, next))

// Get one user
router.get('/:id', (req, res, next) => controller.getUser(req, res, next))

// Update user
router.put('/:id', (req, res, next) => controller.updateUser(req, res, next))

// Delete user
router.delete('/:id', (req, res, next) => controller.deleteUser(req, res, next))
