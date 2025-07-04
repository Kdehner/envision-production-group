// strapi-app/api/equipment-item/models/equipment-item.js
"use strict";

console.log("🔧 DEBUG: Loading equipment-item model with lifecycle...");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async beforeCreate(data) {
      console.log("🔄 DEBUG: BEFORE CREATE TRIGGERED (v3 format)!");
      console.log("📝 DEBUG: Data received:", JSON.stringify(data, null, 2));

      try {
        // Only generate SKU if not provided or empty
        if (!data.sku || data.sku.trim() === "") {
          console.log(
            "🏷️  DEBUG: No SKU provided, generating automatically..."
          );

          // Get the SKU generator service from the inventory-manager plugin
          const skuGenerator =
            strapi.plugins["inventory-manager"].services["sku-generator"];

          if (!skuGenerator) {
            console.error("❌ DEBUG: SKU Generator service not found");
            console.error(
              "❌ DEBUG: Available plugins:",
              Object.keys(strapi.plugins || {})
            );
            if (strapi.plugins["inventory-manager"]) {
              console.error(
                "❌ DEBUG: Available services:",
                Object.keys(strapi.plugins["inventory-manager"].services || {})
              );
            }
            throw new Error("SKU Generator service not available");
          }

          console.log("✅ DEBUG: SKU Generator service found");

          // Generate the SKU
          const generatedSku = await skuGenerator.generateSKU(data);
          console.log(`🏷️  DEBUG: Generated SKU: ${generatedSku}`);

          // Check if SKU already exists (safety check)
          const skuExists = await skuGenerator.skuExists(generatedSku);
          if (skuExists) {
            console.error(
              `❌ DEBUG: Generated SKU ${generatedSku} already exists`
            );
            throw new Error(`Generated SKU ${generatedSku} already exists`);
          }

          // Assign the generated SKU
          data.sku = generatedSku;
          console.log(`✅ DEBUG: Generated and assigned SKU: ${generatedSku}`);
        } else {
          console.log(`ℹ️  DEBUG: Using provided SKU: ${data.sku}`);
        }
      } catch (error) {
        console.error("❌ DEBUG: Error in beforeCreate lifecycle:", error);
        throw error; // Re-throw to prevent creation
      }
    },

    async afterCreate(result, data) {
      console.log("✅ DEBUG: AFTER CREATE TRIGGERED (v3 format)!");
      console.log(`📦 DEBUG: Created: ${result.name} with SKU: ${result.sku}`);
    },

    async beforeUpdate(params, data) {
      console.log("🔄 DEBUG: BEFORE UPDATE TRIGGERED (v3 format)!");

      try {
        // Check if SKU is being modified
        if (data.sku !== undefined) {
          // Get current item to compare
          const currentItem = await strapi.services["equipment-item"].findOne({
            id: params.id || params.where.id,
          });

          if (currentItem && currentItem.sku && currentItem.sku !== data.sku) {
            console.warn(
              `⚠️  DEBUG: Attempting to change SKU from "${currentItem.sku}" to "${data.sku}"`
            );

            // Validate new SKU
            const skuGenerator =
              strapi.plugins["inventory-manager"].services["sku-generator"];
            if (skuGenerator) {
              if (!skuGenerator.validateSKU(data.sku)) {
                throw new Error(`Invalid SKU format: "${data.sku}"`);
              }

              const skuExists = await skuGenerator.skuExists(
                data.sku,
                currentItem.id
              );
              if (skuExists) {
                throw new Error(`SKU "${data.sku}" already exists`);
              }
            }
          }
        }
      } catch (error) {
        console.error("❌ DEBUG: Error in beforeUpdate lifecycle:", error);
        throw error;
      }
    },

    async afterUpdate(result, params, data) {
      console.log("✅ DEBUG: AFTER UPDATE TRIGGERED (v3 format)!");
      console.log(`📦 DEBUG: Updated: ${result.name} (SKU: ${result.sku})`);
    },

    async beforeDelete(params) {
      console.log("🗑️  DEBUG: BEFORE DELETE TRIGGERED (v3 format)!");

      try {
        const item = await strapi.services["equipment-item"].findOne({
          id: params.id || params.where.id,
        });

        if (item) {
          console.log(`🗑️  DEBUG: Deleting: ${item.name} (SKU: ${item.sku})`);
        }
      } catch (error) {
        console.error("❌ DEBUG: Error in beforeDelete lifecycle:", error);
        throw error;
      }
    },

    async afterDelete(result, params) {
      console.log("✅ DEBUG: AFTER DELETE TRIGGERED (v3 format)!");
      if (result) {
        console.log(`🗑️  DEBUG: Deleted: ${result.name} (SKU: ${result.sku})`);
      }
    },
  },
};

console.log("✅ DEBUG: Equipment-item model with lifecycle loaded");
