/**
 * @file Defines the apartment router.
 * @module routes/apartmentRoutes
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import express from 'express'
import { ApartmentController } from '../controllers/ApartmentController.js'

export const router = express.Router()
const controller = new ApartmentController()

router.param('id', (req, res, next, id) =>
  controller.loadApartmentDocument(req, res, next, id)
)

// Statistik
router.get('/statistics', (req, res, next) =>
  controller.statistics(req, res, next)
)

// Filtrering
router.get('/', (req, res, next) => controller.index(req, res, next))

// CRUD
router.get('/:id', (req, res, next) => controller.show(req, res, next))
router.post('/', (req, res, next) => controller.create(req, res, next))
router.put('/:id', (req, res, next) => controller.update(req, res, next))
router.delete('/:id', (req, res, next) => controller.delete(req, res, next))
