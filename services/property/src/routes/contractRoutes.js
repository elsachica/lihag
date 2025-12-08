/**
 * @file Defines the contract router.
 * @module routes/contractRoutes
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import express from 'express'
import { ContractController } from '../controllers/ContractController.js'

export const router = express.Router()
const controller = new ContractController()

router.param('id', (req, res, next, id) =>
  controller.loadContractDocument(req, res, next, id)
)

// CRUD endpoints
router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/:id', (req, res, next) => controller.show(req, res, next))
router.post('/', (req, res, next) => controller.create(req, res, next))
router.put('/:id', (req, res, next) => controller.update(req, res, next))
router.delete('/:id', (req, res, next) => controller.delete(req, res, next))
