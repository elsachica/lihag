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
      const reports = await this.maintenanceService.getAllReports(req.query)

      const dto = reports.map(this._toDTO)

      // const dto = reports.map((report) => ({
      //   id: report._id,
      //   apartmentId: report.apartmentId, // One main tenant per apartment
      //   category: report.category, // e.g. kitchen, appliance, plumbing, heating, etc.
      //   description: report.description,
      //   status: report.status,
      //   assignedTo: report.assignedTo || null,
      //   priority: report.priority || null,
      //   images: report.images || [],
      //   createdAt: report.createdAt.toLocaleString('sv-SE', {
      //     dateStyle: 'short',
      //     timeStyle: 'short'
      //   }),
      //   ...(report.updatedAt.getTime() !== report.createdAt.getTime()
      //     ? {
      //         updatedAt: report.updatedAt.toLocaleString('sv-SE', {
      //           dateStyle: 'short',
      //           timeStyle: 'short'
      //         })
      //       }
      //     : {})
      // }))
      return res.status(200).json({ data: dto })
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
      // const report = req.doc

      // const dto = {
      //   id: report._id,
      //   apartmentId: report.apartmentId, // One main tenant per apartment
      //   category: report.category, // e.g. kitchen, appliance, plumbing, heating, etc.
      //   description: report.description,
      //   status: report.status,
      //   assignedTo: report.assignedTo || null,
      //   priority: report.priority || null,
      //   images: report.images || [],
      //   createdAt: report.createdAt.toLocaleString('sv-SE', {
      //     dateStyle: 'short',
      //     timeStyle: 'short'
      //   }),
      //   ...(report.updatedAt.getTime() !== report.createdAt.getTime()
      //     ? {
      //         updatedAt: report.updatedAt.toLocaleString('sv-SE', {
      //           dateStyle: 'short',
      //           timeStyle: 'short'
      //         })
      //       }
      //     : {})
      // }
      return res.status(200).json({ data: dto })
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

      // const dto = {
      //   id: newReport._id,
      //   apartmentId: newReport.apartmentId,
      //   category: newReport.category,
      //   description: newReport.description,
      //   status: newReport.status,
      //   assignedTo: newReport.assignedTo || null,
      //   priority: newReport.priority || null,
      //   images: newReport.images || [],
      //   createdAt: newReport.createdAt.toLocaleString('sv-SE', {
      //     dateStyle: 'short',
      //     timeStyle: 'short'
      //   })
      // }

      return res.status(201).json({ data: dto })
    } catch (error) {
      console.error('Failed to create maintenance report:', error)
      return res.status(500).json({
        message: 'Failed to create maintenance report.',
        details: error.message
      })
    }
  }

  // Hjälpfunktion för DTO
  _toDTO(report) {
    return {
      id: report._id,
      apartmentId: report.apartmentId,
      category: report.category,
      description: report.description,
      status: report.status,
      assignedTo: report.assignedTo || null,
      priority: report.priority || null,
      images: report.images || [],
      createdAt: report.createdAt.toLocaleString('sv-SE', {
        dateStyle: 'short',
        timeStyle: 'short'
      }),
      ...(report.updatedAt.getTime() !== report.createdAt.getTime()
        ? {
            updatedAt: report.updatedAt.toLocaleString('sv-SE', {
              dateStyle: 'short',
              timeStyle: 'short'
            })
          }
        : {})
    }
  }
}
