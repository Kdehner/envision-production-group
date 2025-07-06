// strapi-cms/src/api/equipment-instance/services/equipment-instance.ts

import { factories } from "@strapi/strapi";

export default factories.createCoreService(
  "api::equipment-instance.equipment-instance",
  ({ strapi }) => ({
    /**
     * Generate SKU for Equipment Instance
     * @param {Object} data - Equipment Instance data
     * @param {boolean} forceManual - Skip auto-generation even if enabled
     * @returns {Promise<string>} Generated SKU
     */
    async generateSKU(data: any, forceManual = false): Promise<string> {
      const { equipmentModel, brand, sku: manualSku } = data;

      // Check if manual SKU is provided
      if (manualSku && manualSku.trim()) {
        strapi.log.info(`Using manual SKU: ${manualSku}`);
        await this.validateManualSKU(manualSku);
        return manualSku.trim().toUpperCase();
      }

      // Check if auto-generation is disabled and no manual SKU provided
      if (forceManual || (await this.isAutoGenerationDisabled())) {
        throw new Error(
          "Auto SKU generation is disabled and no manual SKU provided"
        );
      }

      // Validate required relations exist
      if (!equipmentModel || !brand) {
        throw new Error(
          "Equipment Model and Brand are required for SKU generation"
        );
      }

      // Get category and brand information
      const modelData =
        await this.getEquipmentModelWithCategory(equipmentModel);
      const brandData = await this.getBrandData(brand);

      if (!modelData?.category?.skuPrefix) {
        throw new Error(
          "Equipment Model must have a valid category with SKU prefix"
        );
      }

      if (!brandData?.prefix) {
        throw new Error("Brand must have a valid 3-character prefix");
      }

      // Generate SKU with retry logic
      return await this.generateSKUWithRetry(
        modelData.category.skuPrefix,
        brandData.prefix,
        5 // max retries
      );
    },

    /**
     * Generate SKU with automatic retry on conflicts
     */
    async generateSKUWithRetry(
      categoryPrefix: string,
      brandPrefix: string,
      maxRetries = 5
    ): Promise<string> {
      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          const sequence = await this.getNextSequence(
            categoryPrefix,
            brandPrefix
          );
          const sku = this.formatSKU(categoryPrefix, brandPrefix, sequence);

          // Verify SKU is unique
          const exists = await this.skuExists(sku);
          if (!exists) {
            strapi.log.info(`Generated SKU: ${sku} (attempt ${attempt + 1})`);
            return sku;
          }

          strapi.log.warn(
            `SKU ${sku} already exists, retrying... (attempt ${attempt + 1})`
          );

          // If SKU exists, increment sequence and try again
          await this.incrementSequence(categoryPrefix, brandPrefix);
        } catch (error) {
          strapi.log.error(
            `SKU generation attempt ${attempt + 1} failed:`,
            error
          );

          if (attempt === maxRetries) {
            throw new Error(
              `Failed to generate unique SKU after ${maxRetries + 1} attempts: ${error.message}`
            );
          }
        }
      }

      throw new Error("Failed to generate SKU after all retries");
    },

    /**
     * Format SKU string
     */
    formatSKU(
      categoryPrefix: string,
      brandPrefix: string,
      sequence: number
    ): string {
      const paddedSequence = sequence.toString().padStart(5, "0");
      return `EPG-${categoryPrefix}-${brandPrefix}-${paddedSequence}`;
    },

    /**
     * Get next sequence number for brand/category combination
     */
    async getNextSequence(
      categoryPrefix: string,
      brandPrefix: string
    ): Promise<number> {
      // Check if sequence tracking record exists
      let sequenceRecord = await strapi.db
        .query("api::sku-sequence.sku-sequence")
        .findOne({
          where: {
            categoryPrefix,
            brandPrefix,
          },
        });

      if (!sequenceRecord) {
        // Create new sequence record starting at 1
        sequenceRecord = await strapi.db
          .query("api::sku-sequence.sku-sequence")
          .create({
            data: {
              categoryPrefix,
              brandPrefix,
              currentSequence: 1,
              publishedAt: new Date(),
            },
          });
        return 1;
      }

      return sequenceRecord.currentSequence;
    },

    /**
     * Increment sequence number for brand/category combination
     */
    async incrementSequence(
      categoryPrefix: string,
      brandPrefix: string
    ): Promise<number> {
      const sequenceRecord = await strapi.db
        .query("api::sku-sequence.sku-sequence")
        .findOne({
          where: {
            categoryPrefix,
            brandPrefix,
          },
        });

      if (!sequenceRecord) {
        throw new Error(
          `Sequence record not found for ${categoryPrefix}-${brandPrefix}`
        );
      }

      const newSequence = sequenceRecord.currentSequence + 1;

      // Check if we've exceeded 5-digit limit
      if (newSequence > 99999) {
        throw new Error(
          `Sequence limit exceeded for ${categoryPrefix}-${brandPrefix}. Maximum is 99999.`
        );
      }

      await strapi.db.query("api::sku-sequence.sku-sequence").update({
        where: { id: sequenceRecord.id },
        data: { currentSequence: newSequence },
      });

      return newSequence;
    },

    /**
     * Check if SKU already exists
     */
    async skuExists(sku: string): Promise<boolean> {
      const existing = await strapi.db
        .query("api::equipment-instance.equipment-instance")
        .findOne({
          where: { sku },
        });
      return !!existing;
    },

    /**
     * Validate manual SKU format and uniqueness
     */
    async validateManualSKU(sku: string): Promise<void> {
      const trimmedSku = sku.trim().toUpperCase();

      // Basic format validation (flexible for manual SKUs)
      if (!trimmedSku || trimmedSku.length < 3) {
        throw new Error("Manual SKU must be at least 3 characters long");
      }

      // Check for invalid characters
      if (!/^[A-Z0-9\-]+$/.test(trimmedSku)) {
        throw new Error(
          "Manual SKU can only contain uppercase letters, numbers, and hyphens"
        );
      }

      // Check uniqueness
      const exists = await this.skuExists(trimmedSku);
      if (exists) {
        throw new Error(`Manual SKU "${trimmedSku}" already exists`);
      }
    },

    /**
     * Get Equipment Model with Category data
     */
    async getEquipmentModelWithCategory(equipmentModelId: any) {
      // Handle both direct ID and relation object formats
      let modelId = equipmentModelId;

      // If it's a relation object with connect, extract the ID
      if (equipmentModelId && typeof equipmentModelId === "object") {
        if (equipmentModelId.connect) {
          modelId = Array.isArray(equipmentModelId.connect)
            ? equipmentModelId.connect[0]?.id ||
              equipmentModelId.connect[0]?.documentId
            : equipmentModelId.connect.id ||
              equipmentModelId.connect.documentId;
        } else if (equipmentModelId.id) {
          modelId = equipmentModelId.id;
        } else if (equipmentModelId.documentId) {
          modelId = equipmentModelId.documentId;
        }
      }

      if (!modelId) {
        throw new Error("Invalid equipment model reference");
      }

      return await strapi.db
        .query("api::equipment-model.equipment-model")
        .findOne({
          where: {
            [typeof modelId === "string" ? "documentId" : "id"]: modelId,
          },
          populate: {
            category: {
              select: ["skuPrefix", "name"],
            },
          },
        });
    },

    /**
     * Get Brand data
     */
    async getBrandData(brandId: any) {
      // Handle both direct ID and relation object formats
      let actualBrandId = brandId;

      // If it's a relation object with connect, extract the ID
      if (brandId && typeof brandId === "object") {
        if (brandId.connect) {
          actualBrandId = Array.isArray(brandId.connect)
            ? brandId.connect[0]?.id || brandId.connect[0]?.documentId
            : brandId.connect.id || brandId.connect.documentId;
        } else if (brandId.id) {
          actualBrandId = brandId.id;
        } else if (brandId.documentId) {
          actualBrandId = brandId.documentId;
        }
      }

      if (!actualBrandId) {
        throw new Error("Invalid brand reference");
      }

      return await strapi.db.query("api::brand-prefix.brand-prefix").findOne({
        where: {
          [typeof actualBrandId === "string" ? "documentId" : "id"]:
            actualBrandId,
        },
        select: ["prefix", "brandName"],
      });
    },

    /**
     * Check if auto-generation is disabled globally
     */
    async isAutoGenerationDisabled(): Promise<boolean> {
      // Check environment variable first
      const envSetting = process.env.DISABLE_AUTO_SKU_GENERATION;
      if (envSetting === "true" || envSetting === "1") {
        return true;
      }

      // Check database setting
      try {
        const setting = await strapi.db
          .query("api::system-setting.system-setting")
          .findOne({
            where: { key: "disable_auto_sku_generation" },
          });
        return setting?.value === "true" || setting?.value === true;
      } catch (error) {
        // Settings content type doesn't exist yet, default to enabled
        return false;
      }
    },

    /**
     * Preview SKU without creating
     */
    async previewSKU(
      categoryPrefix: string,
      brandPrefix: string
    ): Promise<string> {
      try {
        const sequence = await this.getNextSequence(
          categoryPrefix,
          brandPrefix
        );
        return this.formatSKU(categoryPrefix, brandPrefix, sequence);
      } catch (error) {
        strapi.log.error("SKU preview failed:", error);
        throw new Error(`Unable to preview SKU: ${error.message}`);
      }
    },

    /**
     * Get SKU statistics for reporting
     */
    async getSKUStatistics() {
      try {
        // Get all sequence records
        const sequences = await strapi.db
          .query("api::sku-sequence.sku-sequence")
          .findMany();

        // Get total equipment instances
        const totalInstances = await strapi.db
          .query("api::equipment-instance.equipment-instance")
          .count();

        return {
          totalInstances,
          sequencesByCategory: sequences.reduce((acc: any, seq: any) => {
            const key = seq.categoryPrefix;
            if (!acc[key]) acc[key] = [];
            acc[key].push({
              brand: seq.brandPrefix,
              currentSequence: seq.currentSequence,
              remaining: 99999 - seq.currentSequence,
            });
            return acc;
          }, {}),
          lastUpdated: new Date().toISOString(),
        };
      } catch (error) {
        strapi.log.error("Failed to get SKU statistics:", error);
        throw error;
      }
    },
  })
);
