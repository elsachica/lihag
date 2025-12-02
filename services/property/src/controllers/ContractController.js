/**
 * @file Defines the ContractController class.
 * @module controllers/ContractController
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import { logger } from '../config/winston.js'
import { ContractModel } from '../models/ContractModel.js'
import { publishEvent } from '../config/rabbitmq.js'

/**
 * Encapsulates a controller for Contract.
 */
export class ContractController {
  /**
   * Loads a contract document by ID and attaches it to req.doc.
   */
  async loadContractDocument(req, res, next, id) {
    try {
      logger.silly('Loading contract document', { id })
      const contractDoc = await ContractModel.findById(id)
      if (!contractDoc) {
        const error = new Error('The contract you requested does not exist.')
        error.status = 404
        throw error
      }
      req.doc = contractDoc
      logger.silly('Loaded contract document', { id })
      next()
    } catch (error) {
      next(error)
    }
  }

  /**
   * Lists all contracts.
   */
  async index(req, res, next) {
    try {
      logger.silly('Loading all ContractModel documents')
      const contracts = await ContractModel.find()
      logger.silly('Loaded all ContractModel documents')
      res.json(contracts)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Shows a single contract.
   */
  async show(req, res, next) {
    try {
      res.json(req.doc)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new contract.
   */
  async create(req, res, next) {
    try {
      logger.silly('Creating new contract document', { body: req.body })
      const contract = await ContractModel.create(req.body)
      logger.silly('Created new contract document')
      await publishEvent('contract.created', contract.toObject())
      res.status(201).json(contract)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Updates a contract.
   */
  async update(req, res, next) {
    try {
      logger.silly('Updating contract document', { id: req.doc.id, body: req.body })
      Object.assign(req.doc, req.body)
      await req.doc.save()
      logger.silly('Updated contract document', { id: req.doc.id })
      await publishEvent('contract.updated', req.doc.toObject())
      res.json(req.doc)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Deletes a contract.
   */
  async delete(req, res, next) {
    try {
      logger.silly('Deleting contract document', { id: req.doc.id })
      await req.doc.deleteOne()
      logger.silly('Deleted contract document', { id: req.doc.id })
      await publishEvent('contract.deleted', { id: req.doc.id })
      res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}