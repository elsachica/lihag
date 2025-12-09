import express from 'express'
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.js'
import { TenantController } from '../controllers/TenantController.js'

export const router = express.Router()
const controller = new TenantController()

router.get('/', authenticateJWT, (req, res, next) => controller.index(req, res, next))
router.get('/:id', authenticateJWT, (req, res, next) => controller.show(req, res, next))
router.post('/', authenticateJWT, authorizeRoles('admin'), (req, res, next) => controller.create(req, res, next))
router.put('/:id', authenticateJWT, authorizeRoles('admin'), (req, res, next) => controller.update(req, res, next))
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), (req, res, next) => controller.delete(req, res, next))