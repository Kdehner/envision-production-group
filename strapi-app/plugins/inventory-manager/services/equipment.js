"use strict";

/**
 * Equipment service for inventory management
 */

module.exports = {
  /**
   * Get equipment statistics for dashboard
   */
  async getStatistics() {
    const equipment = await strapi.query("equipment-item").find();

    return {
      total: equipment.length,
      available: equipment.filter((item) => item.status === "Available").length,
      rented: equipment.filter((item) => item.status === "Rented").length,
      maintenance: equipment.filter((item) => item.status === "Maintenance")
        .length,
      damaged: equipment.filter((item) => item.status === "Damaged").length,
    };
  },

  /**
   * Find equipment by SKU or QR code
   */
  async findBySku(sku) {
    return await strapi.query("equipment-item").findOne({ sku });
  },

  /**
   * Update equipment status with audit trail
   */
  async updateStatus(equipmentId, newStatus, userId = null) {
    const equipment = await strapi
      .query("equipment-item")
      .update({ id: equipmentId }, { status: newStatus, updatedBy: userId });

    // TODO: Create audit log entry
    // await strapi.query('equipment-transaction').create({
    //   equipment: equipmentId,
    //   action: 'StatusChange',
    //   previousStatus: equipment.status,
    //   newStatus: newStatus,
    //   user: userId,
    //   timestamp: new Date()
    // });

    return equipment;
  },

  /**
   * Check equipment availability for date range
   */
  async checkAvailability(equipmentId, startDate, endDate) {
    // TODO: Implement booking conflict checking
    const equipment = await strapi
      .query("equipment-item")
      .findOne({ id: equipmentId });

    if (!equipment) {
      return { available: false, reason: "Equipment not found" };
    }

    if (equipment.status !== "Available") {
      return {
        available: false,
        reason: `Equipment is currently ${equipment.status}`,
      };
    }

    // For now, just check if status is available
    // Later: Check against booking dates
    return {
      available: true,
      quantity: equipment.availableQuantity || equipment.quantity || 0,
    };
  },

  /**
   * Generate QR code data for equipment
   */
  generateQRData(equipment) {
    return JSON.stringify({
      type: "equipment",
      id: equipment.id,
      sku: equipment.sku,
      name: equipment.name,
    });
  },
};
