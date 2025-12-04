/**
 * Defines the MaintenanceController class that handles maintenance report operations.
 *
 * @module controllers/MaintenanceController
 * @author Liv Åberg
 */

/**
 * Handles maintenance-related requests and calls the appropriate service methods for further processing.
 */
export class MaintenanceController {
  /**
   * Creates an instance of the MaintenanceController.
   *
   * @param {object} maintenanceService - The service for handling maintenance-related operations.
   */
  constructor (maintenanceService) {
    this.maintenanceService = maintenanceService
  }

  /**
   * Retrieves all maintenance reports.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async getAllMaintenanceReports (req, res) {
    try {
      const reports = await this.maintenanceService.getAllMaintenanceReports(
        req.query
      )

      const dto = reports.map((report) => ({
        id: report._id,
        description: report.description,
        category: report.category, // e.g. kitchen, appliance, plumbing, heating, etc.
        // propertyId: report.propertyId, // not necessary, already in apartment?
        apartmentId: report.apartmentId, // One main tenant per apartment
        status: report.status,
        createdAt: report.createdAt
      }))
      return res.status(200).json({ data: dto })
    } catch (error) {
      console.error('Failed to fetch maintenance reports:', error)
      return res
        .status(500)
        .json({
          message: 'Failed to fetch maintenance reports.',
          details: error.message
        })
    }
  }
}
