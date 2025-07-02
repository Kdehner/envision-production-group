"use strict";

/**
 * Equipment controller for inventory management API endpoints
 */

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * Get equipment statistics
   */
  async statistics(ctx) {
    try {
      const stats = await strapi.plugins[
        "inventory-manager"
      ].services.equipment.getStatistics();
      ctx.send(stats);
    } catch (error) {
      ctx.badRequest("Error fetching statistics", { error: error.message });
    }
  },

  /**
   * Search equipment by SKU
   */
  async searchBySku(ctx) {
    const { sku } = ctx.params;

    try {
      const equipment = await strapi.plugins[
        "inventory-manager"
      ].services.equipment.findBySku(sku);

      if (!equipment) {
        return ctx.notFound("Equipment not found");
      }

      const sanitized = sanitizeEntity(equipment, {
        model: strapi.models["equipment-item"],
      });

      ctx.send(sanitized);
    } catch (error) {
      ctx.badRequest("Error searching equipment", { error: error.message });
    }
  },

  /**
   * Update equipment status
   */
  async updateStatus(ctx) {
    const { id } = ctx.params;
    const { status } = ctx.request.body;

    if (
      !status ||
      !["Available", "Rented", "Maintenance", "Damaged", "Retired"].includes(
        status
      )
    ) {
      return ctx.badRequest("Invalid status provided");
    }

    try {
      const equipment = await strapi.plugins[
        "inventory-manager"
      ].services.equipment.updateStatus(id, status, ctx.state.user?.id);

      const sanitized = sanitizeEntity(equipment, {
        model: strapi.models["equipment-item"],
      });

      ctx.send(sanitized);
    } catch (error) {
      ctx.badRequest("Error updating equipment status", {
        error: error.message,
      });
    }
  },

  /**
   * Check equipment availability
   */
  async checkAvailability(ctx) {
    const { id } = ctx.params;
    const { startDate, endDate } = ctx.query;

    try {
      const availability = await strapi.plugins[
        "inventory-manager"
      ].services.equipment.checkAvailability(
        id,
        startDate ? new Date(startDate) : null,
        endDate ? new Date(endDate) : null
      );

      ctx.send(availability);
    } catch (error) {
      ctx.badRequest("Error checking availability", { error: error.message });
    }
  },
};
