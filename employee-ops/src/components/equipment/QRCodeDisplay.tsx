// employee-ops/src/components/equipment/QRCodeDisplay.tsx

"use client";

import { useState, useEffect } from "react";
import {
  QrCode,
  Copy,
  Printer,
  Eye,
  Download,
  ExternalLink,
} from "lucide-react";
import {
  generateEquipmentQR,
  buildEmployeeEquipmentUrl,
  getDeviceInfo,
} from "@/lib/qr";
import type { EquipmentInstance } from "@/lib/api/strapi";
import type { QRSize, QRFormat } from "@/lib/qr/types";

interface QRCodeDisplayProps {
  equipment: EquipmentInstance;
  size?: QRSize;
  format?: QRFormat;
  showControls?: boolean;
  showUrl?: boolean;
  className?: string;
}

export default function QRCodeDisplay({
  equipment,
  size = "medium",
  format = "svg",
  showControls = true,
  showUrl = true,
  className = "",
}: QRCodeDisplayProps) {
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [equipmentUrl, setEquipmentUrl] = useState<string>("");

  // Generate QR code on component mount or when equipment changes
  useEffect(() => {
    generateQRCode();
  }, [equipment.documentId, size, format]);

  const generateQRCode = async () => {
    if (!equipment.documentId) {
      setError("Equipment document ID is required");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Build the equipment URL for QR codes (uses external URL for mobile access)
      const url = buildEmployeeEquipmentUrl(equipment.documentId, {
        isQRScan: true,
        useExternalUrl: true, // Force external URL for mobile testing
      });
      setEquipmentUrl(url);

      // Debug: Log the URL being used for QR generation
      if (process.env.NODE_ENV === "development") {
        console.log("🔍 QR URL Generated:", url);
        console.log(
          "📱 External URL:",
          process.env.NEXT_PUBLIC_EMPLOYEE_EXTERNAL_URL
        );
        console.log("🏠 Internal URL:", process.env.NEXT_PUBLIC_EMPLOYEE_URL);
      }

      // Generate QR code
      const qr = await generateEquipmentQR(equipment.documentId, {
        size,
        format,
        errorCorrectionLevel: "M",
      });

      setQrCode(qr);
    } catch (err: any) {
      console.error("QR generation error:", err);
      setError(err.message || "Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  // Copy URL to clipboard
  const handleCopyUrl = async () => {
    if (!equipmentUrl) return;

    try {
      await navigator.clipboard.writeText(equipmentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  // Open URL in new tab
  const handleOpenUrl = () => {
    if (equipmentUrl) {
      window.open(equipmentUrl, "_blank");
    }
  };

  // Download QR code
  const handleDownload = () => {
    if (!qrCode) return;

    try {
      const element = document.createElement("a");
      if (format === "svg") {
        const blob = new Blob([qrCode], { type: "image/svg+xml" });
        element.href = URL.createObjectURL(blob);
        element.download = `${equipment.sku || equipment.documentId}-qr.svg`;
      } else {
        element.href = qrCode; // For dataurl format
        element.download = `${equipment.sku || equipment.documentId}-qr.png`;
      }
      element.click();
    } catch (err) {
      console.error("Download failed:", err);
    }
  };

  // Print QR code
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const qrContent =
      format === "svg" ? qrCode : `<img src="${qrCode}" alt="QR Code" />`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Equipment QR Code - ${equipment.sku}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 20px;
              margin: 0;
            }
            .qr-container {
              text-align: center;
              margin-bottom: 20px;
            }
            .equipment-info {
              text-align: center;
              margin-top: 20px;
            }
            .sku {
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .model {
              font-size: 14px;
              color: #666;
              margin-bottom: 5px;
            }
            .url {
              font-size: 10px;
              color: #999;
              word-break: break-all;
            }
            @media print {
              body { margin: 0; padding: 10px; }
            }
          </style>
        </head>
        <body>
          <div class="qr-container">
            ${qrContent}
          </div>
          <div class="equipment-info">
            <div class="sku">${equipment.sku || "Equipment"}</div>
            ${equipment.equipmentModel?.name ? `<div class="model">${equipment.equipmentModel.name}</div>` : ""}
            <div class="url">${equipmentUrl}</div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 100);
  };

  if (loading) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            Generating QR code...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-lg border border-red-300 dark:border-red-600 p-6 ${className}`}
      >
        <div className="flex items-center text-red-600 dark:text-red-400">
          <QrCode className="h-5 w-5 mr-2" />
          <span>QR Code Error: {error}</span>
        </div>
        <button
          onClick={generateQRCode}
          className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Equipment QR Code
          </h3>
        </div>

        {showControls && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyUrl}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy URL"
            >
              <Copy className="h-4 w-4" />
            </button>

            <button
              onClick={handleOpenUrl}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Open in New Tab"
            >
              <ExternalLink className="h-4 w-4" />
            </button>

            <button
              onClick={handleDownload}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Download QR Code"
            >
              <Download className="h-4 w-4" />
            </button>

            <button
              onClick={handlePrint}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Print QR Code"
            >
              <Printer className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* QR Code Display */}
      <div className="flex flex-col items-center space-y-4">
        <div className="flex items-center justify-center bg-white p-4 rounded-lg border-2 border-gray-100">
          {format === "svg" ? (
            <div
              dangerouslySetInnerHTML={{ __html: qrCode }}
              className="qr-code-svg"
            />
          ) : (
            <img
              src={qrCode}
              alt={`QR Code for ${equipment.sku}`}
              className="block"
            />
          )}
        </div>

        {/* Equipment Info */}
        <div className="text-center space-y-1">
          <div className="font-mono text-lg font-semibold text-gray-900 dark:text-white">
            {equipment.sku}
          </div>
          {equipment.equipmentModel?.name && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {equipment.equipmentModel.name}
            </div>
          )}
          {equipment.brand?.brandName && (
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {equipment.brand.brandName}
            </div>
          )}
        </div>

        {/* URL Display */}
        {showUrl && (
          <div className="w-full">
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <code className="text-xs text-gray-600 dark:text-gray-400 break-all">
                  {equipmentUrl}
                </code>
                <button
                  onClick={handleCopyUrl}
                  className={`ml-2 px-2 py-1 text-xs rounded transition-colors ${
                    copied
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <div className="font-medium mb-1">Scan with mobile device:</div>
          <div className="text-xs">
            Point your phone's camera at the QR code to instantly access this
            equipment's details.
          </div>
        </div>
      </div>
    </div>
  );
}
