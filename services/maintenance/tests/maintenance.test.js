import { test, expect, beforeEach, vi } from 'vitest'
import { MaintenanceService } from '../src/services/maintenanceService.js'

vi.mock('../src/messaging/rabbitmq.js', () => ({
  publishEvent: vi.fn()
}))

let service

const mockRepo = {
  _data: [],
  /**
   * Retrieves all maintenance reports from the mock storage.
   *
   * @returns {Promise<Array<object>>} A promise that resolves to an array of mocked reports.
   */
  getAllReports: async () => mockRepo._data,

  /**
   * Creates a new maintenance report in the mock storage.
   *
   * @param {object} data - The data for the new report.
   * @returns {Promise<object>} A promise that resolves to the created mocked report, including an _id.
   */
  createReport: async (data) => {
    const newItem = { ...data, _id: 'mock-id' }
    mockRepo._data.push(newItem)
    return newItem
  }
}

beforeEach(() => {
  service = new MaintenanceService(mockRepo)
})

test('should create and retrieve a maintenance report', async () => {
  const reportData = {
    apartmentId: 'lgh-123',
    category: 'Vatten & avlopp',
    description: 'Läckande diskho',
    status: 'Ny'
  }

  const createdReport = await service.createReport(reportData)

  expect(createdReport).toHaveProperty('_id')
  expect(createdReport.description).toBe('Läckande diskho')

  const reports = await service.getAllReports({})
  const found = reports.find((r) => r._id === createdReport._id)

  expect(found).toBeDefined()
  expect(found.apartmentId).toBe('lgh-123')
})
