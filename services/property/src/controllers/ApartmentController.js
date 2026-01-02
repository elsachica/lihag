/**
 * @file Defines the ApartmentController class.
 * @module controllers/ApartmentController
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import { logger } from '../config/winston.js'
import { ApartmentModel } from '../models/ApartmentModel.js'
import { publishEvent } from '../config/rabbitmq.js'

/**
 * Encapsulates a controller for Apartment.
 */
export class ApartmentController {
  /**
   * Loads an apartment document by ID and attaches it to req.doc.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - Apartment document ID.
   */
  async loadApartmentDocument (req, res, next, id) {
    try {
      logger.silly('Loading apartment document', { id })
      const apartmentDoc = await ApartmentModel.findById(id)
      if (!apartmentDoc) {
        const error = new Error('The apartment you requested does not exist.')
        error.status = 404
        throw error
      }
      req.doc = apartmentDoc
      logger.silly('Loaded apartment document', { id })
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Lists apartments with optional filtering by area and type.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      logger.silly('Loading ApartmentModel documents with filter', {
        query: req.query
      })
      const { area, type } = req.query
      const filter = {}
      if (area) filter.area = area
      if (type) filter.type = type

      // Pagination
      const rangeStart = parseInt(req.headers.range?.split('=')[1]?.split('-')[0] || 0, 10)
      const rangeEnd = parseInt(req.headers.range?.split('=')[1]?.split('-')[1] || 9, 10)
      const limit = rangeEnd - rangeStart + 1

      const total = await ApartmentModel.countDocuments(filter)
      const apartments = await ApartmentModel.find(filter).skip(rangeStart).limit(limit)

      res.set('Content-Range', `items ${rangeStart}-${rangeStart + apartments.length - 1}/${total}`)
      res.set('Access-Control-Expose-Headers', 'Content-Range')
      logger.silly('Loaded ApartmentModel documents')
      res.json(apartments)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Returns statistics: number of apartments/locales per area and type.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async statistics (req, res, next) {
    try {
      logger.silly('Calculating apartment statistics')
      const stats = await ApartmentModel.aggregate([
        {
          $group: {
            _id: { area: '$area', type: '$type' },
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            area: '$_id.area',
            type: '$_id.type',
            count: 1,
            _id: 0
          }
        }
      ])
      res.json(stats)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends the requested apartment document as a JSON response.
   *
   * @async
   * @function show
   * @param {import('express').Request} req - Express request object, expected to have a `doc` property containing the apartment data.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   * @returns {Promise<void>} Sends the apartment document as JSON or passes error to next middleware.
   */
  async show (req, res, next) {
    try {
      res.json(req.doc)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new apartment document.
   *
   * @async
   * @function create
   * @param {import('express').Request} req - Express request object containing apartment data in the body.
   * @param {import('express').Response} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async create (req, res, next) {
    try {
      logger.silly('Creating new apartment document', { body: req.body })
      const apartment = await ApartmentModel.create(req.body)
      logger.silly('Created new apartment document')
      await publishEvent('apartment.created', apartment.toObject())
      res.status(201).json(apartment)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates an existing apartment document with the provided data in the request body.
   * Logs the update process, saves the updated document, publishes an 'apartment.updated' event,
   * and returns the updated document as a JSON response.
   *
   * @async
   * @function
   * @param {import('express').Request} req - Express request object, with `doc` property containing the apartment document to update.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async update (req, res, next) {
    try {
      logger.silly('Updating apartment document', {
        id: req.doc.id,
        body: req.body
      })
      Object.assign(req.doc, req.body)
      await req.doc.save()
      logger.silly('Updated apartment document', { id: req.doc.id })
      await publishEvent('apartment.updated', req.doc.toObject())
      res.json(req.doc)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes an apartment document.
   *
   * This controller method deletes the apartment document attached to the request (`req.doc`),
   * logs the deletion process, publishes an 'apartment.deleted' event, and sends a 204 No Content response.
   * If an error occurs, it passes the error to the next middleware.
   *
   * @async
   * @function delete
   * @param {import('express').Request} req - Express request object, with `doc` property containing the apartment document.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next middleware function.
   * @returns {Promise<void>}
   */
  async delete (req, res, next) {
    try {
      logger.silly('Deleting apartment document', { id: req.doc.id })
      await req.doc.deleteOne()
      logger.silly('Deleted apartment document', { id: req.doc.id })
      await publishEvent('apartment.deleted', { id: req.doc.id })
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}
