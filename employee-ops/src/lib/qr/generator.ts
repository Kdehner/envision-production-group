// employee-ops/src/lib/qr/generator.ts

/**
 * QR Code Generation Utilities for EPG Equipment Management
 * Handles QR code generation for equipment instances with various formats and sizes
 */

import QRCode from "qrcode";
import type {
  QRCodeOptions,
  QRSize,
  QRFormat,
  QRErrorCorrection,
  QRColors,
  QRStats,
} from "./types";

/**
 * Predefined QR code sizes for different use cases
 */
const QR_SIZE_PRESETS: Record<QRSize, { width: number; margin: number }> = {
  small: { width: 100, margin: 1 }, // List view thumbnails
  medium: { width: 200, margin: 2 }, // Detail page display
  large: { width: 300, margin: 3 }, // Mobile scanning
  print: { width: 400, margin: 4 }, // High-res printing
} as const;

/**
 * Generate QR code for equipment instance
 */
export async function generateEquipmentQR(
  documentId: string,
  options: QRCodeOptions = {}
): Promise<string> {
  try {
    // Build the equipment URL
    const equipmentUrl = buildEquipmentUrl(documentId, true);

    // Set default options
    const qrOptions = {
      size: options.size || "medium",
      format: options.format || "svg",
      errorCorrectionLevel: options.errorCorrectionLevel || "M",
      ...options,
    };

    // Get size preset
    const sizePreset = QR_SIZE_PRESETS[qrOptions.size];

    // Configure QR code generation options
    const qrConfig: QRCode.QRCodeToStringOptions = {
      errorCorrectionLevel: qrOptions.errorCorrectionLevel,
      type: qrOptions.format === "svg" ? "svg" : "png",
      quality: 0.92,
      margin: qrOptions.margin || sizePreset.margin,
      color: {
        dark: qrOptions.color?.dark || "#000000",
        light: qrOptions.color?.light || "#FFFFFF",
      },
      width: sizePreset.width,
    };

    // Generate QR code
    if (qrOptions.format === "svg") {
      return await QRCode.toString(equipmentUrl, qrConfig);
    } else if (qrOptions.format === "dataurl") {
      return await QRCode.toDataURL(equipmentUrl, qrConfig);
    } else {
      // Return base64 PNG
      return await QRCode.toDataURL(equipmentUrl, qrConfig);
    }
  } catch (error) {
    console.error("QR Code generation failed:", error);
    throw new Error(
      `Failed to generate QR code: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Generate QR code specifically optimized for printing asset tags
 */
export async function generatePrintableQR(
  documentId: string,
  options: Partial<QRCodeOptions> = {}
): Promise<string> {
  return generateEquipmentQR(documentId, {
    ...options,
    size: "print",
    format: "svg",
    errorCorrectionLevel: "H", // High error correction for durability
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  });
}

/**
 * Generate compact QR code for list displays
 */
export async function generateThumbnailQR(
  documentId: string,
  options: Partial<QRCodeOptions> = {}
): Promise<string> {
  return generateEquipmentQR(documentId, {
    ...options,
    size: "small",
    format: "dataurl",
    errorCorrectionLevel: "L", // Lower error correction for smaller size
  });
}

/**
 * Generate mobile-optimized QR code for easy scanning
 */
export async function generateMobileQR(
  documentId: string,
  options: Partial<QRCodeOptions> = {}
): Promise<string> {
  return generateEquipmentQR(documentId, {
    ...options,
    size: "large",
    format: "svg",
    errorCorrectionLevel: "M",
    margin: 4, // Extra margin for mobile scanning
  });
}

/**
 * Build equipment URL with optional QR parameter
 */
function buildEquipmentUrl(
  documentId: string,
  isQRScan: boolean = false
): string {
  // For QR codes, ALWAYS use external URL for mobile access
  // Check for external URL first, then fallback to internal
  let baseUrl = process.env.NEXT_PUBLIC_EMPLOYEE_EXTERNAL_URL;

  if (!baseUrl) {
    // If no external URL set, use machine IP for development
    baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://192.168.0.41:3001"
        : process.env.NEXT_PUBLIC_EMPLOYEE_URL || "http://127.0.0.1:3001";
  }

  // Build the equipment detail URL
  let url = `${baseUrl}/equipment/${documentId}`;

  // Add QR parameter for mobile optimization
  if (isQRScan) {
    url += "?qr=true";
  }

  return url;
}

/**
 * Validate QR code content length
 */
export function validateQRContent(content: string): boolean {
  // QR codes have character limits based on error correction level
  // For our URLs, we should stay well under even the lowest limit
  return content.length <= 200; // Conservative limit
}

/**
 * Get QR code statistics for debugging
 */
export function getQRStats(content: string) {
  return {
    length: content.length,
    estimated_modules: Math.ceil(Math.sqrt(content.length * 8)), // Rough estimation
    recommended_size:
      content.length > 100 ? "large" : content.length > 50 ? "medium" : "small",
  };
}
