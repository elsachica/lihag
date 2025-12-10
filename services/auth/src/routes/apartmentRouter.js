import express from 'express'
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.js'
import { ApartmentController } from '../controllers/ApartmentController.js'

export const router = express.Router()
const controller = new ApartmentController()

router.get('/apartments/statistics', authenticateJWT, authorizeRoles('admin'), (req, res, next) => controller.statistics(req, res, next))

router.get('/apartments', (req, res, next) => controller.index(req, res, next))

router.get('/apartments/:id', authenticateJWT, (req, res, next) => controller.show(req, res, next))

router.post('/apartments', authenticateJWT, authorizeRoles('admin'), (req, res, next) => controller.create(req, res, next))

router.put('/apartments/:id', authenticateJWT, authorizeRoles('admin'), (req, res, next) => controller.update(req, res, next))

router.delete('/apartments/:id', authenticateJWT, authorizeRoles('admin'),(req, res, next) => controller.delete(req, res, next))