import express from 'express'
import { authenticateJWT, authorizeRoles } from '../middlewares/auth.js'
import { MaintenanceController } from '../controllers/MaintenanceController.js'

export const router = express.Router()
const controller = new MaintenanceController()

router.use(authenticateJWT)

// Hämta alla rapporter
router.get('/', authorizeRoles, (req, res, next) => controller.getAllReports(req, res, next))

// Hämta en rapport med id
router.get('/:id', (req, res, next) => controller.getReport(req, res, next))

// Skapa ny rapport
router.post('/', (req, res, next) => controller.createReport(req, res, next))

// Uppdatera rapport
router.patch('/:id', (req, res, next) => controller.updateReport(req, res, next))

// Endast admin får radera
router.delete('/:id', authorizeRoles('admin'), (req, res, next) => controller.deleteReport(req, res, next))












