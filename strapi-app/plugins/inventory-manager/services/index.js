// services/index.js should look like this:
"use strict";

const equipment = require("./equipment");
const skuGenerator = require("./sku-generator");

module.exports = {
  equipment,
  "sku-generator": skuGenerator,
};
