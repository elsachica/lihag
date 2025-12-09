/**
 * @file Centralized error handling middleware for Express.
 * @module middleware/errorHandler
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import { logger } from "../config/winston.js";

/**
 * Custom error class for application errors.
 */
export class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }
}

/**
 * Converts MongoDB errors to application errors.
 *
 * @param {Error} mongoError - The MongoDB error object
 * @returns {AppError} The converted application error
 */
const handleMongoDBError = (mongoError) => {
  // Duplicate key error
  if (mongoError.code === 11000) {
    const field = Object.keys(mongoError.keyPattern)[0];
    return new AppError(`A ${field} with this value already exists.`, 400);
  }

  // Validation error
  if (mongoError.name === "ValidationError") {
    const messages = Object.values(mongoError.errors)
      .map((err) => err.message)
      .join(", ");
    return new AppError(`Validation error: ${messages}`, 400);
  }

  // Invalid Object ID
  if (mongoError.name === "CastError") {
    return new AppError("Invalid ID format.", 400);
  }

  // Return original error if not a known MongoDB error
  return mongoError;
};

/**
 * Global error handler middleware.
 * Must be registered AFTER all other middleware and routes.
 *
 * @param {Error} err - The error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Convert MongoDB errors to AppError
  if (err.name && ["ValidationError", "CastError"].includes(err.name)) {
    error = handleMongoDBError(err);
  } else if (err.code === 11000) {
    error = handleMongoDBError(err);
  }

  // Ensure error has status and message
  const status = error.status || 500;
  const message = error.message || "Internal Server Error";

  // Log error with appropriate level
  const logData = {
    status,
    path: req.path,
    method: req.method,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  if (status >= 500) {
    logger.error(message, logData);
  } else {
    logger.warn(message, logData);
  }

  // Send error response
  // Never expose stack trace in production
  const response = {
    error: message,
    status,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  res.status(status).json(response);
};
