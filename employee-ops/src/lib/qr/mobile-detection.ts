// employee-ops/src/lib/qr/mobile-detection.ts

/**
 * Mobile Detection Utilities for EPG Equipment Management
 * Handles device detection and mobile-specific optimizations for QR scanning
 */

import type {
  DeviceInfo,
  ScreenSize,
  DevicePlatform,
  DeviceBrowser,
  QRSize,
  UseDeviceDetectionReturn,
} from "./types";

/**
 * Detect if the current device is mobile
 */
export function isMobileDevice(userAgent?: string): boolean {
  const ua =
    userAgent ||
    (typeof window !== "undefined" ? window.navigator.userAgent : "");

  const mobileRegex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
  return mobileRegex.test(ua);
}

/**
 * Detect if the current device is a tablet
 */
export function isTabletDevice(userAgent?: string): boolean {
  const ua =
    userAgent ||
    (typeof window !== "undefined" ? window.navigator.userAgent : "");

  // Check for tablet-specific patterns
  const tabletRegex = /iPad|Android(?!.*Mobile)|Tablet|PlayBook|Kindle/i;
  const isTablet = tabletRegex.test(ua);

  // Additional check for large Android devices
  if (!isTablet && ua.includes("Android")) {
    // If it's Android but not explicitly mobile, might be tablet
    return !ua.includes("Mobile");
  }

  return isTablet;
}

/**
 * Detect touch capability
 */
export function hasTouchSupport(): boolean {
  if (typeof window === "undefined") return false;

  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Detect camera capability
 */
export async function hasCameraSupport(): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices) {
    return false;
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some((device) => device.kind === "videoinput");
  } catch (error) {
    console.warn("Camera detection failed:", error);
    return false;
  }
}

/**
 * Get screen size category
 */
export function getScreenSize(): "small" | "medium" | "large" | "xlarge" {
  if (typeof window === "undefined") return "medium";

  const width = window.innerWidth;

  if (width < 640) return "small"; // Mobile
  if (width < 1024) return "medium"; // Tablet
  if (width < 1280) return "large"; // Desktop
  return "xlarge"; // Large desktop
}

/**
 * Detect platform
 */
export function detectPlatform(userAgent?: string): DeviceInfo["platform"] {
  const ua =
    userAgent ||
    (typeof window !== "undefined" ? window.navigator.userAgent : "");

  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  if (/Windows/i.test(ua)) return "windows";
  if (/Mac/i.test(ua)) return "macos";
  if (/Linux/i.test(ua)) return "linux";

  return "unknown";
}

/**
 * Detect browser
 */
export function detectBrowser(userAgent?: string): DeviceInfo["browser"] {
  const ua =
    userAgent ||
    (typeof window !== "undefined" ? window.navigator.userAgent : "");

  // Check for specific browsers
  if (/Chrome/i.test(ua) && !/Edge|Edg/i.test(ua)) return "chrome";
  if (/Firefox/i.test(ua)) return "firefox";
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "safari";
  if (/Edge|Edg/i.test(ua)) return "edge";
  if (/Opera|OPR/i.test(ua)) return "opera";

  return "unknown";
}

/**
 * Get comprehensive device information
 */
export async function getDeviceInfo(userAgent?: string): Promise<DeviceInfo> {
  const isMobile = isMobileDevice(userAgent);
  const isTablet = isTabletDevice(userAgent);
  const isDesktop = !isMobile && !isTablet;
  const hasTouch = hasTouchSupport();
  const hasCamera = await hasCameraSupport();
  const screenSize = getScreenSize();
  const platform = detectPlatform(userAgent);
  const browser = detectBrowser(userAgent);

  // Determine if device is QR capable
  const isQRCapable = hasCamera || (isMobile && browser !== "unknown");

  return {
    isMobile,
    isTablet,
    isDesktop,
    hasTouch,
    hasCamera,
    screenSize,
    platform,
    browser,
    isQRCapable,
  };
}

/**
 * Check if device should use mobile-optimized QR interface
 */
export function shouldUseMobileQRInterface(deviceInfo?: DeviceInfo): boolean {
  if (!deviceInfo) return false;

  return (
    deviceInfo.isMobile ||
    (deviceInfo.isTablet && deviceInfo.hasTouch) ||
    deviceInfo.screenSize === "small"
  );
}

/**
 * Get optimal QR code size for device
 */
export function getOptimalQRSize(
  deviceInfo: DeviceInfo
): "small" | "medium" | "large" | "print" {
  if (deviceInfo.screenSize === "small") return "medium"; // Mobile needs readable size
  if (deviceInfo.screenSize === "medium") return "large"; // Tablet can handle larger
  return "medium"; // Desktop default
}

/**
 * Check if device supports QR scanning
 */
export function supportsQRScanning(deviceInfo: DeviceInfo): boolean {
  // Modern browsers generally support QR scanning through camera
  return (
    deviceInfo.hasCamera &&
    (deviceInfo.browser === "chrome" ||
      deviceInfo.browser === "firefox" ||
      deviceInfo.browser === "safari" ||
      deviceInfo.browser === "edge")
  );
}

/**
 * Get device-specific QR instructions
 */
export function getQRInstructions(deviceInfo: DeviceInfo): string {
  if (deviceInfo.platform === "ios") {
    return "Point your camera at the QR code or use the camera app to scan";
  }

  if (deviceInfo.platform === "android") {
    return "Use your camera app or Google Lens to scan the QR code";
  }

  if (deviceInfo.isMobile) {
    return "Use your device's camera to scan the QR code";
  }

  return "Scan this QR code with your mobile device camera";
}

/**
 * React hook for device detection
 */
export function useDeviceDetection() {
  if (typeof window === "undefined") {
    return {
      deviceInfo: null,
      isLoading: true,
      shouldUseMobileInterface: false,
    };
  }

  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    getDeviceInfo().then((info) => {
      setDeviceInfo(info);
      setIsLoading(false);
    });
  }, []);

  return {
    deviceInfo,
    isLoading,
    shouldUseMobileInterface: deviceInfo
      ? shouldUseMobileQRInterface(deviceInfo)
      : false,
  };
}

/**
 * Server-side device detection from request headers
 */
export function detectDeviceFromHeaders(
  headers: Record<string, string>
): Partial<DeviceInfo> {
  const userAgent = headers["user-agent"] || "";

  const isMobile = isMobileDevice(userAgent);
  const isTablet = isTabletDevice(userAgent);
  const isDesktop = !isMobile && !isTablet;
  const platform = detectPlatform(userAgent);
  const browser = detectBrowser(userAgent);

  return {
    isMobile,
    isTablet,
    isDesktop,
    platform,
    browser,
    hasTouch: isMobile || isTablet, // Assumption for server-side
    hasCamera: isMobile || isTablet, // Assumption for server-side
    isQRCapable: isMobile || isTablet,
  };
}

/**
 * CSS classes for responsive QR display
 */
export function getQRDisplayClasses(deviceInfo: DeviceInfo): string {
  const classes = ["qr-display"];

  if (deviceInfo.isMobile) classes.push("qr-mobile");
  if (deviceInfo.isTablet) classes.push("qr-tablet");
  if (deviceInfo.isDesktop) classes.push("qr-desktop");
  if (deviceInfo.hasTouch) classes.push("qr-touch");
  if (deviceInfo.screenSize === "small") classes.push("qr-small-screen");

  return classes.join(" ");
}

// Import React for the hook (only if in browser environment)
let React: any;
if (typeof window !== "undefined") {
  try {
    React = require("react");
  } catch (error) {
    // React not available, hook will not work
  }
}
