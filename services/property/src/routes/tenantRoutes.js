import express from 'express'
import { TenantController } from '../controllers/TenantController.js'

export const router = express.Router()
const controller = new TenantController()

router.param('id', (req, res, next, id) =>
  controller.loadTenantDocument(req, res, next, id)
)

// CRUD endpoints
router.get('/', (req, res, next) => controller.index(req, res, next))
router.get('/:id', (req, res, next) => controller.show(req, res, next))
router.post('/', (req, res, next) => controller.create(req, res, next))
router.put('/:id', (req, res, next) => controller.update(req, res, next))
router.delete('/:id', (req, res, next) => controller.delete(req, res, next))