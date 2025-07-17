// employee-ops/src/components/equipment/AssetTag.tsx

"use client";

import { useState, useEffect } from "react";
import { Printer, Download } from "lucide-react";
import { generatePrintableQR } from "@/lib/qr";
import type { EquipmentInstance } from "@/lib/api/strapi";

interface AssetTagProps {
  equipment: EquipmentInstance;
  size?: "mini" | "standard" | "large";
  includeBranding?: boolean;
  includeCategory?: boolean;
  className?: string;
}

export default function AssetTag({
  equipment,
  size = "standard",
  includeBranding = true,
  includeCategory = false,
  className = "",
}: AssetTagProps) {
  const [qrCode, setQrCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateAssetQR();
  }, [equipment.documentId]);

  const generateAssetQR = async () => {
    if (!equipment.documentId) {
      setError("Equipment document ID is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const qr = await generatePrintableQR(equipment.documentId);
      setQrCode(qr);
    } catch (err: any) {
      console.error("Asset tag QR generation error:", err);
      setError(err.message || "Failed to generate asset tag");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printContent = createPrintableAssetTag();
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 100);
  };

  const handleDownload = () => {
    const printContent = createPrintableAssetTag();
    const blob = new Blob([printContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const element = document.createElement("a");
    element.href = url;
    element.download = `asset-tag-${equipment.sku || equipment.documentId}.html`;
    element.click();

    URL.revokeObjectURL(url);
  };

  const createPrintableAssetTag = () => {
    const dimensions = getDimensions();

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Asset Tag - ${equipment.sku}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              background: white;
            }
            .asset-tag {
              width: ${dimensions.width};
              height: ${dimensions.height};
              border: 2px solid #000;
              border-radius: 12px;
              padding: ${dimensions.padding};
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
              display: flex;
              align-items: center;
              justify-content: space-between;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              margin: 0 auto;
              position: relative;
            }
            .content {
              flex: 1;
              display: flex;
              flex-direction: column;
              justify-content: center;
              text-align: center;
            }
            .property-header {
              font-size: ${dimensions.headerSize};
              font-weight: bold;
              color: #8B0000;
              margin-bottom: ${dimensions.spacing};
              line-height: 1.1;
            }
            .company-name {
              font-size: ${dimensions.companySize};
              font-weight: bold;
              color: #8B0000;
              margin-bottom: ${dimensions.spacing};
              line-height: 1.1;
            }
            .sku {
              font-size: ${dimensions.skuSize};
              font-weight: bold;
              color: #333;
              font-family: 'Courier New', monospace;
              letter-spacing: 1px;
            }
            .category {
              font-size: ${dimensions.categorySize};
              color: #666;
              margin-top: ${dimensions.spacing};
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .qr-container {
              display: flex;
              align-items: center;
              justify-content: center;
              background: white;
              padding: ${dimensions.qrPadding};
              border-radius: 8px;
              border: 1px solid #ddd;
            }
            .qr-code {
              width: ${dimensions.qrSize};
              height: ${dimensions.qrSize};
            }
            @media print {
              body { margin: 0; padding: 10px; }
              .asset-tag { 
                box-shadow: none; 
                border: 2px solid #000;
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <div class="asset-tag">
            <div class="content">
              ${
                includeBranding
                  ? `
                <div class="property-header">PROPERTY OF</div>
                <div class="company-name">Envision Production<br>Group</div>
              `
                  : ""
              }
              <div class="sku">${equipment.sku}</div>
              ${
                includeCategory && equipment.equipmentModel?.category?.name
                  ? `
                <div class="category">${equipment.equipmentModel.category.name} Equipment</div>
              `
                  : ""
              }
            </div>
            <div class="qr-container">
              <div class="qr-code">
                ${qrCode}
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const getDimensions = () => {
    switch (size) {
      case "mini":
        return {
          width: "2.5in",
          height: "1in",
          padding: "8px",
          spacing: "2px",
          headerSize: "8px",
          companySize: "10px",
          skuSize: "12px",
          categorySize: "6px",
          qrSize: "0.7in",
          qrPadding: "4px",
        };
      case "large":
        return {
          width: "4.5in",
          height: "2.25in",
          padding: "20px",
          spacing: "8px",
          headerSize: "16px",
          companySize: "20px",
          skuSize: "24px",
          categorySize: "12px",
          qrSize: "1.75in",
          qrPadding: "12px",
        };
      default: // standard
        return {
          width: "3.5in",
          height: "1.5in",
          padding: "12px",
          spacing: "4px",
          headerSize: "11px",
          companySize: "14px",
          skuSize: "16px",
          categorySize: "9px",
          qrSize: "1.2in",
          qrPadding: "8px",
        };
    }
  };

  const previewDimensions = {
    mini: "w-64 h-24",
    standard: "w-80 h-32",
    large: "w-96 h-40",
  };

  if (loading) {
    return (
      <div
        className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
      >
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Generating asset tag...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`bg-white rounded-lg border border-red-300 p-6 ${className}`}
      >
        <div className="text-red-600">Asset Tag Error: {error}</div>
        <button
          onClick={generateAssetQR}
          className="mt-2 text-sm text-blue-600 hover:underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Asset Tag</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      {/* Asset Tag Preview */}
      <div className="flex justify-center mb-4">
        <div
          className={`${previewDimensions[size]} border-2 border-gray-800 rounded-xl p-3 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-between shadow-lg`}
        >
          <div className="flex-1 text-center">
            {includeBranding && (
              <>
                <div className="text-red-800 font-bold text-xs mb-1">
                  PROPERTY OF
                </div>
                <div className="text-red-800 font-bold text-sm mb-2 leading-tight">
                  Envision Production
                  <br />
                  Group
                </div>
              </>
            )}
            <div className="font-bold font-mono text-lg text-gray-900 tracking-wide">
              {equipment.sku}
            </div>
            {includeCategory && equipment.equipmentModel?.category?.name && (
              <div className="text-xs text-gray-600 mt-1 uppercase tracking-wider">
                {equipment.equipmentModel.category.name} Equipment
              </div>
            )}
          </div>
          <div className="bg-white p-2 rounded border border-gray-300 ml-3">
            {qrCode && (
              <div
                dangerouslySetInnerHTML={{ __html: qrCode }}
                className="w-16 h-16"
              />
            )}
          </div>
        </div>
      </div>

      {/* Size Options */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <span>Size:</span>
        <span
          className={`px-2 py-1 rounded ${size === "mini" ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}
        >
          Mini
        </span>
        <span
          className={`px-2 py-1 rounded ${size === "standard" ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}
        >
          Standard
        </span>
        <span
          className={`px-2 py-1 rounded ${size === "large" ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}
        >
          Large
        </span>
      </div>
    </div>
  );
}
