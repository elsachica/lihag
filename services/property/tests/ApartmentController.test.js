/**
 * @file Tests for ApartmentController
 * @module controllers/ApartmentController.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApartmentController } from '../src/controllers/ApartmentController.js'
import * as rabbitmq from '../src/config/rabbitmq.js'

// Mock ApartmentModel
vi.mock('../src/models/ApartmentModel.js', () => ({
  ApartmentModel: {
    findById: vi.fn(),
    find: vi.fn(),
    aggregate: vi.fn(),
    create: vi.fn()
  }
}))

// Mock publishEvent
vi.mock('../src/config/rabbitmq.js', () => ({
  publishEvent: vi.fn()
}))

// Mock logger
vi.mock('../src/config/winston.js', () => ({
  logger: {
    silly: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  }
}))

// eslint-disable-next-line import/first
import { ApartmentModel } from '../src/models/ApartmentModel.js'

describe('ApartmentController', () => {
  let controller
  let req, res, next

  beforeEach(() => {
    controller = new ApartmentController()

    // Mock Express objects
    req = {
      query: {},
      body: {},
      doc: null,
      path: '/apartments',
      method: 'GET'
    }

    res = {
      json: vi.fn().mockReturnThis(),
      status: vi.fn().mockReturnThis(),
      end: vi.fn().mockReturnThis()
    }

    next = vi.fn()

    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  describe('index method - List apartments', () => {
    it('should list all apartments without filter', async () => {
      const mockApartments = [
        {
          number: 'A1',
          size: 65,
          area: 'Söder om järnvägen',
          type: 'apartment',
          price: 5500
        },
        {
          number: 'A2',
          size: 75,
          area: 'Nybro',
          type: 'apartment',
          price: 6000
        }
      ]

      ApartmentModel.find.mockResolvedValue(mockApartments)

      await controller.index(req, res, next)

      expect(ApartmentModel.find).toHaveBeenCalledWith({})
      expect(res.json).toHaveBeenCalledWith(mockApartments)
    })

    it('should filter apartments by area', async () => {
      req.query = { area: 'Söder om järnvägen' }
      const mockApartments = [
        { number: 'A1', area: 'Söder om järnvägen', type: 'apartment' }
      ]

      ApartmentModel.find.mockResolvedValue(mockApartments)

      await controller.index(req, res, next)

      expect(ApartmentModel.find).toHaveBeenCalledWith({
        area: 'Söder om järnvägen'
      })
      expect(res.json).toHaveBeenCalledWith(mockApartments)
    })

    it('should filter apartments by type', async () => {
      req.query = { type: 'locale' }
      const mockApartments = [{ number: 'Local-1', type: 'locale' }]

      ApartmentModel.find.mockResolvedValue(mockApartments)

      await controller.index(req, res, next)

      expect(ApartmentModel.find).toHaveBeenCalledWith({ type: 'locale' })
      expect(res.json).toHaveBeenCalledWith(mockApartments)
    })

    it('should filter apartments by both area and type', async () => {
      req.query = { area: 'Nybro', type: 'apartment' }
      const mockApartments = [
        { number: 'A2', area: 'Nybro', type: 'apartment' }
      ]

      ApartmentModel.find.mockResolvedValue(mockApartments)

      await controller.index(req, res, next)

      expect(ApartmentModel.find).toHaveBeenCalledWith({
        area: 'Nybro',
        type: 'apartment'
      })
      expect(res.json).toHaveBeenCalledWith(mockApartments)
    })

    it('should handle errors during listing', async () => {
      const error = new Error('Database error')
      ApartmentModel.find.mockRejectedValue(error)

      await controller.index(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
      expect(res.json).not.toHaveBeenCalled()
    })
  })

  describe('show method - Get single apartment', () => {
    it('should return the apartment document from req.doc', async () => {
      req.doc = {
        id: '123',
        number: 'A1',
        area: 'Söder om järnvägen'
      }

      await controller.show(req, res, next)

      expect(res.json).toHaveBeenCalledWith(req.doc)
    })
  })

  describe('create method - Create new apartment', () => {
    it('should create a new apartment and publish event', async () => {
      const newApartmentData = {
        number: 'A3',
        size: 85,
        area: 'Kalmar',
        type: 'apartment',
        price: 6500
      }

      req.body = newApartmentData

      const mockCreatedApartment = {
        ...newApartmentData,
        id: 'new-id',
        toObject: vi.fn().mockReturnValue(newApartmentData)
      }

      ApartmentModel.create.mockResolvedValue(mockCreatedApartment)

      await controller.create(req, res, next)

      expect(ApartmentModel.create).toHaveBeenCalledWith(newApartmentData)
      expect(rabbitmq.publishEvent).toHaveBeenCalledWith(
        'apartment.created',
        newApartmentData
      )
      expect(res.status).toHaveBeenCalledWith(201)
      expect(res.json).toHaveBeenCalledWith(mockCreatedApartment)
    })

    it('should handle creation errors', async () => {
      const error = new Error('Validation failed')
      ApartmentModel.create.mockRejectedValue(error)

      await controller.create(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
      expect(rabbitmq.publishEvent).not.toHaveBeenCalled()
    })
  })

  describe('update method - Update apartment', () => {
    it('should update apartment and publish event', async () => {
      const updateData = { price: 7000 }
      req.body = updateData

      req.doc = {
        id: '123',
        number: 'A1',
        price: 6500,
        save: vi.fn().mockResolvedValue(true),
        toObject: vi.fn().mockReturnValue({
          id: '123',
          number: 'A1',
          price: 7000
        })
      }

      await controller.update(req, res, next)

      expect(req.doc.save).toHaveBeenCalled()
      expect(rabbitmq.publishEvent).toHaveBeenCalledWith(
        'apartment.updated',
        expect.objectContaining({ id: '123' })
      )
      expect(res.json).toHaveBeenCalled()
    })

    it('should handle update errors', async () => {
      const error = new Error('Save failed')

      req.doc = {
        id: '123',
        save: vi.fn().mockRejectedValue(error)
      }
      req.body = { price: 7000 }

      await controller.update(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
      expect(rabbitmq.publishEvent).not.toHaveBeenCalled()
    })
  })

  describe('delete method - Delete apartment', () => {
    it('should delete apartment and publish event', async () => {
      req.doc = {
        id: '123',
        number: 'A1',
        deleteOne: vi.fn().mockResolvedValue(true)
      }

      await controller.delete(req, res, next)

      expect(req.doc.deleteOne).toHaveBeenCalled()
      expect(rabbitmq.publishEvent).toHaveBeenCalledWith('apartment.deleted', {
        id: '123'
      })
      expect(res.status).toHaveBeenCalledWith(204)
      expect(res.end).toHaveBeenCalled()
    })

    it('should handle delete errors', async () => {
      const error = new Error('Delete failed')

      req.doc = {
        id: '123',
        deleteOne: vi.fn().mockRejectedValue(error)
      }

      await controller.delete(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
      expect(rabbitmq.publishEvent).not.toHaveBeenCalled()
    })
  })

  describe('loadApartmentDocument method - Middleware for loading apartment', () => {
    it('should load apartment by ID and call next', async () => {
      const mockApartment = {
        id: '123',
        number: 'A1'
      }

      ApartmentModel.findById.mockResolvedValue(mockApartment)

      await controller.loadApartmentDocument(req, res, next, '123')

      expect(ApartmentModel.findById).toHaveBeenCalledWith('123')
      expect(req.doc).toBe(mockApartment)
      expect(next).toHaveBeenCalled()
    })

    it('should return 404 if apartment not found', async () => {
      ApartmentModel.findById.mockResolvedValue(null)

      await controller.loadApartmentDocument(req, res, next, '123')

      expect(next).toHaveBeenCalled()
      const error = next.mock.calls[0][0]
      expect(error.message).toBe('The apartment you requested does not exist.')
      expect(error.status).toBe(404)
    })

    it('should handle database errors', async () => {
      const error = new Error('DB error')
      ApartmentModel.findById.mockRejectedValue(error)

      await controller.loadApartmentDocument(req, res, next, '123')

      expect(next).toHaveBeenCalledWith(error)
    })
  })

  describe('statistics method - Get apartment statistics', () => {
    it('should return statistics grouped by area and type', async () => {
      const mockStats = [
        { area: 'Söder om järnvägen', type: 'apartment', count: 5 },
        { area: 'Nybro', type: 'apartment', count: 3 },
        { area: 'Kalmar', type: 'locale', count: 2 }
      ]

      ApartmentModel.aggregate.mockResolvedValue(mockStats)

      await controller.statistics(req, res, next)

      expect(ApartmentModel.aggregate).toHaveBeenCalled()
      expect(res.json).toHaveBeenCalledWith(mockStats)
    })

    it('should handle statistics calculation errors', async () => {
      const error = new Error('Aggregation error')
      ApartmentModel.aggregate.mockRejectedValue(error)

      await controller.statistics(req, res, next)

      expect(next).toHaveBeenCalledWith(error)
    })
  })
})
