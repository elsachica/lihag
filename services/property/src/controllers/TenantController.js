/**
 * @file Defines the TenantController class.
 * @module controllers/TenantController
 * @author Elsa Gas Wikström
 * @version 1.0.0
 */

import { logger } from "../config/winston.js";
import { TenantModel } from "../models/TenantModel.js";
import { ApartmentModel } from "../models/ApartmentModel.js";
import { publishEvent } from "../config/rabbitmq.js";

/**
 * Encapsulates a controller for Tenant.
 */
export class TenantController {
  /**
   * Loads a tenant document by ID and attaches it to req.doc.
   */
  async loadTenantDocument(req, res, next, id) {
    try {
      logger.silly("Loading tenant document", { id });
      const tenantDoc = await TenantModel.findById(id);
      if (!tenantDoc) {
        const error = new Error("The tenant you requested does not exist.");
        error.status = 404;
        throw error;
      }
      req.doc = tenantDoc;
      logger.silly("Loaded tenant document", { id });
      next();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Lists all tenants with populated apartment details.
   */
  async index(req, res, next) {
    try {
      logger.silly("Loading all TenantModel documents");
      const tenants = await TenantModel.find().populate("apartment");
      logger.silly("Loaded all TenantModel documents");
      res.json(tenants);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Shows a single tenant with populated apartment details.
   */
  async show(req, res, next) {
    try {
      await req.doc.populate("apartment");
      res.json(req.doc);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Creates a new tenant and binds to apartment.
   * Apartment binding happens during creation, not after.
   */
  async create(req, res, next) {
    try {
      const { apartmentId, name, contactInfo, rent, startDate } = req.body;

      // Validate required fields
      if (!apartmentId || !name || !contactInfo || !rent || !startDate) {
        const error = new Error(
          "Missing required fields: apartmentId, name, contactInfo, rent, startDate"
        );
        error.status = 400;
        throw error;
      }

      // Validate that apartment exists
      logger.silly("Validating apartment exists", { apartmentId });
      const apartment = await ApartmentModel.findById(apartmentId);
      if (!apartment) {
        const error = new Error("The apartment you specified does not exist.");
        error.status = 404;
        throw error;
      }

      logger.silly("Creating new tenant document with apartment binding", {
        body: req.body,
      });
      const tenant = await TenantModel.create({
        apartment: apartmentId,
        name,
        contactInfo,
        rent,
        startDate,
      });

      // Populate apartment details in response
      await tenant.populate("apartment");

      logger.silly("Created new tenant document");
      await publishEvent("tenant.created", tenant.toObject());
      res.status(201).json(tenant);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Updates a tenant and populates apartment details in response.
   */
  async update(req, res, next) {
    try {
      logger.silly("Updating tenant document", {
        id: req.doc.id,
        body: req.body,
      });
      Object.assign(req.doc, req.body);
      await req.doc.save();
      await req.doc.populate("apartment");
      logger.silly("Updated tenant document", { id: req.doc.id });
      await publishEvent("tenant.updated", req.doc.toObject());
      res.json(req.doc);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes a tenant.
   */
  async delete(req, res, next) {
    try {
      logger.silly("Deleting tenant document", { id: req.doc.id });
      await req.doc.deleteOne();
      logger.silly("Deleted tenant document", { id: req.doc.id });
      await publishEvent("tenant.deleted", { id: req.doc.id });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}
