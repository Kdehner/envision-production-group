// employee-ops/src/lib/qr/url-builders.ts

/**
 * URL Building Utilities for EPG Equipment Management
 * Centralized URL construction for consistency across the application
 */

import type {
  QRUrlParams,
  QRAction,
  QRUrlValidation,
  QRUrlAnalysis,
} from "./types";

/**
 * Environment configuration for URL building
 */
interface URLConfig {
  customerBaseUrl: string;
  employeeBaseUrl: string;
  strapiBaseUrl: string;
}

/**
 * Get environment-specific URLs
 */
function getURLConfig(): URLConfig {
  return {
    customerBaseUrl:
      process.env.NEXT_PUBLIC_CUSTOMER_URL || "https://epg.kevbot.app",
    employeeBaseUrl:
      process.env.NEXT_PUBLIC_EMPLOYEE_URL || "http://127.0.0.1:3001",
    strapiBaseUrl:
      process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337",
  };
}

/**
 * Build equipment detail URL for employee operations
 */
export function buildEmployeeEquipmentUrl(
  documentId: string,
  options: {
    isQRScan?: boolean;
    includeAuth?: boolean;
    fragment?: string;
    useExternalUrl?: boolean; // New option for mobile/QR access
  } = {}
): string {
  const config = getURLConfig();

  // Use external URL for QR codes and mobile access, internal URL for navigation
  const baseUrl =
    options.useExternalUrl || options.isQRScan
      ? config.employeeExternalUrl
      : config.employeeBaseUrl;

  const equipmentUrl = `${baseUrl}/equipment/${documentId}`;

  const searchParams = new URLSearchParams();

  // Add QR scan parameter for mobile optimization
  if (options.isQRScan) {
    searchParams.append("qr", "true");
  }

  // Add authentication hint for secured access
  if (options.includeAuth) {
    searchParams.append("auth", "required");
  }

  // Build final URL
  let url = equipmentUrl;
  if (searchParams.toString()) {
    url += `?${searchParams.toString()}`;
  }

  // Add fragment if specified
  if (options.fragment) {
    url += `#${options.fragment}`;
  }

  return url;
}

/**
 * Build customer equipment model URL (for reference)
 */
export function buildCustomerEquipmentUrl(
  modelSlug: string,
  options: {
    category?: string;
    referrer?: string;
  } = {}
): string {
  const config = getURLConfig();
  const baseUrl = `${config.customerBaseUrl}/equipment/${modelSlug}`;

  const searchParams = new URLSearchParams();

  if (options.category) {
    searchParams.append("category", options.category);
  }

  if (options.referrer) {
    searchParams.append("ref", options.referrer);
  }

  let url = baseUrl;
  if (searchParams.toString()) {
    url += `?${searchParams.toString()}`;
  }

  return url;
}

/**
 * Build Strapi API URL for equipment instances
 */
export function buildStrapiEquipmentUrl(
  documentId?: string,
  options: {
    populate?: string[];
    filters?: Record<string, any>;
    pagination?: {
      page?: number;
      pageSize?: number;
    };
  } = {}
): string {
  const config = getURLConfig();
  let url = `${config.strapiBaseUrl}/api/equipment-instances`;

  if (documentId) {
    url += `/${documentId}`;
  }

  const searchParams = new URLSearchParams();

  // Add population parameters
  if (options.populate && options.populate.length > 0) {
    options.populate.forEach((field) => {
      searchParams.append("populate", field);
    });
  }

  // Add filters
  if (options.filters) {
    Object.entries(options.filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(`filters[${key}]`, String(value));
      }
    });
  }

  // Add pagination
  if (options.pagination) {
    if (options.pagination.page) {
      searchParams.append("pagination[page]", String(options.pagination.page));
    }
    if (options.pagination.pageSize) {
      searchParams.append(
        "pagination[pageSize]",
        String(options.pagination.pageSize)
      );
    }
  }

  if (searchParams.toString()) {
    url += `?${searchParams.toString()}`;
  }

  return url;
}

/**
 * Build QR code specific URLs for equipment access
 */
export function buildQREquipmentUrl(
  documentId: string,
  options: {
    action?: "view" | "edit" | "status" | "location";
    returnUrl?: string;
    userId?: string;
  } = {}
): string {
  // Always use external URL for QR codes
  const baseUrl = buildEmployeeEquipmentUrl(documentId, {
    isQRScan: true,
    useExternalUrl: true, // Force external URL for QR codes
  });

  const url = new URL(baseUrl);

  // Add specific action parameter
  if (options.action && options.action !== "view") {
    url.searchParams.append("action", options.action);
  }

  // Add return URL for navigation context
  if (options.returnUrl) {
    url.searchParams.append("return", encodeURIComponent(options.returnUrl));
  }

  // Add user context for audit trails
  if (options.userId) {
    url.searchParams.append("user", options.userId);
  }

  return url.toString();
}

/**
 * Parse QR scan parameters from URL
 */
export function parseQRParams(url: string | URL): {
  isQRScan: boolean;
  action?: string;
  returnUrl?: string;
  userId?: string;
  requiresAuth: boolean;
} {
  const urlObj = new URL(url);

  return {
    isQRScan: urlObj.searchParams.get("qr") === "true",
    action: urlObj.searchParams.get("action") || undefined,
    returnUrl: urlObj.searchParams.get("return") || undefined,
    userId: urlObj.searchParams.get("user") || undefined,
    requiresAuth: urlObj.searchParams.get("auth") === "required",
  };
}

/**
 * Build print-friendly asset label URL
 */
export function buildAssetLabelUrl(
  documentId: string,
  options: {
    format?: "pdf" | "png" | "svg";
    size?: "mini" | "standard" | "large";
    includeBranding?: boolean;
  } = {}
): string {
  const config = getURLConfig();
  const baseUrl = `${config.employeeBaseUrl}/equipment/${documentId}/label`;

  const searchParams = new URLSearchParams();

  if (options.format) {
    searchParams.append("format", options.format);
  }

  if (options.size) {
    searchParams.append("size", options.size);
  }

  if (options.includeBranding !== undefined) {
    searchParams.append("branding", String(options.includeBranding));
  }

  let url = baseUrl;
  if (searchParams.toString()) {
    url += `?${searchParams.toString()}`;
  }

  return url;
}

/**
 * Validate URL structure for QR codes
 */
export function validateQRUrl(url: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
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
      !urlObj.hostname.includes("localhost")
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
 * Get URL components for debugging
 */
export function analyzeQRUrl(url: string) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    const equipmentIndex = pathParts.indexOf("equipment");

    return {
      protocol: urlObj.protocol,
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      documentId: equipmentIndex >= 0 ? pathParts[equipmentIndex + 1] : null,
      params: Object.fromEntries(urlObj.searchParams.entries()),
      fragment: urlObj.hash,
      length: url.length,
      isQROptimized: urlObj.searchParams.get("qr") === "true",
    };
  } catch (error) {
    return {
      error: "Invalid URL format",
      originalUrl: url,
    };
  }
}
