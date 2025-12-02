/**
 * @file Defines the PropertyController class.
 * @module controllers/PropertyController
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import { logger } from '../config/winston.js'
import { PropertyModel } from '../models/PropertyModel.js'
import { publishEvent } from '../config/rabbitmq.js'

/**
 * Encapsulates a controller for Property.
 */
export class PropertyController {
  /**
   * Loads a property document by ID and attaches it to req.doc.
   */
  async loadPropertyDocument(req, res, next, id) {
    try {
      logger.silly('Loading property document', { id })
      const propertyDoc = await PropertyModel.findById(id)
      if (!propertyDoc) {
        const error = new Error('The property you requested does not exist.')
        error.status = 404
        throw error
      }
      req.doc = propertyDoc
      logger.silly('Loaded property document', { id })
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Lists all properties.
   */
  async index(req, res, next) {
    try {
      logger.silly('Loading all PropertyModel documents')
      const properties = await PropertyModel.find()
      logger.silly('Loaded all PropertyModel documents')
      res.json(properties)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Shows a single property.
   */
  async show(req, res, next) {
    try {
      res.json(req.doc)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new property.
   */
  async create(req, res, next) {
    try {
      logger.silly('Creating new property document', { body: req.body })
      const property = await PropertyModel.create(req.body)
      logger.silly('Created new property document')
      await publishEvent('property.created', property.toObject())
      res.status(201).json(property)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates a property.
   */
  async update(req, res, next) {
    try {
      logger.silly('Updating property document', { id: req.doc.id, body: req.body })
      Object.assign(req.doc, req.body)
      await req.doc.save()
      logger.silly('Updated property document', { id: req.doc.id })
      await publishEvent('property.updated', req.doc.toObject())
      res.json(req.doc)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes a property.
   */
  async delete(req, res, next) {
    try {
      logger.silly('Deleting property document', { id: req.doc.id })
      await req.doc.deleteOne()
      logger.silly('Deleted property document', { id: req.doc.id })
      await publishEvent('property.deleted', { id: req.doc.id })
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}