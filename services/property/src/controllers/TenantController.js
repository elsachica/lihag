/**
 * @file Defines the TenantController class.
 * @module controllers/TenantController
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import { logger } from '../config/winston.js'
import { TenantModel } from '../models/TenantModel.js'
import { ApartmentModel } from '../models/ApartmentModel.js'
import { publishEvent } from '../config/rabbitmq.js'

/**
 * Encapsulates a controller for Tenant.
 */
export class TenantController {
  /**
   * Middleware to load a tenant document by ID and attach it to the request object.
   *
   * @async
   * @function loadTenantDocument
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The ID of the tenant to load.
   * @returns {Promise<void>}
   * @throws {Error} If the tenant does not exist or a database error occurs.
   */
  async loadTenantDocument (req, res, next, id) {
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
   * Retrieves all tenant documents from the database and returns them as JSON.
   *
   * @async
   * @function index
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   * @returns {Promise<void>} Sends a JSON response with all tenants or passes an error to the next middleware.
   */
  async index (req, res, next) {
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
   * Sends the tenant document attached to the request as a JSON response.
   *
   * @async
   * @function show
   * @param {import('express').Request} req - Express request object, expected to have a `doc` property.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async show (req, res, next) {
    try {
      res.json(req.doc)
    } catch (error) {
      next(error)
    }
  }


  async create (req, res, next) {
    try {
      const { name, email, phone, apartmentId } = req.body

      // Validate required fields
      if (!name || !email || !apartmentId) {
        const error = new Error(
          'Missing required fields: name, email, apartmentId'
        )
        error.status = 400
        throw error
      }

      // Validate that apartment exists
      logger.silly('Validating apartment exists', { apartmentId })
      const apartment = await ApartmentModel.findById(apartmentId)
      if (!apartment) {
        const error = new Error('The apartment you specified does not exist.')
        error.status = 404
        throw error
      }

      // Check if apartment is already occupied
      if (!apartment.isAvailable) {
        const error = new Error('The apartment is already occupied.')
        error.status = 400
        throw error
      }

      logger.silly('Creating new tenant document', { body: req.body })
      const tenant = await TenantModel.create({
        name,
        email,
        phone: phone || null
      })

      logger.silly('Binding tenant to apartment', {
        tenantId: tenant.id,
        apartmentId
      })
      // Bind tenant to apartment
      apartment.tenant = tenant.id
      apartment.isAvailable = false
      await apartment.save()

      logger.silly('Created new tenant and bound to apartment')
      await publishEvent('tenant.created', tenant.toObject())
      await publishEvent('apartment.tenant-bound', apartment.toObject())

      res.status(201).json(tenant)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates a tenant.
   *
   * @param req
   * @param res
   * @param next
   */
  async update (req, res, next) {
    try {
      logger.silly('Updating tenant document', {
        id: req.doc.id,
        body: req.body
      })
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
   * Deletes a tenant and unbinds from apartment.
   *
   * @param req
   * @param res
   * @param next
   */
  async delete (req, res, next) {
    try {
      logger.silly('Deleting tenant document', { id: req.doc.id })

      // Find and unbind apartment
      const apartment = await ApartmentModel.findOne({ tenant: req.doc.id })
      if (apartment) {
        logger.silly('Unbinding apartment from tenant', {
          apartmentId: apartment.id
        })
        apartment.tenant = null
        apartment.isAvailable = true
        await apartment.save()
        await publishEvent('apartment.tenant-unbound', apartment.toObject())
      }

      await req.doc.deleteOne()
      logger.silly('Deleted tenant document', { id: req.doc.id })
      await publishEvent('tenant.deleted', { id: req.doc.id })
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}
