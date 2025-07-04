// strapi-app/plugins/inventory-manager/controllers/equipment.js
"use strict";

/**
 * Equipment controller for inventory management API endpoints
 * Extended with SKU generation capabilities
 */

const { sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * Get equipment statistics (EXISTING METHOD - keep as is)
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
   * Search equipment by SKU (EXISTING METHOD - keep as is)
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
   * Update equipment status (EXISTING METHOD - keep as is)
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
   * Check equipment availability (EXISTING METHOD - keep as is)
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

  // NEW METHODS for SKU generation

  /**
   * Generate SKU for equipment data
   * POST /inventory-manager/equipment/generate-sku
   */
  async generateSku(ctx) {
    try {
      const equipmentData = ctx.request.body;

      console.log("🔧 SERVER: generateSku called with:", equipmentData.name);

      if (!equipmentData.name) {
        return ctx.badRequest("Equipment name is required");
      }

      const skuGenerator =
        strapi.plugins["inventory-manager"].services["sku-generator"];
      if (!skuGenerator) {
        console.log("❌ SERVER: SKU Generator service not available");
        return ctx.badRequest("SKU Generator service not available");
      }

      const sku = await skuGenerator.generateSKU(equipmentData);

      ctx.send({
        data: {
          sku: sku,
          equipment: equipmentData,
        },
        message: `SKU generated: ${sku}`,
      });
    } catch (error) {
      console.error("❌ SERVER: Error generating SKU:", error);
      ctx.badRequest("Failed to generate SKU", { error: error.message });
    }
  },

  /**
   * Validate SKU
   * POST /inventory-manager/equipment/validate-sku
   */
  async validateSku(ctx) {
    try {
      const { sku, excludeId } = ctx.request.body;

      console.log(`🔧 SERVER: validateSku called with: ${sku}`);

      if (!sku) {
        return ctx.badRequest("SKU is required");
      }

      const skuGenerator =
        strapi.plugins["inventory-manager"].services["sku-generator"];
      if (!skuGenerator) {
        return ctx.badRequest("SKU Generator service not available");
      }

      const isValid = skuGenerator.validateSKU(sku);
      const exists = await skuGenerator.skuExists(sku, excludeId);

      ctx.send({
        data: {
          sku: sku,
          isValid: isValid,
          exists: exists,
          canUse: isValid && !exists,
          format: "EPG-[CATEGORY]-[BRAND]-[NUMBER]",
          example: "EPG-LT-CH-001",
        },
        message: `SKU validation complete`,
      });
    } catch (error) {
      console.error("❌ SERVER: Error validating SKU:", error);
      ctx.badRequest("Failed to validate SKU", { error: error.message });
    }
  },

  /**
   * Get SKU mappings
   * GET /inventory-manager/sku/mappings
   */
  async getSkuMappings(ctx) {
    try {
      console.log("🔧 SERVER: getSkuMappings called");

      const skuGenerator =
        strapi.plugins["inventory-manager"].services["sku-generator"];
      if (!skuGenerator) {
        return ctx.badRequest("SKU Generator service not available");
      }

      const categories = skuGenerator.getAllCategoryPrefixes();
      const brands = await skuGenerator.getBrandPrefixMapping();

      ctx.send({
        data: {
          categories: categories,
          brands: brands,
          format: "EPG-[CATEGORY]-[BRAND]-[NUMBER]",
          example: "EPG-LT-CH-001",
        },
        message: "SKU mappings retrieved successfully",
      });
    } catch (error) {
      console.error("❌ SERVER: Error getting SKU mappings:", error);
      ctx.badRequest("Failed to get SKU mappings", { error: error.message });
    }
  },

  /**
   * Bulk generate SKUs for existing equipment
   * POST /inventory-manager/equipment/bulk-generate-skus
   */
  async bulkGenerateSkus(ctx) {
    try {
      console.log("🔧 SERVER: bulkGenerateSkus called");

      const skuGenerator =
        strapi.plugins["inventory-manager"].services["sku-generator"];
      if (!skuGenerator) {
        return ctx.badRequest("SKU Generator service not available");
      }

      // Find equipment without SKUs
      const equipmentWithoutSkus = await strapi.query("equipment-item").find(
        {
          _limit: -1,
          _where: {
            _or: [{ sku_null: true }, { sku: "" }, { sku_ncontains: "EPG-" }],
          },
        },
        ["equipment_category"]
      );

      console.log(`📦 Found ${equipmentWithoutSkus.length} items needing SKUs`);

      const results = [];

      for (const equipment of equipmentWithoutSkus) {
        try {
          const oldSku = equipment.sku;
          const newSku = await skuGenerator.generateSKU(equipment);

          // Update the equipment with new SKU
          await strapi
            .query("equipment-item")
            .update({ id: equipment.id }, { sku: newSku });

          results.push({
            id: equipment.id,
            name: equipment.name,
            oldSku: oldSku,
            newSku: newSku,
            status: "success",
          });

          console.log(`✅ Generated SKU for ${equipment.name}: ${newSku}`);
        } catch (error) {
          console.error(
            `❌ Failed to generate SKU for ${equipment.name}:`,
            error
          );
          results.push({
            id: equipment.id,
            name: equipment.name,
            oldSku: equipment.sku,
            newSku: null,
            status: "error",
            error: error.message,
          });
        }
      }

      const successCount = results.filter((r) => r.status === "success").length;
      const errorCount = results.filter((r) => r.status === "error").length;

      ctx.send({
        data: {
          results: results,
          summary: {
            total: results.length,
            successful: successCount,
            failed: errorCount,
          },
        },
        message: `Bulk SKU generation complete: ${successCount} successful, ${errorCount} failed`,
      });
    } catch (error) {
      console.error("❌ SERVER: Error in bulk SKU generation:", error);
      ctx.badRequest("Failed to bulk generate SKUs", { error: error.message });
    }
  },
};
