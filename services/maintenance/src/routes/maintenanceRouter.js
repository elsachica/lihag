/**
 * @file Defines the main router for the maintenance microservice.
 * @module routes/maintenanceRouter
 * @author Liv Åberg
 */

import express from 'express'
import { MaintenanceController } from '../controllers/maintenanceController.js'
import { MaintenanceService } from '../services/maintenanceService.js'
import { MaintenanceRepository } from '../repositories/MaintenanceRepository.js'

export const router = express.Router()

const maintenanceRepository = new MaintenanceRepository()
const maintenanceService = new MaintenanceService(maintenanceRepository)
const maintenanceController = new MaintenanceController(maintenanceService)

router.param('id', async (req, res, next, id) => {
  try {
    const report = await maintenanceRepository.getReportById(id)
    if (!report) {
      const error = new Error('The report you requested does not exist.')
      error.status = 404
      throw error
    }
    req.doc = report
    next()
  } catch (error) {
    next(error)
  }
})

// Admin only
router.get('/', (req, res) => maintenanceController.getAllReports(req, res))

router.get('/:id', (req, res) => maintenanceController.getReport(req, res))

router.post('/', (req, res) => maintenanceController.createReport(req, res))

router.patch('/:id', (req, res) =>
  maintenanceController.updateReport(req, res)
)

// Admin only
router.delete('/:id', (req, res) =>
  maintenanceController.deleteReport(req, res)
)

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  res.status(404).json({ error: 'Not Found' })
})
