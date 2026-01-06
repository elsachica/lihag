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
  constructor(maintenanceService) {
    this.maintenanceService = maintenanceService
  }

  /**
   * Retrieves all maintenance reports.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async getAllReports(req, res) {
    try {
      const reports = await this.maintenanceService.getAllReports()

      const dto = reports.map(report => this._toDTO(report))

      return res.status(200).json(dto)
    } catch (error) {
      console.error('Failed to fetch maintenance reports:', error)
      return res.status(500).json({
        message: 'Failed to fetch maintenance reports.',
        details: error.message
      })
    }
  }

  /**
   * Retrieves a single maintenance report by ID.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @returns {Promise<void>} - A promise that resolves when the operation is complete.
   */
  async getReport(req, res) {
    try {
      const dto = this._toDTO(req.doc)
      return res.status(200).json(dto)
    } catch (error) {
      console.error('Failed to fetch maintenance reports:', error)
      return res.status(500).json({
        message: 'Failed to fetch maintenance reports.',
        details: error.message
      })
    }
  }

  async createReport(req, res) {
    try {
      const reportData = req.body

      const newReport = await this.maintenanceService.createReport(reportData)

      const dto = this._toDTO(newReport)
      return res.status(201).json(dto)
    } catch (error) {
      console.error('Failed to create maintenance report:', error)
      return res.status(500).json({
        message: 'Failed to create maintenance report.',
        details: error.message
      })
    }
  }

  async updateReport(req, res) {
    try {
      const existingReport = req.doc
      const changes = req.body
      const updatedReport = await this.maintenanceService.updateReport(
        existingReport,
        changes
      )

      const dto = this._toDTO(updatedReport)
      return res.status(200).json(dto)
    } catch (error) {
      console.error('Failed to update maintenance report:', error)
      return res.status(500).json({
        message: 'Failed to update maintenance report.',
        details: error.message
      })
    }
  }

  async deleteReport(req, res) {
    try {
      const existingReport = req.doc
      await this.maintenanceService.deleteReport(existingReport)

      return res.status(204).send()
    } catch (error) {
      console.error('Failed to delete maintenance report:', error)
      return res.status(500).json({
        message: 'Failed to delete maintenance report.',
        details: error.message
      })
    }
  }

  /**
   * Helpmethod to convert a report document to a Data Transfer Object (DTO).
   *
   * @param {object} report - The maintenance report document.
   * @returns {object} - The maintenance report DTO.
   */
  _toDTO(report) {
    return {
      _id: report._id,
      id: report._id.toString(),
      apartmentId: report.apartmentId,
      category: report.category,
      description: report.description,
      status: report.status,
      assignedTo: report.assignedTo || null,
      priority: report.priority || null,
      images: report.images || [],
      createdAt: report.createdAt.toISOString(),
      updatedAt: report.updatedAt.toISOString()
    }
  }
}
