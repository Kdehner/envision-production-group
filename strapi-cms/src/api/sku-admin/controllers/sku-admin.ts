// strapi-cms/src/api/sku-admin/controllers/sku-admin.ts

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::equipment-instance.equipment-instance",
  ({ strapi }) => ({
    /**
     * Preview what the next SKU would be for a brand/category combination
     * GET /api/sku-admin/preview?category=LT&brand=CHV
     */
    async preview(ctx: any) {
      try {
        const { category, brand } = ctx.query;

        if (!category || !brand) {
          return ctx.badRequest("Category and brand parameters are required");
        }

        const equipmentInstanceService = strapi.service(
          "api::equipment-instance.equipment-instance"
        );
        const previewSKU = await equipmentInstanceService.previewSKU(
          category,
          brand
        );

        ctx.send({
          success: true,
          data: {
            nextSKU: previewSKU,
            category,
            brand,
            timestamp: new Date().toISOString(),
          },
        });
      } catch (error) {
        strapi.log.error("SKU preview failed:", error);
        ctx.badRequest(`SKU preview failed: ${error.message}`);
      }
    },

    /**
     * Get SKU usage statistics
     * GET /api/sku-admin/statistics
     */
    async statistics(ctx: any) {
      try {
        const equipmentInstanceService = strapi.service(
          "api::equipment-instance.equipment-instance"
        );
        const stats = await equipmentInstanceService.getSKUStatistics();

        ctx.send({
          success: true,
          data: stats,
        });
      } catch (error) {
        strapi.log.error("Failed to get SKU statistics:", error);
        ctx.badRequest(`Failed to get SKU statistics: ${error.message}`);
      }
    },

    /**
     * Validate a manual SKU without creating an instance
     * POST /api/sku-admin/validate
     * Body: { sku: "CUSTOM-SKU-001" }
     */
    async validate(ctx: any) {
      const { sku } = ctx.request.body;

      try {
        if (!sku) {
          return ctx.badRequest("SKU is required");
        }

        const equipmentInstanceService = strapi.service(
          "api::equipment-instance.equipment-instance"
        );
        await equipmentInstanceService.validateManualSKU(sku);

        ctx.send({
          success: true,
          message: "SKU is valid and available",
          data: {
            sku: sku.trim().toUpperCase(),
            isAvailable: true,
          },
        });
      } catch (error) {
        ctx.send({
          success: false,
          message: error.message,
          data: {
            sku: sku ? sku.trim().toUpperCase() : null,
            isAvailable: false,
          },
        });
      }
    },

    /**
     * Reset sequence for a brand/category combination (admin only)
     * POST /api/sku-admin/reset-sequence
     * Body: { category: "LT", brand: "CHV", newSequence: 1 }
     */
    async resetSequence(ctx: any) {
      try {
        const { category, brand, newSequence } = ctx.request.body;

        if (!category || !brand || typeof newSequence !== "number") {
          return ctx.badRequest(
            "Category, brand, and newSequence are required"
          );
        }

        if (newSequence < 1 || newSequence > 99999) {
          return ctx.badRequest("New sequence must be between 1 and 99999");
        }

        // Find existing sequence record
        const sequenceRecord = await strapi.db
          .query("api::sku-sequence.sku-sequence")
          .findOne({
            where: {
              categoryPrefix: category,
              brandPrefix: brand,
            },
          });

        if (!sequenceRecord) {
          return ctx.notFound(
            `Sequence record not found for ${category}-${brand}`
          );
        }

        // Update sequence
        await strapi.db.query("api::sku-sequence.sku-sequence").update({
          where: { id: sequenceRecord.id },
          data: {
            currentSequence: newSequence,
            lastUsed: new Date(),
          },
        });

        strapi.log.info(
          `Sequence reset for ${category}-${brand}: ${sequenceRecord.currentSequence} → ${newSequence}`
        );

        ctx.send({
          success: true,
          message: `Sequence reset successfully for ${category}-${brand}`,
          data: {
            category,
            brand,
            oldSequence: sequenceRecord.currentSequence,
            newSequence,
            nextSKU: `EPG-${category}-${brand}-${newSequence.toString().padStart(5, "0")}`,
          },
        });
      } catch (error) {
        strapi.log.error("Failed to reset sequence:", error);
        ctx.badRequest(`Failed to reset sequence: ${error.message}`);
      }
    },

    /**
     * Get all sequence records for admin management
     * GET /api/sku-admin/sequences
     */
    async sequences(ctx: any) {
      try {
        const sequences = await strapi.db
          .query("api::sku-sequence.sku-sequence")
          .findMany({
            orderBy: [{ categoryPrefix: "asc" }, { brandPrefix: "asc" }],
          });

        // Enrich with category and brand names
        const enrichedSequences = await Promise.all(
          sequences.map(async (seq: any) => {
            const category = await strapi.db
              .query("api::equipment-category.equipment-category")
              .findOne({
                where: { skuPrefix: seq.categoryPrefix },
                select: ["name"],
              });

            const brand = await strapi.db
              .query("api::brand-prefix.brand-prefix")
              .findOne({
                where: { prefix: seq.brandPrefix },
                select: ["brandName"],
              });

            return {
              ...seq,
              categoryName: category?.name || "Unknown",
              brandName: brand?.brandName || "Unknown",
              nextSKU: `EPG-${seq.categoryPrefix}-${seq.brandPrefix}-${seq.currentSequence.toString().padStart(5, "0")}`,
              remaining: 99999 - seq.currentSequence,
            };
          })
        );

        ctx.send({
          success: true,
          data: {
            sequences: enrichedSequences,
            totalSequences: enrichedSequences.length,
          },
        });
      } catch (error) {
        strapi.log.error("Failed to get sequences:", error);
        ctx.badRequest(`Failed to get sequences: ${error.message}`);
      }
    },

    /**
     * Toggle global auto-generation setting
     * POST /api/sku-admin/toggle-auto-generation
     * Body: { enabled: true/false }
     */
    async toggleAutoGeneration(ctx: any) {
      try {
        const { enabled } = ctx.request.body;

        if (typeof enabled !== "boolean") {
          return ctx.badRequest("enabled parameter must be true or false");
        }

        // Update or create system setting
        const existingSetting = await strapi.db
          .query("api::system-setting.system-setting")
          .findOne({
            where: { key: "disable_auto_sku_generation" },
          });

        const settingValue = enabled ? "false" : "true"; // Note: inverted logic for "disable"

        if (existingSetting) {
          await strapi.db.query("api::system-setting.system-setting").update({
            where: { id: existingSetting.id },
            data: { value: settingValue },
          });
        } else {
          await strapi.db.query("api::system-setting.system-setting").create({
            data: {
              key: "disable_auto_sku_generation",
              value: settingValue,
              description:
                "Disable automatic SKU generation for new Equipment Instances",
              category: "SKU Generation",
              dataType: "boolean",
            },
          });
        }

        strapi.log.info(
          `Auto SKU generation ${enabled ? "enabled" : "disabled"}`
        );

        ctx.send({
          success: true,
          message: `Auto SKU generation ${enabled ? "enabled" : "disabled"}`,
          data: {
            autoGenerationEnabled: enabled,
            timestamp: new Date().toISOString(),
          },
        });
      } catch (error) {
        strapi.log.error("Failed to toggle auto-generation:", error);
        ctx.badRequest(`Failed to toggle auto-generation: ${error.message}`);
      }
    },

    /**
     * Get current auto-generation status
     * GET /api/sku-admin/auto-generation-status
     */
    async autoGenerationStatus(ctx: any) {
      try {
        const equipmentInstanceService = strapi.service(
          "api::equipment-instance.equipment-instance"
        );
        const isDisabled =
          await equipmentInstanceService.isAutoGenerationDisabled();

        ctx.send({
          success: true,
          data: {
            autoGenerationEnabled: !isDisabled,
            isDisabled,
            timestamp: new Date().toISOString(),
          },
        });
      } catch (error) {
        strapi.log.error("Failed to get auto-generation status:", error);
        ctx.badRequest(
          `Failed to get auto-generation status: ${error.message}`
        );
      }
    },
  })
);
