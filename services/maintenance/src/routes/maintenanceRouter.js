/**
 * @file Defines the main router for the maintenance microservice.
 * @module routes/maintenanceRouter
 * @author Liv Åberg
 */

import express from 'express'
import { MaintenanceController } from '../controllers/MaintenanceController.js'
import { MaintenanceService } from '../services/maintenanceService.js'
import { MaintenanceRepository } from '../repositories/maintenanceRepository.js'

export const router = express.Router()

const maintenanceRepository = new MaintenanceRepository()
const maintenanceService = new MaintenanceService(maintenanceRepository)
const maintenanceController = new MaintenanceController(maintenanceService)

// Admin only
router.get('/maintenance', (req, res) =>
  maintenanceController.getAllMaintenanceReports(req, res)
)
