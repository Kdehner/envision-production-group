// strapi-cms/src/api/sku-admin/routes/sku-admin.ts

/**
 * SKU Admin Routes for Strapi v5
 * Administrative endpoints for SKU management
 */

export default {
  routes: [
    {
      method: "GET",
      path: "/sku-admin/preview",
      handler: "sku-admin.preview",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/sku-admin/statistics",
      handler: "sku-admin.statistics",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/sku-admin/validate",
      handler: "sku-admin.validate",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/sku-admin/reset-sequence",
      handler: "sku-admin.resetSequence",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/sku-admin/sequences",
      handler: "sku-admin.sequences",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/sku-admin/toggle-auto-generation",
      handler: "sku-admin.toggleAutoGeneration",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/sku-admin/auto-generation-status",
      handler: "sku-admin.autoGenerationStatus",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
