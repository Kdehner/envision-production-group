module.exports = {
  routes: [
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
  ],
};
