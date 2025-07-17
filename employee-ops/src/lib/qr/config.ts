// employee-ops/src/lib/qr/config.ts

/**
 * QR Code Configuration Utility for EPG Equipment Management
 * Centralizes QR-related environment variables and configuration
 */

import type {
  QRConfig,
  QRDefaults,
  QRValidationResult,
  UseQRConfigReturn,
} from "./types";

/**
 * Get QR configuration from environment variables
 */
export function getQRConfig(): QRConfig {
  const isProduction = process.env.NODE_ENV === "production";
  const isDevelopment = process.env.NODE_ENV === "development";

  return {
    // URLs - respecting your existing environment variable patterns
    employeeBaseUrl:
      process.env.NEXT_PUBLIC_EMPLOYEE_URL ||
      process.env.NEXTAUTH_URL ||
      "http://127.0.0.1:3001",
    customerBaseUrl:
      process.env.NEXT_PUBLIC_CUSTOMER_URL || "https://epg.kevbot.app",
    strapiBaseUrl:
      process.env.NEXT_PUBLIC_STRAPI_URL ||
      process.env.STRAPI_URL ||
      "http://127.0.0.1:1337",

    // QR Generation Settings
    errorCorrectionLevel:
      (process.env.NEXT_PUBLIC_QR_ERROR_CORRECTION as any) || "M",
    defaultSize: (process.env.NEXT_PUBLIC_QR_DEFAULT_SIZE as any) || "medium",
    enableAnalytics: process.env.NEXT_PUBLIC_QR_ENABLE_ANALYTICS === "true",

    // Mobile Settings
    mobileOptimized: process.env.NEXT_PUBLIC_MOBILE_QR_OPTIMIZED !== "false",
    forceMobileView: process.env.NEXT_PUBLIC_FORCE_MOBILE_VIEW === "true",

    // Development Settings
    debugMode: process.env.NEXT_PUBLIC_DEBUG_QR === "true",
    testMode: process.env.NEXT_PUBLIC_QR_TEST_MODE === "true",
    debugOverlay: process.env.NEXT_PUBLIC_ENABLE_QR_DEBUG_OVERLAY === "true",

    // Environment
    isProduction,
    isDevelopment,
  };
}

/**
 * Get QR generation defaults based on environment
 */
export function getQRDefaults() {
  const config = getQRConfig();

  return {
    errorCorrection: config.errorCorrectionLevel,
    size: config.defaultSize,
    format: "svg" as const,
    margin: config.isProduction ? 3 : 2,
    quality: config.isProduction ? 0.95 : 0.92,
    colors: {
      dark: "#000000",
      light: "#FFFFFF",
    },
  };
}

/**
 * Get environment-specific QR URL parameters
 */
export function getQRUrlParams(
  options: {
    isQRScan?: boolean;
    action?: string;
    returnUrl?: string;
  } = {}
) {
  const config = getQRConfig();
  const params = new URLSearchParams();

  if (options.isQRScan || config.mobileOptimized) {
    params.append("qr", "true");
  }

  if (options.action) {
    params.append("action", options.action);
  }

  if (options.returnUrl) {
    params.append("return", encodeURIComponent(options.returnUrl));
  }

  if (config.debugMode) {
    params.append("debug", "true");
  }

  return params.toString();
}

/**
 * Validate QR configuration
 */
export function validateQRConfig(): { isValid: boolean; errors: string[] } {
  const config = getQRConfig();
  const errors: string[] = [];

  // Validate URLs
  try {
    new URL(config.employeeBaseUrl);
  } catch {
    errors.push("Invalid NEXT_PUBLIC_EMPLOYEE_URL");
  }

  try {
    new URL(config.customerBaseUrl);
  } catch {
    errors.push("Invalid NEXT_PUBLIC_CUSTOMER_URL");
  }

  try {
    new URL(config.strapiBaseUrl);
  } catch {
    errors.push("Invalid NEXT_PUBLIC_STRAPI_URL");
  }

  // Validate error correction level
  if (!["L", "M", "Q", "H"].includes(config.errorCorrectionLevel)) {
    errors.push("Invalid QR error correction level");
  }

  // Validate size
  if (!["small", "medium", "large", "print"].includes(config.defaultSize)) {
    errors.push("Invalid QR default size");
  }

  // Production-specific validations
  if (config.isProduction) {
    if (
      config.employeeBaseUrl.includes("127.0.0.1") ||
      config.employeeBaseUrl.includes("localhost")
    ) {
      errors.push("Production employee URL should not use localhost/127.0.0.1");
    }

    if (!config.employeeBaseUrl.startsWith("https://")) {
      errors.push("Production employee URL should use HTTPS");
    }

    if (config.debugMode) {
      errors.push("Debug mode should be disabled in production");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get QR configuration summary for debugging
 */
export function getQRConfigSummary() {
  const config = getQRConfig();
  const validation = validateQRConfig();

  return {
    environment: config.isProduction ? "production" : "development",
    urls: {
      employee: config.employeeBaseUrl,
      customer: config.customerBaseUrl,
      strapi: config.strapiBaseUrl,
    },
    qrSettings: {
      errorCorrection: config.errorCorrectionLevel,
      defaultSize: config.defaultSize,
      mobileOptimized: config.mobileOptimized,
    },
    debugSettings: {
      debugMode: config.debugMode,
      testMode: config.testMode,
      debugOverlay: config.debugOverlay,
    },
    validation,
  };
}

/**
 * React hook for QR configuration
 */
export function useQRConfig() {
  const config = getQRConfig();
  const defaults = getQRDefaults();
  const validation = validateQRConfig();

  return {
    config,
    defaults,
    validation,
    isValid: validation.isValid,
  };
}

/**
 * Development helper to log QR configuration
 */
export function logQRConfig() {
  if (process.env.NODE_ENV === "development") {
    const summary = getQRConfigSummary();
    console.log("🔧 EPG QR Configuration:", summary);

    if (!summary.validation.isValid) {
      console.warn("⚠️ QR Configuration Issues:", summary.validation.errors);
    }
  }
}

// Auto-log configuration in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  logQRConfig();
}
