/**
 * @file This module contains the configuration for the Mongoose ODM.
 * @module config/mongoose
 * @author Elsa Gas Wikström
 * @version 3.1.0
 */

import mongoose from "mongoose";
import { logger } from "./winston.js";

/**
 * Establishes a connection to a database with automatic retry logic.
 * If the initial connection fails, retries in the background without blocking server startup.
 *
 * @param {string} connectionString - The connection string.
 * @returns {Promise<void>} Resolves immediately; actual connection happens in background.
 */
export const connectToDatabase = async (connectionString) => {
  const { connection } = mongoose;

  mongoose.set("strict", "throw");
  mongoose.set("strictQuery", true);

  connection.on("connected", () =>
    logger.info("Mongoose connected to MongoDB.")
  );
  connection.on("error", (err) =>
    logger.warn(`Mongoose connection error: ${err}`)
  );
  connection.on("disconnected", () =>
    logger.info("Mongoose disconnected from MongoDB.")
  );

  for (const signalEvent of ["SIGINT", "SIGTERM"]) {
    process.on(signalEvent, () => {
      (async () => {
        await connection.close();
        logger.info(
          `Mongoose disconnected from MongoDB through ${signalEvent}.`
        );
        process.exit(0);
      })();
    });
  }

  logger.info("Mongoose connecting to MongoDB.");

  // Connect in the background with exponential backoff retry
  connectWithRetry(connectionString);
};

/**
 * Attempts to connect to MongoDB with exponential backoff retry.
 * Logs warnings on failure but doesn't block server startup.
 *
 * @param {string} connectionString - The connection string.
 * @param {number} retryCount - Current retry attempt (internal use).
 */
async function connectWithRetry(connectionString, retryCount = 0) {
  const maxRetries = 10;
  const baseDelay = 1000; // 1 second
  const maxDelay = 60000; // 60 seconds

  try {
    await mongoose.connect(connectionString);
  } catch (error) {
    if (retryCount < maxRetries) {
      const delay = Math.min(baseDelay * Math.pow(2, retryCount), maxDelay);
      logger.warn(
        `MongoDB connection failed. Retrying in ${delay}ms (attempt ${
          retryCount + 1
        }/${maxRetries})`
      );
      setTimeout(
        () => connectWithRetry(connectionString, retryCount + 1),
        delay
      );
    } else {
      logger.error(
        `Failed to connect to MongoDB after ${maxRetries} attempts. Server will continue without database.`
      );
    }
  }
}
