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
   * @param {object} query - The query parameters for filtering and pagination.
   * @returns {Promise<Array>} - A promise that resolves to an array of maintenance reports.
   */
  async getAllReports(query) {
    const filter = {}

    // Example: filter by apartmentId or status if provided
    if (query.apartmentId) {
      filter.apartmentId = query.apartmentId
    }
    if (query.status) {
      filter.status = query.status
    }

    // Pagination
    const page = parseInt(query.page, 10) || 1
    const limit = Math.min(parseInt(query.limit, 10) || 20, 100)
    const skip = (page - 1) * limit

    // Fetch data
    const reports = await this.maintenanceRepository.getAllReports(filter, {
      skip,
      limit
    })
    return reports
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

    await publishEvent('maintenance.created', {
      reportId: newReport._id,
      apartmentId: newReport.apartmentId,
      category: newReport.category,
      description: newReport.description,
      status: newReport.status || 'new'
    })

    return newReport
  }

  async updateReport(existingReport, changes) {
    const allowedChanges = [
      'category',
      'description',
      'status',
      'priority',
      'assignedTo',
      'images'
    ]
    for (const key of allowedChanges) {
      if (key in changes) {
        existingReport[key] = changes[key]
      }
    }

    const updatedReport = await this.maintenanceRepository.updateReport(
      existingReport,
      changes
    )

    await publishEvent('maintenance.updated', {
      reportId: updatedReport._id,
      ...changes
    })

    return updatedReport
  }

  async deleteReport(report) {
    await this.maintenanceRepository.deleteReport(report)

    await publishEvent('maintenance.deleted', {
      reportId: report._id,
      apartmentId: report.apartmentId
    })
  }
}
