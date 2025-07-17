// employee-ops/src/lib/qr/types.ts

/**
 * QR Code Type Definitions for EPG Equipment Management
 * Centralized TypeScript interfaces and types for the QR system
 */

/**
 * QR Code generation options
 */
export interface QRCodeOptions {
  size?: QRSize;
  format?: QRFormat;
  errorCorrectionLevel?: QRErrorCorrection;
  margin?: number;
  color?: QRColors;
}

/**
 * QR Code size presets
 */
export type QRSize = "small" | "medium" | "large" | "print";

/**
 * QR Code output formats
 */
export type QRFormat = "svg" | "png" | "dataurl";

/**
 * QR Code error correction levels
 */
export type QRErrorCorrection = "L" | "M" | "Q" | "H";

/**
 * QR Code color configuration
 */
export interface QRColors {
  dark?: string;
  light?: string;
}

/**
 * Device information for mobile optimization
 */
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hasTouch: boolean;
  hasCamera: boolean;
  screenSize: ScreenSize;
  platform: DevicePlatform;
  browser: DeviceBrowser;
  isQRCapable: boolean;
}

/**
 * Screen size categories
 */
export type ScreenSize = "small" | "medium" | "large" | "xlarge";

/**
 * Device platforms
 */
export type DevicePlatform =
  | "ios"
  | "android"
  | "windows"
  | "macos"
  | "linux"
  | "unknown";

/**
 * Browser types
 */
export type DeviceBrowser =
  | "chrome"
  | "firefox"
  | "safari"
  | "edge"
  | "opera"
  | "unknown";

/**
 * QR URL parameters for parsing
 */
export interface QRUrlParams {
  isQRScan: boolean;
  action?: QRAction;
  returnUrl?: string;
  userId?: string;
  requiresAuth: boolean;
}

/**
 * QR scan actions
 */
export type QRAction = "view" | "edit" | "status" | "location" | "maintenance";

/**
 * QR Configuration interface
 */
export interface QRConfig {
  // URLs
  employeeBaseUrl: string;
  customerBaseUrl: string;
  strapiBaseUrl: string;

  // QR Generation Settings
  errorCorrectionLevel: QRErrorCorrection;
  defaultSize: QRSize;
  enableAnalytics: boolean;

  // Mobile Settings
  mobileOptimized: boolean;
  forceMobileView: boolean;

  // Development Settings
  debugMode: boolean;
  testMode: boolean;
  debugOverlay: boolean;

  // Environment
  isProduction: boolean;
  isDevelopment: boolean;
}

/**
 * QR generation defaults
 */
export interface QRDefaults {
  errorCorrection: QRErrorCorrection;
  size: QRSize;
  format: QRFormat;
  margin: number;
  quality: number;
  colors: QRColors;
}

/**
 * QR validation result
 */
export interface QRValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

/**
 * QR URL validation result
 */
export interface QRUrlValidation extends QRValidationResult {
  warnings: string[];
}

/**
 * QR URL analysis result
 */
export interface QRUrlAnalysis {
  protocol?: string;
  hostname?: string;
  port?: string;
  path?: string;
  documentId?: string | null;
  params?: Record<string, string>;
  fragment?: string;
  length?: number;
  isQROptimized?: boolean;
  error?: string;
  originalUrl?: string;
}

/**
 * QR statistics for debugging
 */
export interface QRStats {
  length: number;
  estimated_modules: number;
  recommended_size: QRSize;
}

/**
 * Asset tag configuration
 */
export interface AssetTagConfig {
  format?: "pdf" | "png" | "svg";
  size?: "mini" | "standard" | "large";
  includeBranding?: boolean;
  includeCategory?: boolean;
  includeModel?: boolean;
  includePurchaseDate?: boolean;
}

/**
 * Equipment instance for QR generation
 */
export interface EquipmentInstanceQR {
  documentId: string;
  sku: string;
  serialNumber?: string;
  equipmentModel?: {
    name: string;
    category?: {
      name: string;
    };
  };
  brand?: {
    brandName: string;
  };
  equipmentStatus: string;
  location?: string;
  condition?: string;
}

/**
 * QR generation context
 */
export interface QRGenerationContext {
  equipment: EquipmentInstanceQR;
  options: QRCodeOptions;
  device?: DeviceInfo;
  user?: {
    id: string;
    role: string;
  };
}

/**
 * QR scan event for analytics
 */
export interface QRScanEvent {
  documentId: string;
  timestamp: Date;
  device: DeviceInfo;
  action?: QRAction;
  userId?: string;
  location?: string;
}

/**
 * Hook return type for useQRConfig
 */
export interface UseQRConfigReturn {
  config: QRConfig;
  defaults: QRDefaults;
  validation: QRValidationResult;
  isValid: boolean;
}

/**
 * Hook return type for useDeviceDetection
 */
export interface UseDeviceDetectionReturn {
  deviceInfo: DeviceInfo | null;
  isLoading: boolean;
  shouldUseMobileInterface: boolean;
}
