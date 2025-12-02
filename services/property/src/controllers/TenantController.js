/**
 * @file Defines the TenantController class.
 * @module controllers/TenantController
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import { logger } from '../config/winston.js'
import { TenantModel } from '../models/TenantModel.js'
import { publishEvent } from '../config/rabbitmq.js'

/**
 * Encapsulates a controller for Tenant.
 */
export class TenantController {
  /**
   * Loads a tenant document by ID and attaches it to req.doc.
   */
  async loadTenantDocument(req, res, next, id) {
    try {
      logger.silly('Loading tenant document', { id })
      const tenantDoc = await TenantModel.findById(id)
      if (!tenantDoc) {
        const error = new Error('The tenant you requested does not exist.')
        error.status = 404
        throw error
      }
      req.doc = tenantDoc
      logger.silly('Loaded tenant document', { id })
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Lists all tenants.
   */
  async index(req, res, next) {
    try {
      logger.silly('Loading all TenantModel documents')
      const tenants = await TenantModel.find()
      logger.silly('Loaded all TenantModel documents')
      res.json(tenants)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Shows a single tenant.
   */
  async show(req, res, next) {
    try {
      res.json(req.doc)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new tenant.
   */
  async create(req, res, next) {
    try {
      logger.silly('Creating new tenant document', { body: req.body })
      const tenant = await TenantModel.create(req.body)
      logger.silly('Created new tenant document')
      await publishEvent('tenant.created', tenant.toObject())
      res.status(201).json(tenant)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates a tenant.
   */
  async update(req, res, next) {
    try {
      logger.silly('Updating tenant document', { id: req.doc.id, body: req.body })
      Object.assign(req.doc, req.body)
      await req.doc.save()
      logger.silly('Updated tenant document', { id: req.doc.id })
      await publishEvent('tenant.updated', req.doc.toObject())
      res.json(req.doc)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes a tenant.
   */
  async delete(req, res, next) {
    try {
      logger.silly('Deleting tenant document', { id: req.doc.id })
      await req.doc.deleteOne()
      logger.silly('Deleted tenant document', { id: req.doc.id })
      await publishEvent('tenant.deleted', { id: req.doc.id })
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}
