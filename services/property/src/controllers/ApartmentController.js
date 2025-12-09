/**
 * @file Defines the ApartmentController class.
 * @module controllers/ApartmentController
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import { logger } from "../config/winston.js";
import { ApartmentModel } from "../models/ApartmentModel.js";
import { publishEvent } from "../config/rabbitmq.js";

/**
 * Encapsulates a controller for Apartment.
 */
export class ApartmentController {
  /**
   * Loads an apartment document by ID and attaches it to req.doc.
   */
  async loadApartmentDocument(req, res, next, id) {
    try {
      logger.silly("Loading apartment document", { id });
      const apartmentDoc = await ApartmentModel.findById(id);
      if (!apartmentDoc) {
        const error = new Error("The apartment you requested does not exist.");
        error.status = 404;
        throw error;
      }
      req.doc = apartmentDoc;
      logger.silly("Loaded apartment document", { id });
      next();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lists apartments with optional filtering by area and type.
   */
  async index(req, res, next) {
    try {
      logger.silly("Loading ApartmentModel documents with filter", {
        query: req.query,
      });
      const { area, type } = req.query;
      const filter = {};
      if (area) filter.area = area;
      if (type) filter.type = type;
      const apartments = await ApartmentModel.find(filter);
      logger.silly("Loaded ApartmentModel documents");
      res.json(apartments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Returns statistics: number of apartments/locales per area and type.
   */
  async statistics(req, res, next) {
    try {
      logger.silly("Calculating apartment statistics");
      const stats = await ApartmentModel.aggregate([
        {
          $group: {
            _id: { area: "$area", type: "$type" },
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            area: "$_id.area",
            type: "$_id.type",
            count: 1,
            _id: 0,
          },
        },
      ]);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Shows a single apartment.
   */
  async show(req, res, next) {
    try {
      res.json(req.doc);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates a new apartment.
   */
  async create(req, res, next) {
    try {
      logger.silly("Creating new apartment document", { body: req.body });
      const apartment = await ApartmentModel.create(req.body);
      logger.silly("Created new apartment document");
      await publishEvent("apartment.created", apartment.toObject());
      res.status(201).json(apartment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates an apartment.
   */
  async update(req, res, next) {
    try {
      logger.silly("Updating apartment document", {
        id: req.doc.id,
        body: req.body,
      });
      Object.assign(req.doc, req.body);
      await req.doc.save();
      logger.silly("Updated apartment document", { id: req.doc.id });
      await publishEvent("apartment.updated", req.doc.toObject());
      res.json(req.doc);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes an apartment.
   */
  async delete(req, res, next) {
    try {
      logger.silly("Deleting apartment document", { id: req.doc.id });
      await req.doc.deleteOne();
      logger.silly("Deleted apartment document", { id: req.doc.id });
      await publishEvent("apartment.deleted", { id: req.doc.id });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Binds a tenant to this apartment.
   * Sets tenant reference and marks apartment as unavailable.
   */
  async bindTenant(req, res, next) {
    try {
      const { tenantId } = req.body;

      if (!tenantId) {
        const error = new Error("Missing required field: tenantId");
        error.status = 400;
        throw error;
      }

      logger.silly("Binding tenant to apartment", {
        apartmentId: req.doc.id,
        tenantId,
      });

      // Update apartment: set tenant and mark as unavailable
      req.doc.tenant = tenantId;
      req.doc.isAvailable = false;
      await req.doc.save();

      logger.silly("Tenant bound to apartment", {
        apartmentId: req.doc.id,
        tenantId,
      });
      await publishEvent("apartment.tenant-bound", req.doc.toObject());
      res.json(req.doc);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Unbinds the tenant from this apartment.
   * Removes tenant reference and marks apartment as available.
   */
  async unbindTenant(req, res, next) {
    try {
      logger.silly("Unbinding tenant from apartment", {
        apartmentId: req.doc.id,
      });

      // Update apartment: remove tenant and mark as available
      req.doc.tenant = null;
      req.doc.isAvailable = true;
      await req.doc.save();

      logger.silly("Tenant unbound from apartment", {
        apartmentId: req.doc.id,
      });
      await publishEvent("apartment.tenant-unbound", req.doc.toObject());
      res.json(req.doc);
    } catch (error) {
      next(error);
    }
  }
}
