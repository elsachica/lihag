/**
 * @file Defines the maintenance repository for accessing maintenance data from the MongoDB database.
 * @module repositories/MaintenanceRepository
 * @author Liv Åberg
 */

import { ReportModel } from '../models/report.js'

/**
 * Repository for accessing maintenance report data.
 */
export class MaintenanceRepository {
  /**
   * Finds maintenance reports based on filter and pagination.
   *
   * @param {object} filter - The filter criteria for querying maintenance reports.
   * @param {object} options - The pagination options, including limit and skip.
   * @returns {Promise<Array>} - A promise that resolves to an array of maintenance report documents.
   */
  async getAllReports(filter = {}, options = {}) {
    return ReportModel.find(filter)
      .sort({ createdAt: -1 })
      .skip(options.skip || 0)
      .limit(options.limit || 20)
      .exec()
  }

  /**
   * Counts the number of maintenance reports in the database that match the given filter criteria.
   *
   * @param {object} filter - The filter criteria for counting maintenance reports.
   * @returns {Promise<number>} - A promise that resolves to the count of matching maintenance reports.
   */
  async count(filter = {}) {
    return ReportModel.countDocuments(filter).exec()
  }

  /**
   * Retrieves a maintenance report by its ID.
   *
   * @param {*} id - The ID of the maintenance report.
   * @returns {Promise<object|null>} - A promise that resolves to the maintenance report document, or null if not found.
   */
  async getReportById(id) {
    return ReportModel.findById(id)
  }

  /**
   * Creates a new maintenance report.
   *
   * @param {object} reportData - The data for the new maintenance report.
   * @returns {Promise<object>} - A promise that resolves to the created maintenance report document.
   */
  async createReport(reportData) {
    const report = new ReportModel(reportData)
    return report.save()
  }
}
