// strapi-app/plugins/inventory-manager/controllers/index.js
"use strict";

console.log("🔧 Loading controllers index...");

const equipment = require("./equipment");
const sku = require("./sku");

console.log("✅ Equipment controller loaded:", typeof equipment);
console.log("✅ SKU controller loaded:", typeof sku);

module.exports = {
  equipment,
  sku,
};

console.log("✅ Controllers index complete");
