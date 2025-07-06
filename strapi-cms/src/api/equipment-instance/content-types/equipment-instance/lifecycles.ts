// strapi-cms/src/api/equipment-instance/content-types/equipment-instance/lifecycles.ts

/**
 * Equipment Instance Lifecycle Hooks for Strapi v5
 * Handles automatic SKU generation and validation
 */

export default {
  /**
   * Before creating Equipment Instance
   * Generate SKU if not manually provided
   */
  async beforeCreate(event: any) {
    const { data } = event.params;

    try {
      // Debug logging to see the actual data structure
      strapi.log.info(
        "Equipment Instance data received:",
        JSON.stringify(data, null, 2)
      );

      // Skip SKU generation if SKU is already set (from previous lifecycle run)
      if (data.sku && data.sku.trim()) {
        strapi.log.info(`SKU already exists: ${data.sku}, skipping generation`);
        return;
      }

      // Check if SKU auto-generation should be skipped for this instance
      const forceManual = data.skipAutoSKU === true;

      // Get equipment instance service which has our SKU generation methods
      const equipmentInstanceService = strapi.service(
        "api::equipment-instance.equipment-instance"
      );

      // Generate SKU (handles manual override and auto-generation toggle)
      data.sku = await equipmentInstanceService.generateSKU(data, forceManual);

      strapi.log.info(
        `SKU assigned to new Equipment Instance: ${data.sku} ${forceManual ? "(manual override)" : "(auto-generated)"}`
      );
    } catch (error) {
      strapi.log.error("SKU generation failed:", error);
      strapi.log.error(
        "Data that caused the error:",
        JSON.stringify(data, null, 2)
      );
      throw new Error(`Failed to generate SKU: ${error.message}`);
    }
  },

  /**
   * Before updating Equipment Instance
   * Validate SKU changes and prevent conflicts
   */
  async beforeUpdate(event: any) {
    const { data, where } = event.params;

    // Only process if SKU is being changed
    if (!data.sku) {
      return;
    }

    try {
      // Get current instance to compare SKUs
      const currentInstance = await strapi.db
        .query("api::equipment-instance.equipment-instance")
        .findOne({
          where,
          select: ["sku"],
        });

      if (!currentInstance) {
        throw new Error("Equipment Instance not found");
      }

      // If SKU hasn't changed, no validation needed
      if (currentInstance.sku === data.sku.trim().toUpperCase()) {
        return;
      }

      // Validate the new SKU
      const equipmentInstanceService = strapi.service(
        "api::equipment-instance.equipment-instance"
      );
      await equipmentInstanceService.validateManualSKU(data.sku);

      // Ensure SKU is uppercase
      data.sku = data.sku.trim().toUpperCase();

      strapi.log.info(
        `SKU updated for Equipment Instance: ${currentInstance.sku} → ${data.sku}`
      );
    } catch (error) {
      strapi.log.error("SKU validation failed on update:", error);
      throw new Error(`SKU update failed: ${error.message}`);
    }
  },

  /**
   * After creating Equipment Instance
   * Update sequence counter and log creation
   */
  async afterCreate(event: any) {
    const { result } = event;

    try {
      // If this was an auto-generated SKU, update the sequence counter
      if (result.sku && result.sku.startsWith("EPG-")) {
        // Parse SKU to extract components
        const skuParts = result.sku.split("-");
        if (skuParts.length === 4 && skuParts[0] === "EPG") {
          const categoryPrefix = skuParts[1];
          const brandPrefix = skuParts[2];

          // Update the sequence record's lastUsed timestamp
          await strapi.db.query("api::sku-sequence.sku-sequence").updateMany({
            where: {
              categoryPrefix,
              brandPrefix,
            },
            data: {
              lastUsed: new Date(),
            },
          });
        }
      }

      strapi.log.info(
        `Equipment Instance created successfully with SKU: ${result.sku}`
      );
    } catch (error) {
      // Don't fail the creation if sequence update fails, just log it
      strapi.log.warn("Failed to update sequence lastUsed timestamp:", error);
    }
  },

  /**
   * Before deleting Equipment Instance
   * Log the deletion for audit purposes
   */
  async beforeDelete(event: any) {
    const { where } = event.params;

    try {
      const instance = await strapi.db
        .query("api::equipment-instance.equipment-instance")
        .findOne({
          where,
          select: ["sku", "equipmentStatus"],
          populate: {
            equipmentModel: {
              select: ["name"],
            },
          },
        });

      if (instance) {
        strapi.log.info(
          `Deleting Equipment Instance: ${instance.sku} (${instance.equipmentModel?.name || "Unknown Model"})`
        );

        // Optionally, you could implement soft delete here
        // or move to an audit table instead of hard delete
      }
    } catch (error) {
      strapi.log.warn("Failed to log Equipment Instance deletion:", error);
      // Don't block deletion if logging fails
    }
  },

  /**
   * After updating Equipment Instance
   * Log significant status changes
   */
  async afterUpdate(event: any) {
    const { result, params } = event;

    try {
      // Log status changes for tracking
      if (params.data.equipmentStatus) {
        strapi.log.info(
          `Equipment Instance ${result.sku} status changed to: ${result.equipmentStatus}`
        );

        // You could trigger additional workflows here:
        // - Send notifications for certain status changes
        // - Update maintenance schedules
        // - Trigger availability calculations
        // - Log to audit trail
      }
    } catch (error) {
      strapi.log.warn("Failed to process Equipment Instance update:", error);
      // Don't fail the update if post-processing fails
    }
  },
};
