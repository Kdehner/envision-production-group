// employee-ops/src/components/equipment/MobileQRView.tsx

"use client";

import { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Package,
  Wrench,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { EquipmentInstance } from "@/lib/api/strapi";

interface MobileQRViewProps {
  equipment: EquipmentInstance;
  onBack?: () => void;
}

export default function MobileQRView({ equipment, onBack }: MobileQRViewProps) {
  const router = useRouter();
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(
    null
  );

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200";
      case "rented":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "damaged":
        return "bg-red-100 text-red-800 border-red-200";
      case "retired":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "excellent":
        return "bg-green-100 text-green-800";
      case "good":
        return "bg-blue-100 text-blue-800";
      case "fair":
        return "bg-yellow-100 text-yellow-800";
      case "poor":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 -ml-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Equipment Details
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Scanned via QR Code
            </p>
          </div>
          <button
            onClick={() => router.push(`/equipment/${equipment.documentId}`)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Open full view"
          >
            <ExternalLink className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Equipment Information */}
      <div className="p-4 space-y-4">
        {/* Primary Info Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold font-mono text-gray-900 dark:text-white mb-2">
              {equipment.sku}
            </div>
            {equipment.equipmentModel?.name && (
              <div className="text-lg text-gray-700 dark:text-gray-300 mb-1">
                {equipment.equipmentModel.name}
              </div>
            )}
            {equipment.brand?.brandName && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {equipment.brand.brandName}
              </div>
            )}
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(equipment.equipmentStatus)}`}
            >
              {equipment.equipmentStatus}
            </span>
            {equipment.condition && (
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(equipment.condition)}`}
              >
                {equipment.condition}
              </span>
            )}
          </div>
        </div>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 gap-3">
          {equipment.location && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Location
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {equipment.location}
                  </p>
                </div>
              </div>
            </div>
          )}

          {equipment.equipmentModel?.category?.name && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Package className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Category
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {equipment.equipmentModel.category.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setActiveQuickAction("status")}
              className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Package className="h-5 w-5 mx-auto mb-1" />
              <div className="text-sm font-medium">Update Status</div>
            </button>

            <button
              onClick={() => setActiveQuickAction("location")}
              className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <MapPin className="h-5 w-5 mx-auto mb-1" />
              <div className="text-sm font-medium">Change Location</div>
            </button>

            <button
              onClick={() => setActiveQuickAction("condition")}
              className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
            >
              <Wrench className="h-5 w-5 mx-auto mb-1" />
              <div className="text-sm font-medium">Assess Condition</div>
            </button>

            <button
              onClick={() => setActiveQuickAction("maintenance")}
              className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <Calendar className="h-5 w-5 mx-auto mb-1" />
              <div className="text-sm font-medium">Schedule Maintenance</div>
            </button>
          </div>
        </div>

        {/* Notes */}
        {equipment.notes && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
              Notes
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm whitespace-pre-wrap">
              {equipment.notes}
            </p>
          </div>
        )}

        {/* Additional Details */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 className="font-medium text-gray-900 dark:text-white mb-3">
            Equipment Details
          </h3>
          <div className="space-y-2 text-sm">
            {equipment.serialNumber && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Serial Number:
                </span>
                <span className="font-mono text-gray-900 dark:text-white">
                  {equipment.serialNumber}
                </span>
              </div>
            )}
            {equipment.purchaseDate && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Purchase Date:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(equipment.purchaseDate).toLocaleDateString()}
                </span>
              </div>
            )}
            {equipment.lastMaintenanceDate && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Last Maintenance:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {new Date(equipment.lastMaintenanceDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Full View Button */}
        <div className="pb-4">
          <button
            onClick={() => router.push(`/equipment/${equipment.documentId}`)}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="h-5 w-5" />
            Open Full Equipment View
          </button>
        </div>
      </div>
    </div>
  );
}
