import { body, validationResult } from 'express-validator'
import mongoose from 'mongoose'

/**
 * Checks if a value is a valid MongoDB ObjectId.
 *
 * @param {string} value - The value to check.
 * @returns {boolean} - True if the value is a valid ObjectId, false otherwise.
 */
const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value)

const categories = [
  'Sovrum',
  'Kök',
  'Vardagsrum',
  'Badrum',
  'Klädkammare',
  'Balkong',
  'Hall',
  'Vitvaror',
  'Värme & ventilation',
  'El',
  'Vatten & avlopp',
  'Hiss',
  'Trapphus',
  'Entré',
  'Utegård',
  'Tvättstuga',
  'Miljörum',
  'Fastighet',
  'Parkering & garage',
  'Cykelrum',
  'Övrigt'
]

const statuses = ['Ny', 'Behandlas', 'Stängd']
const priorities = ['Låg', 'Medium', 'Hög', 'Akut']

/**
 * Returns an array of Express middleware functions for validating maintenance report data.
 *
 * @param {boolean} isCreate - True if validating for report creation, false for update.
 * @returns {Array} - An array of validation middlewares.
 */
export const validation = (isCreate = true) => {
  const rules = [
    body('apartmentId')
      .if(() => isCreate)
      .notEmpty()
      .withMessage('apartmentId is required')
      .bail()
      .custom(isValidObjectId)
      .withMessage('apartmentId must be a valid ObjectId')
      .optional(!isCreate),
    body('category')
      .if(() => isCreate)
      .notEmpty()
      .withMessage('category is required')
      .bail()
      .isIn(categories)
      .withMessage('Invalid category')
      .optional(!isCreate),
    body('description')
      .if(() => isCreate)
      .isString()
      .trim()
      .notEmpty()
      .withMessage('description is required')
      .bail()
      .isLength({ max: 500 })
      .withMessage('description cannot exceed 500 characters')
      .escape()
      .optional(!isCreate),
    body('status').optional().isIn(statuses).withMessage('Invalid status'),
    body('assignedTo')
      .optional()
      .custom(isValidObjectId)
      .withMessage('assignedTo must be a valid ObjectId'),
    body('priority')
      .optional()
      .isIn(priorities)
      .withMessage('Invalid priority'),
    body('images')
      .optional()
      .isArray({ max: 5 })
      .withMessage('images must be an array'),
    body('images.*')
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('each image must be a valid URL')
      .bail(),
    (req, res, next) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        const err = new Error(
          errors
            .array()
            .map((e) => e.msg)
            .join(', ')
        )
        err.status = 400
        return next(err)
      }

      // For updates, ensure at least one field is provided.
      if (!isCreate && Object.keys(req.body).length === 0) {
        const err = new Error('At least one field must be provided in order to update.')
        err.status = 400
        return next(err)
      }

      next()
    }
  ]

  return rules
}
