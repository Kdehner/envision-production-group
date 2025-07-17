// employee-ops/src/components/equipment/QRSection.tsx

"use client";

import { useState } from "react";
import { QrCode, Smartphone, Printer, Tags } from "lucide-react";
import QRCodeDisplay from "./QRCodeDisplay";
import AssetTag from "./AssetTag";
import type { EquipmentInstance } from "@/lib/api/strapi";

interface QRSectionProps {
  equipment: EquipmentInstance;
  className?: string;
}

type QRView = "display" | "asset-tag";

export default function QRSection({
  equipment,
  className = "",
}: QRSectionProps) {
  const [activeView, setActiveView] = useState<QRView>("display");

  return (
    <div className={`space-y-6 ${className}`}>
      {/* QR Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <QrCode className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              QR Code & Asset Tags
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Quick access and physical asset management
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button
            onClick={() => setActiveView("display")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
              activeView === "display"
                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Smartphone className="h-4 w-4" />
            QR Display
          </button>
          <button
            onClick={() => setActiveView("asset-tag")}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
              activeView === "asset-tag"
                ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            <Tags className="h-4 w-4" />
            Asset Tag
          </button>
        </div>
      </div>

      {/* Content */}
      {activeView === "display" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* QR Code Display */}
          <QRCodeDisplay
            equipment={equipment}
            size="large"
            showControls={true}
            showUrl={true}
          />

          {/* Quick Access Info */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Access Guide
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    1
                  </span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Mobile Scanning
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Open your phone's camera and point it at the QR code to
                    instantly access equipment details.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    2
                  </span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Field Operations
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    QR codes work on all mobile devices and provide quick access
                    for warehouse teams.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                    3
                  </span>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Status Updates
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Scan to quickly update equipment status, location, or
                    condition from mobile devices.
                  </p>
                </div>
              </div>
            </div>

            {/* Equipment URL */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">
                Direct URL (Mobile Access)
              </h5>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                <code className="text-xs text-gray-600 dark:text-gray-400 break-all">
                  http://192.168.0.41:3001/equipment/{equipment.documentId}
                  ?qr=true
                </code>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === "asset-tag" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Asset Tag Generator */}
          <AssetTag
            equipment={equipment}
            size="standard"
            includeBranding={true}
            includeCategory={true}
          />

          {/* Asset Tag Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Physical Asset Management
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <Printer className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Print & Apply
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Print high-quality asset tags and attach them directly to
                    equipment for easy identification.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                  <Tags className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Professional Branding
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Asset tags include EPG branding and equipment information
                    for professional appearance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
                  <QrCode className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    Durable QR Codes
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    High error correction ensures QR codes remain scannable even
                    with wear and tear.
                  </p>
                </div>
              </div>
            </div>

            {/* Equipment Details for Tag */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">
                Tag Information
              </h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">SKU:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {equipment.sku}
                  </span>
                </div>
                {equipment.equipmentModel?.name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Model:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {equipment.equipmentModel.name}
                    </span>
                  </div>
                )}
                {equipment.equipmentModel?.category?.name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Category:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {equipment.equipmentModel.category.name}
                    </span>
                  </div>
                )}
                {equipment.brand?.brandName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Brand:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {equipment.brand.brandName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
