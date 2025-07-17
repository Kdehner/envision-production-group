// employee-ops/src/lib/qr/validation.ts

/**
 * QR Code Validation Utilities for EPG Equipment Management
 * Handles validation of QR content, URLs, and configuration
 */

import type { QRValidationResult, QRUrlValidation, QRStats } from "./types";

/**
 * Validate QR code content length and format
 */
export function validateQRContent(content: string): boolean {
  // QR codes have character limits based on error correction level
  // For our URLs, we should stay well under even the lowest limit
  return content.length <= 200; // Conservative limit
}

/**
 * Get QR code statistics for debugging
 */
export function getQRStats(content: string): QRStats {
  return {
    length: content.length,
    estimated_modules: Math.ceil(Math.sqrt(content.length * 8)), // Rough estimation
    recommended_size:
      content.length > 100 ? "large" : content.length > 50 ? "medium" : "small",
  };
}

/**
 * Validate URL structure for QR codes
 */
export function validateQRUrl(url: string): QRUrlValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    const urlObj = new URL(url);

    // Check URL length (QR code capacity)
    if (url.length > 200) {
      warnings.push("URL may be too long for efficient QR scanning");
    }

    // Check for HTTPS in production
    if (
      urlObj.protocol !== "https:" &&
      !urlObj.hostname.includes("localhost") &&
      !urlObj.hostname.includes("127.0.0.1")
    ) {
      warnings.push("HTTPS recommended for production QR codes");
    }

    // Validate required path structure
    if (!urlObj.pathname.includes("/equipment/")) {
      errors.push("URL must include equipment path");
    }

    // Check for documentId format (basic validation)
    const pathParts = urlObj.pathname.split("/");
    const documentId = pathParts[pathParts.indexOf("equipment") + 1];
    if (!documentId || documentId.length < 10) {
      errors.push("Invalid or missing equipment document ID");
    }

    // Check for suspicious parameters
    const suspiciousParams = ["script", "javascript", "data:", "vbscript"];
    urlObj.searchParams.forEach((value, key) => {
      if (
        suspiciousParams.some(
          (param) =>
            value.toLowerCase().includes(param) ||
            key.toLowerCase().includes(param)
        )
      ) {
        errors.push("Potentially unsafe URL parameters detected");
      }
    });

    // Validate hostname format
    if (urlObj.hostname && !isValidHostname(urlObj.hostname)) {
      errors.push("Invalid hostname format");
    }
  } catch (error) {
    errors.push("Invalid URL format");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate hostname format
 */
function isValidHostname(hostname: string): boolean {
  // Allow localhost and 127.0.0.1 for development
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return true;
  }

  // Basic domain validation
  const domainRegex =
    /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  return domainRegex.test(hostname);
}

/**
 * Validate equipment document ID format
 */
export function validateDocumentId(documentId: string): QRValidationResult {
  const errors: string[] = [];

  if (!documentId) {
    errors.push("Document ID is required");
  } else {
    // Basic format validation (Strapi v5 document IDs are typically 25+ characters)
    if (documentId.length < 10) {
      errors.push("Document ID too short");
    }

    if (documentId.length > 50) {
      errors.push("Document ID too long");
    }

    // Check for valid characters (alphanumeric, hyphens, underscores)
    if (!/^[a-zA-Z0-9_-]+$/.test(documentId)) {
      errors.push("Document ID contains invalid characters");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate QR generation options
 */
export function validateQROptions(options: any): QRValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (
    options.size &&
    !["small", "medium", "large", "print"].includes(options.size)
  ) {
    errors.push("Invalid QR size option");
  }

  if (options.format && !["svg", "png", "dataurl"].includes(options.format)) {
    errors.push("Invalid QR format option");
  }

  if (
    options.errorCorrectionLevel &&
    !["L", "M", "Q", "H"].includes(options.errorCorrectionLevel)
  ) {
    errors.push("Invalid error correction level");
  }

  if (
    options.margin &&
    (typeof options.margin !== "number" ||
      options.margin < 0 ||
      options.margin > 10)
  ) {
    errors.push("Margin must be a number between 0 and 10");
  }

  if (options.color) {
    if (options.color.dark && !isValidColor(options.color.dark)) {
      errors.push("Invalid dark color format");
    }

    if (options.color.light && !isValidColor(options.color.light)) {
      errors.push("Invalid light color format");
    }

    // Check contrast
    if (
      options.color.dark &&
      options.color.light &&
      options.color.dark.toLowerCase() === options.color.light.toLowerCase()
    ) {
      warnings.push("Dark and light colors should have sufficient contrast");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate color format (hex, rgb, rgba, named colors)
 */
function isValidColor(color: string): boolean {
  // Hex colors
  if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
    return true;
  }

  // RGB/RGBA colors
  if (/^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[0-9.]+)?\s*\)$/.test(color)) {
    return true;
  }

  // Named colors (basic set)
  const namedColors = [
    "black",
    "white",
    "red",
    "green",
    "blue",
    "yellow",
    "cyan",
    "magenta",
    "transparent",
  ];
  if (namedColors.includes(color.toLowerCase())) {
    return true;
  }

  return false;
}

/**
 * Validate complete QR generation request
 */
export function validateQRRequest(
  documentId: string,
  options: any = {}
): QRValidationResult {
  const documentValidation = validateDocumentId(documentId);
  const optionsValidation = validateQROptions(options);

  const allErrors = [...documentValidation.errors, ...optionsValidation.errors];
  const allWarnings = [...(optionsValidation.warnings || [])];

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

/**
 * Sanitize and validate QR URL parameters
 */
export function sanitizeQRParams(
  params: Record<string, any>
): Record<string, string> {
  const sanitized: Record<string, string> = {};
  const allowedParams = ["qr", "action", "return", "user", "auth", "debug"];

  Object.entries(params).forEach(([key, value]) => {
    if (allowedParams.includes(key) && value != null) {
      // Sanitize the value
      const stringValue = String(value).slice(0, 200); // Limit length
      const sanitizedValue = stringValue.replace(/[<>'"&]/g, ""); // Remove dangerous characters

      if (sanitizedValue) {
        sanitized[key] = sanitizedValue;
      }
    }
  });

  return sanitized;
}
