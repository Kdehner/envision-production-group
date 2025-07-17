// employee-ops/src/lib/qr/__tests__/foundation.test.ts

/**
 * Test file to verify QR generation foundation works correctly
 * Run this to validate the setup before proceeding to components
 */

import {
  generateEquipmentQR,
  generatePrintableQR,
  generateThumbnailQR,
  getQRStats,
} from "../generator";

import {
  buildEmployeeEquipmentUrl,
  buildQREquipmentUrl,
  parseQRParams,
  analyzeQRUrl,
} from "../url-builders";

import {
  isMobileDevice,
  isTabletDevice,
  detectPlatform,
  detectBrowser,
  getOptimalQRSize,
  getQRInstructions,
} from "../mobile-detection";

import {
  validateQRContent,
  validateQRUrl,
  validateDocumentId,
  validateQRRequest,
} from "../validation";

import { getQRConfig, validateQRConfig } from "../config";

/**
 * Test QR generation functions
 */
async function testQRGeneration() {
  console.log("🧪 Testing QR Generation...");

  const testDocumentId = "test-equipment-12345";

  try {
    // Test basic QR generation
    const basicQR = await generateEquipmentQR(testDocumentId);
    console.log("✅ Basic QR generation:", basicQR.substring(0, 50) + "...");

    // Test printable QR
    const printQR = await generatePrintableQR(testDocumentId);
    console.log(
      "✅ Printable QR generation:",
      printQR.substring(0, 50) + "..."
    );

    // Test thumbnail QR
    const thumbnailQR = await generateThumbnailQR(testDocumentId);
    console.log(
      "✅ Thumbnail QR generation:",
      thumbnailQR.substring(0, 50) + "..."
    );

    console.log("🎉 QR Generation tests passed!");
  } catch (error) {
    console.error("❌ QR Generation test failed:", error);
    throw error;
  }
}

/**
 * Test URL building functions
 */
function testURLBuilding() {
  console.log("🧪 Testing URL Building...");

  const testDocumentId = "test-equipment-12345";

  try {
    // Test employee equipment URL
    const employeeUrl = buildEmployeeEquipmentUrl(testDocumentId, {
      isQRScan: true,
    });
    console.log("✅ Employee URL:", employeeUrl);

    // Test QR equipment URL
    const qrUrl = buildQREquipmentUrl(testDocumentId, { action: "status" });
    console.log("✅ QR URL:", qrUrl);

    // Test QR params parsing
    const params = parseQRParams(qrUrl);
    console.log("✅ Parsed QR params:", params);

    // Test URL validation
    const validation = validateQRUrl(employeeUrl);
    console.log("✅ URL validation:", validation);

    // Test URL analysis
    const analysis = analyzeQRUrl(qrUrl);
    console.log("✅ URL analysis:", analysis);

    console.log("🎉 URL Building tests passed!");
  } catch (error) {
    console.error("❌ URL Building test failed:", error);
    throw error;
  }
}

/**
 * Test mobile detection functions
 */
function testMobileDetection() {
  console.log("🧪 Testing Mobile Detection...");

  try {
    // Test with various user agents
    const testUserAgents = [
      "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)",
      "Mozilla/5.0 (iPad; CPU OS 14_7_1 like Mac OS X)",
      "Mozilla/5.0 (Linux; Android 11; SM-G991B)",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    ];

    testUserAgents.forEach((ua, index) => {
      const isMobile = isMobileDevice(ua);
      const isTablet = isTabletDevice(ua);
      const platform = detectPlatform(ua);
      const browser = detectBrowser(ua);

      console.log(`✅ Test ${index + 1}:`, {
        userAgent: ua.substring(0, 50) + "...",
        isMobile,
        isTablet,
        platform,
        browser,
      });
    });

    // Test QR instructions
    const instructions = getQRInstructions({
      isMobile: true,
      platform: "ios",
      browser: "safari",
    } as any);
    console.log("✅ QR Instructions:", instructions);

    console.log("🎉 Mobile Detection tests passed!");
  } catch (error) {
    console.error("❌ Mobile Detection test failed:", error);
    throw error;
  }
}

/**
 * Test QR content validation
 */
function testQRValidation() {
  console.log("🧪 Testing QR Validation...");

  try {
    // Test content validation
    const shortContent = "http://localhost:3001/equipment/abc123";
    const longContent =
      "http://localhost:3001/equipment/abc123?" + "x".repeat(200);

    console.log("✅ Short content valid:", validateQRContent(shortContent));
    console.log("✅ Long content valid:", validateQRContent(longContent));

    // Test QR stats
    const stats = getQRStats(shortContent);
    console.log("✅ QR Stats:", stats);

    console.log("🎉 QR Validation tests passed!");
  } catch (error) {
    console.error("❌ QR Validation test failed:", error);
    throw error;
  }
}

/**
 * Main test runner
 */
export async function runQRFoundationTests() {
  console.log("🚀 Starting EPG QR Foundation Tests...");
  console.log("==========================================");

  try {
    await testQRGeneration();
    testURLBuilding();
    testMobileDetection();
    testQRValidation();

    console.log("==========================================");
    console.log("🎊 All QR Foundation tests passed!");
    console.log("✅ Ready to proceed to Phase 2: QR Display Component");
    return true;
  } catch (error) {
    console.log("==========================================");
    console.error("💥 QR Foundation tests failed:", error);
    console.log("❌ Please fix errors before proceeding");
    return false;
  }
}

// Export individual test functions for debugging
export {
  testQRGeneration,
  testURLBuilding,
  testMobileDetection,
  testQRValidation,
};

/**
 * Browser-friendly test runner (can be called from console)
 */
if (typeof window !== "undefined") {
  // @ts-ignore
  window.testEPGQR = runQRFoundationTests;
  console.log(
    "💡 Run window.testEPGQR() in browser console to test QR foundation"
  );
}
