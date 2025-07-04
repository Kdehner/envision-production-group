// strapi-app/plugins/inventory-manager/controllers/sku.js
"use strict";

console.log("🔧 Loading SKU controller...");

module.exports = {
  /**
   * Get all category prefixes - SIMPLE TEST METHOD
   * GET /inventory-manager/sku/categories
   */
  async getCategoryPrefixes(ctx) {
    console.log("🔧 SERVER: getCategoryPrefixes called");
    try {
      ctx.send({
        data: {
          lighting: "LT",
          audio: "AU",
          power: "PW",
          staging: "ST",
          effects: "EF",
        },
        message: "Category prefixes retrieved successfully",
      });
    } catch (error) {
      console.error("❌ SERVER: Error getting category prefixes:", error);
      ctx.badRequest("Failed to get category prefixes", {
        error: error.message,
      });
    }
  },

  /**
   * Get all brand prefixes - SIMPLE TEST METHOD
   * GET /inventory-manager/sku/brands
   */
  async getBrandPrefixes(ctx) {
    console.log("🔧 SERVER: getBrandPrefixes called");
    try {
      ctx.send({
        data: [
          { brandName: "chauvet", prefix: "CH", category: "lighting" },
          { brandName: "shure", prefix: "SH", category: "audio" },
        ],
        message: "Brand prefixes retrieved successfully",
      });
    } catch (error) {
      console.error("❌ SERVER: Error getting brand prefixes:", error);
      ctx.badRequest("Failed to get brand prefixes", { error: error.message });
    }
  },

  /**
   * POST /inventory-manager/sku/initialize-brands
   */
  async initializeBrands(ctx) {
    console.log("🔧 SERVER: initializeBrands called");
    try {
      console.log("🔄 Initializing default brand prefixes...");

      const skuGenerator =
        strapi.plugins["inventory-manager"].services["sku-generator"];
      if (!skuGenerator) {
        console.log("❌ SERVER: SKU Generator service not available");
        return ctx.badRequest("SKU Generator service not available");
      }

      console.log(
        "✅ SERVER: SKU Generator found, calling initializeDefaultBrands..."
      );
      const result = await skuGenerator.initializeDefaultBrands();
      console.log("✅ SERVER: Initialization complete:", result);

      ctx.send({
        data: result,
        message: `Brand initialization complete: ${result.created} created, ${result.skipped} skipped`,
      });
    } catch (error) {
      console.error("❌ SERVER: Error initializing brands:", error);
      ctx.badRequest("Failed to initialize brands", { error: error.message });
    }
  },

  /**
   * Placeholder methods for other routes
   */
  async addBrandPrefix(ctx) {
    console.log("🔧 SERVER: addBrandPrefix called");
    ctx.send({ message: "Not implemented yet" });
  },

  async updateBrandPrefix(ctx) {
    console.log("🔧 SERVER: updateBrandPrefix called");
    ctx.send({ message: "Not implemented yet" });
  },

  async deleteBrandPrefix(ctx) {
    console.log("🔧 SERVER: deleteBrandPrefix called");
    ctx.send({ message: "Not implemented yet" });
  },
};

console.log("✅ SKU controller loaded");
