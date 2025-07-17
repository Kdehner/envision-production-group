// employee-ops/src/lib/qr/index.ts

/**
 * EPG QR Code Library - Main Export
 * Clean, organized API for all QR-related functionality
 */

// Type exports
export type * from "./types";

// Configuration exports
export {
  getQRConfig,
  getQRDefaults,
  getQRUrlParams,
  validateQRConfig,
  getQRConfigSummary,
  useQRConfig,
  logQRConfig,
} from "./config";

// QR Generation exports
export {
  generateEquipmentQR,
  generatePrintableQR,
  generateThumbnailQR,
  generateMobileQR,
  getQRStats,
} from "./generator";

// URL Building exports
export {
  buildEmployeeEquipmentUrl,
  buildCustomerEquipmentUrl,
  buildStrapiEquipmentUrl,
  buildQREquipmentUrl,
  buildAssetLabelUrl,
  parseQRParams,
  analyzeQRUrl,
} from "./url-builders";

// Mobile Detection exports
export {
  isMobileDevice,
  isTabletDevice,
  hasTouchSupport,
  hasCameraSupport,
  getScreenSize,
  detectPlatform,
  detectBrowser,
  getDeviceInfo,
  shouldUseMobileQRInterface,
  getOptimalQRSize,
  supportsQRScanning,
  getQRInstructions,
  useDeviceDetection,
  detectDeviceFromHeaders,
  getQRDisplayClasses,
} from "./mobile-detection";

// Validation exports
export {
  validateQRContent,
  validateQRUrl,
  validateDocumentId,
  validateQRRequest,
  validateQROptions,
  sanitizeQRParams,
  getQRStats as getQRContentStats, // Alias to avoid confusion
} from "./validation";

// Convenience re-exports for common patterns
export { generateEquipmentQR as generateQR } from "./generator";

export { buildEmployeeEquipmentUrl as buildEquipmentUrl } from "./url-builders";

export { getDeviceInfo as detectDevice } from "./mobile-detection";

/**
 * Main QR utility class for complex operations
 */
export class EPGQRGenerator {
  private config: ReturnType<typeof import("./config").getQRConfig>;

  constructor() {
    this.config = require("./config").getQRConfig();
  }

  /**
   * Generate QR code with automatic device optimization
   */
  async generateOptimizedQR(
    documentId: string,
    deviceInfo?: ReturnType<typeof import("./mobile-detection").getDeviceInfo>
  ) {
    const { generateEquipmentQR } = await import("./generator");
    const { getOptimalQRSize } = await import("./mobile-detection");

    const device =
      deviceInfo ||
      (await import("./mobile-detection").then((m) => m.getDeviceInfo()));
    const optimalSize = getOptimalQRSize(device);

    return generateEquipmentQR(documentId, {
      size: optimalSize,
      format: device.isMobile ? "svg" : "dataurl",
      errorCorrectionLevel: this.config.errorCorrectionLevel,
    });
  }

  /**
   * Generate complete asset tag data
   */
  async generateAssetTag(equipment: {
    documentId: string;
    sku: string;
    model?: string;
    category?: string;
  }) {
    const { generatePrintableQR } = await import("./generator");

    const qrCode = await generatePrintableQR(equipment.documentId);

    return {
      qrCode,
      sku: equipment.sku,
      model: equipment.model,
      category: equipment.category,
      url: this.config.employeeBaseUrl + "/equipment/" + equipment.documentId,
      generatedAt: new Date().toISOString(),
    };
  }
}
