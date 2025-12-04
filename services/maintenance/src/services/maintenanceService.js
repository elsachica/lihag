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
  constructor (maintenanceRepository) {
    this.maintenanceRepository = maintenanceRepository
  }

  /**
   * Retrieves all maintenance reports based on optional query filters.
   *
   * @param {object} query - The query parameters for filtering and pagination.
   * @returns {Promise<Array>} - A promise that resolves to an array of maintenance reports.
   */
  async getAllMaintenanceReports (query) {
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
    const reports = await this.maintenanceRepository.getAllMaintenanceReports(filter, { skip, limit })
    return reports
  }
}
