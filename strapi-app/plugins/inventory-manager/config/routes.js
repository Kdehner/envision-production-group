// strapi-app/plugins/inventory-manager/config/routes.js
"use strict";

console.log("🔧 Loading inventory-manager routes...");

module.exports = {
  routes: [
    // Keep existing working routes
    {
      method: "GET",
      path: "/statistics",
      handler: "equipment.statistics",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/equipment/sku/:sku",
      handler: "equipment.searchBySku",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/equipment/:id/status",
      handler: "equipment.updateStatus",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/equipment/:id/availability",
      handler: "equipment.checkAvailability",
      config: {
        policies: [],
      },
    },

    // Test SKU routes - START SIMPLE
    {
      method: "GET",
      path: "/sku/categories",
      handler: "sku.getCategoryPrefixes",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/sku/brands",
      handler: "sku.getBrandPrefixes",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/sku/initialize-brands",
      handler: "sku.initializeBrands",
      config: {
        policies: [],
      },
    },
  ],
};

console.log("✅ Inventory-manager routes loaded");
