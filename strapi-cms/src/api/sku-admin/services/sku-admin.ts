// strapi-cms/src/api/sku-admin/services/sku-admin.ts

/**
 * SKU Admin Service
 * Custom service for SKU management utilities
 */

export default () => ({
  /**
   * Get SKU statistics summary
   */
  async getStatisticsSummary() {
    const equipmentInstanceService = strapi.service(
      "api::equipment-instance.equipment-instance"
    );
    return await equipmentInstanceService.getSKUStatistics();
  },

  /**
   * Validate SKU format
   */
  async validateSKUFormat(sku: string): Promise<boolean> {
    const equipmentInstanceService = strapi.service(
      "api::equipment-instance.equipment-instance"
    );
    try {
      await equipmentInstanceService.validateManualSKU(sku);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Preview next SKU for category/brand
   */
  async previewNextSKU(
    categoryPrefix: string,
    brandPrefix: string
  ): Promise<string> {
    const equipmentInstanceService = strapi.service(
      "api::equipment-instance.equipment-instance"
    );
    return await equipmentInstanceService.previewSKU(
      categoryPrefix,
      brandPrefix
    );
  },
});
