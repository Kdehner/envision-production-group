// strapi-app/plugins/inventory-manager/services/equipment.js
"use strict";

/**
 * Equipment service for Inventory Manager plugin
 * Enhanced with SKU generation capabilities
 */

module.exports = {
  /**
   * Get equipment statistics for dashboard
   * @returns {Promise<Object>} Equipment statistics
   */
  async getStatistics() {
    try {
      console.log("📊 Fetching equipment statistics...");

      // Get total equipment count
      const totalEquipment = await strapi.query("equipment-item").count();

      // Get equipment by status
      const availableCount = await strapi.query("equipment-item").count({
        status: "Available",
      });

      const rentedCount = await strapi.query("equipment-item").count({
        status: "Rented",
      });

      const maintenanceCount = await strapi.query("equipment-item").count({
        status: "Maintenance",
      });

      const damagedCount = await strapi.query("equipment-item").count({
        status: "Damaged",
      });

      // Get equipment by category
      const categories = await strapi.query("equipment-category").find();
      const categoryStats = [];

      for (const category of categories) {
        const count = await strapi.query("equipment-item").count({
          equipment_category: category.id,
        });

        categoryStats.push({
          name: category.name,
          count: count,
          slug: category.slug,
        });
      }

      // Calculate utilization rate
      const utilizationRate =
        totalEquipment > 0
          ? Math.round((rentedCount / totalEquipment) * 100)
          : 0;

      const stats = {
        total: totalEquipment,
        available: availableCount,
        rented: rentedCount,
        maintenance: maintenanceCount,
        damaged: damagedCount,
        utilizationRate: utilizationRate,
        categories: categoryStats,
        lastUpdated: new Date().toISOString(),
      };

      console.log("✅ Statistics calculated:", stats);
      return stats;
    } catch (error) {
      console.error("❌ Error fetching statistics:", error);
      throw error;
    }
  },

  /**
   * Search equipment by SKU
   * @param {string} sku - SKU to search for
   * @returns {Promise<Object|null>} Equipment item or null
   */
  async searchBySku(sku) {
    try {
      console.log(`🔍 Searching for equipment with SKU: ${sku}`);

      if (!sku || sku.trim() === "") {
        throw new Error("SKU is required");
      }

      const equipment = await strapi.query("equipment-item").findOne({
        sku: sku.trim(),
      });

      if (!equipment) {
        console.log(`❌ No equipment found with SKU: ${sku}`);
        return null;
      }

      // Populate category information
      const populatedEquipment = await strapi.query("equipment-item").findOne(
        {
          id: equipment.id,
        },
        ["equipment_category", "mainImage"]
      );

      console.log(`✅ Found equipment: ${populatedEquipment.name}`);
      return populatedEquipment;
    } catch (error) {
      console.error("❌ Error searching by SKU:", error);
      throw error;
    }
  },

  /**
   * Update equipment status
   * @param {number} id - Equipment ID
   * @param {string} status - New status
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Updated equipment
   */
  async updateStatus(id, status, notes = null) {
    try {
      console.log(`🔄 Updating equipment ${id} status to: ${status}`);

      // Validate status
      const validStatuses = [
        "Available",
        "Rented",
        "Maintenance",
        "Damaged",
        "Retired",
      ];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status: ${status}`);
      }

      const updateData = { status };
      if (notes) {
        updateData.notes = notes;
      }

      const updated = await strapi
        .query("equipment-item")
        .update({ id }, updateData);

      if (!updated) {
        throw new Error(`Equipment with ID ${id} not found`);
      }

      console.log(`✅ Status updated for: ${updated.name}`);
      return updated;
    } catch (error) {
      console.error("❌ Error updating status:", error);
      throw error;
    }
  },

  /**
   * Check equipment availability
   * @param {number} id - Equipment ID
   * @param {Date} startDate - Rental start date
   * @param {Date} endDate - Rental end date
   * @returns {Promise<Object>} Availability information
   */
  async checkAvailability(id, startDate = null, endDate = null) {
    try {
      console.log(`📅 Checking availability for equipment ${id}`);

      const equipment = await strapi.query("equipment-item").findOne({ id });

      if (!equipment) {
        throw new Error(`Equipment with ID ${id} not found`);
      }

      // Basic availability check
      const isAvailable =
        equipment.status === "Available" && equipment.availableQuantity > 0;

      const availability = {
        equipmentId: id,
        name: equipment.name,
        sku: equipment.sku,
        status: equipment.status,
        isAvailable: isAvailable,
        totalQuantity: equipment.quantity,
        availableQuantity: equipment.availableQuantity,
        checkedAt: new Date().toISOString(),
      };

      // If date range provided, could check against future bookings
      if (startDate && endDate) {
        availability.requestedPeriod = {
          start: startDate,
          end: endDate,
        };
        // TODO: Check against booking system when implemented
      }

      console.log(`✅ Availability checked:`, availability);
      return availability;
    } catch (error) {
      console.error("❌ Error checking availability:", error);
      throw error;
    }
  },

  /**
   * Generate new SKU for equipment (manual trigger)
   * @param {Object} equipmentData - Equipment data
   * @returns {Promise<string>} Generated SKU
   */
  async generateSku(equipmentData) {
    try {
      console.log("🏷️  Manual SKU generation requested");

      const skuGenerator =
        strapi.plugins["inventory-manager"].services["sku-generator"];
      if (!skuGenerator) {
        throw new Error("SKU Generator service not available");
      }

      return await skuGenerator.generateSKU(equipmentData);
    } catch (error) {
      console.error("❌ Error generating SKU:", error);
      throw error;
    }
  },

  /**
   * Validate SKU format
   * @param {string} sku - SKU to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateSku(sku) {
    try {
      const skuGenerator =
        strapi.plugins["inventory-manager"].services["sku-generator"];
      if (!skuGenerator) {
        throw new Error("SKU Generator service not available");
      }

      const isValid = skuGenerator.validateSKU(sku);
      const exists = await skuGenerator.skuExists(sku);

      return {
        sku: sku,
        isValid: isValid,
        exists: exists,
        format: "EPG-[CATEGORY]-[BRAND]-[NUMBER]",
      };
    } catch (error) {
      console.error("❌ Error validating SKU:", error);
      throw error;
    }
  },

  /**
   * Get SKU generation mappings (for admin interface)
   * @returns {Promise<Object>} SKU mappings
   */
  async getSkuMappings() {
    try {
      const skuGenerator =
        strapi.plugins["inventory-manager"].services["sku-generator"];
      if (!skuGenerator) {
        throw new Error("SKU Generator service not available");
      }

      const categories = skuGenerator.getAllCategoryPrefixes();
      const brands = await skuGenerator.getBrandPrefixMapping();

      return {
        categories: categories,
        brands: brands,
        format: "EPG-[CATEGORY]-[BRAND]-[NUMBER]",
        example: "EPG-LT-CH-001",
      };
    } catch (error) {
      console.error("❌ Error getting SKU mappings:", error);
      throw error;
    }
  },

  /**
   * Bulk generate SKUs for existing equipment (migration helper)
   * @returns {Promise<Array>} Results of SKU generation
   */
  async bulkGenerateSkus() {
    try {
      console.log("🔄 Starting bulk SKU generation...");

      // Find equipment without SKUs or with invalid SKUs
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
      const skuGenerator =
        strapi.plugins["inventory-manager"].services["sku-generator"];

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

      console.log(
        `🏁 Bulk SKU generation complete. ${
          results.filter((r) => r.status === "success").length
        } successful, ${
          results.filter((r) => r.status === "error").length
        } failed`
      );

      return results;
    } catch (error) {
      console.error("❌ Error in bulk SKU generation:", error);
      throw error;
    }
  },
};
