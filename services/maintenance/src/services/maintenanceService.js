import { publishEvent } from '../messaging/rabbitmq.js'

/**
 * @file Defines the maintenance service for fetching maintenance data.
 * @module services/MaintenanceService
 * @author Liv Åberg
 */

/**
 * Service for handling maintenance-related operations.
 */
export class MaintenanceService {
  /**
   * Creates an instance of the MaintenanceService.
   *
   * @param {object} maintenanceRepository - The repository for accessing maintenance data.
   */
  constructor(maintenanceRepository) {
    this.maintenanceRepository = maintenanceRepository
  }

  /**
   * Retrieves all maintenance reports based on optional query filters.
   *
   * @param {object} options - The query parameters for filtering and pagination.
   * @returns {Promise<Array>} - A promise that resolves to an array of maintenance reports.
   */
  async getAllReports(options = {}) {
    const { skip = 0, limit = 20, sort, order } = options
    const filter = {}

    const sortOptions = {}
    if (sort) {
      sortOptions[sort] = order === 'DESC' ? -1 : 1
    }

    const reports = await this.maintenanceRepository.getAllReports(filter, {
      skip,
      limit,
      sort: sortOptions
    })
    return reports
  }

  /**
   * Get total count of maintenance reports.
   *
   * @returns {Promise<number>} - The total count of reports.
   */
  async getReportCount() {
    return await this.maintenanceRepository.getReportCount()
  }

  /**
   * Retrieves a single maintenance report by its ID.
   *
   * @param {string} id - The ID of the maintenance report.
   * @returns {Promise<object|null>} - A promise that resolves to the maintenance report, or null if not found.
   */
  async getReportById(id) {
    if (!id) throw new Error('Report ID is required')

    const report = await this.maintenanceRepository.getReportById(id)
    return report
  }

  async createReport(reportData) {
    if (!reportData.apartmentId || !reportData.category) {
      throw new Error('apartmentId and category are required')
    }

    const newReport = await this.maintenanceRepository.createReport(reportData)

    // Publish event to RabbitMQ (non-blocking - don't fail if RabbitMQ is down)
    try {
      await publishEvent('maintenance.created', {
        reportId: newReport._id,
        apartmentId: newReport.apartmentId,
        category: newReport.category,
        status: newReport.status || 'new'
      })
    } catch (error) {
      console.error('Failed to publish maintenance.created event:', error.message)
      // Continue anyway - the report is already saved
    }

    return newReport
  }

  async updateReport(existingReport, changes) {
    const allowedChanges = ['category', 'description', 'status', 'priority', 'assignedTo', 'images']
    for (const key of allowedChanges) {
      if (key in changes) {
        existingReport[key] = changes[key]
      }
    }

    const updatedReport = await this.maintenanceRepository.updateReport(
      existingReport,
      changes
    )

    // Publish event to RabbitMQ (non-blocking - don't fail if RabbitMQ is down)
    try {
      await publishEvent('maintenance.updated', {
        reportId: updatedReport._id,
        ...changes
      })
    } catch (error) {
      console.error('Failed to publish maintenance.updated event:', error.message)
      // Continue anyway - the report is already updated
    }

    return updatedReport
  }

  async deleteReport(report) {
    await this.maintenanceRepository.deleteReport(report)

    // Publish event to RabbitMQ (non-blocking - don't fail if RabbitMQ is down)
    try {
      await publishEvent('maintenance.deleted', {
        reportId: report._id,
        apartmentId: report.apartmentId
      })
    } catch (error) {
      console.error('Failed to publish maintenance.deleted event:', error.message)
      // Continue anyway - the report is already deleted
    }
  }
}
