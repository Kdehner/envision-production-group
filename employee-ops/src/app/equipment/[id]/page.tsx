// employee-ops/src/app/equipment/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { use } from "react";
import {
  ArrowLeft,
  Package,
  MapPin,
  Wrench,
  FileText,
  Calendar,
  Edit,
  ExternalLink,
} from "lucide-react";
import { strapiAPI, EquipmentInstance } from "@/lib/api/strapi";
import QuickActionModals from "@/components/equipment/QuickActionModals";

interface EquipmentDetailPageProps {
  params: Promise<{ id: string }>;
}

type ModalType = "status" | "location" | "condition" | "maintenance" | null;

export default function EquipmentDetailPage({
  params,
}: EquipmentDetailPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const resolvedParams = use(params);
  const equipmentId = resolvedParams.id;

  // State
  const [instance, setInstance] = useState<EquipmentInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Authentication redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load equipment instance
  const loadEquipmentInstance = async () => {
    if (status !== "authenticated") return;

    setLoading(true);
    setError(null);

    try {
      const response = await strapiAPI.getEquipmentInstance(equipmentId);
      setInstance(response);
    } catch (err: any) {
      console.error("Equipment loading error:", err);
      setError(err.message || "Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (status === "authenticated" && equipmentId) {
      loadEquipmentInstance();
    }
  }, [status, equipmentId]);

  // Quick action success handler
  const handleQuickActionSuccess = () => {
    loadEquipmentInstance();
    setActiveModal(null);
  };

  // Loading and error states
  if (status === "loading" || (status === "unauthenticated" && loading)) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded mb-6"></div>
            <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !instance) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Equipment Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "The equipment instance could not be found."}
            </p>
            <button
              onClick={() => router.push("/equipment")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Equipment List
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Safe data extraction
  const safeInstance = {
    ...instance,
    sku: instance.sku || "Unknown",
    equipmentStatus: instance.equipmentStatus || "Unknown",
    location: instance.location || "Unknown", // Use 'location' instead of 'currentLocation'
    condition: instance.condition || "Unknown",
    createdAt: instance.createdAt || null,
    updatedAt: instance.updatedAt || null,
    purchaseDate: instance.purchaseDate || null,
    notes: instance.notes || "No notes available",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/equipment")}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Equipment
          </button>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {safeInstance.sku}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                {instance.equipmentModel?.name || "Unknown Model"} -{" "}
                {instance.brand?.brandName ||
                  instance.equipmentModel?.brand?.brandName ||
                  instance.equipmentModel?.brand?.name ||
                  "Unknown Brand"}
              </p>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  safeInstance.equipmentStatus === "Available"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                    : safeInstance.equipmentStatus === "Rented"
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      : safeInstance.equipmentStatus === "Maintenance"
                        ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                        : safeInstance.equipmentStatus === "Damaged"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                          : "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300"
                }`}
              >
                {safeInstance.equipmentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("details")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "details"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "history"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                History
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Equipment Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Equipment Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        SKU
                      </span>
                      <span className="font-mono text-gray-900 dark:text-white">
                        {safeInstance.sku}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Model
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {instance.equipmentModel?.name || "Unknown"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Brand
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {instance.brand?.brandName ||
                          instance.equipmentModel?.brand?.brandName ||
                          "Unknown"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Category
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {instance.equipmentModel?.category?.name || "Unknown"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Current Location
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {safeInstance.location}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Condition
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {safeInstance.condition}
                      </span>
                    </div>
                  </div>

                  {instance.equipmentModel && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() =>
                          router.push(
                            `/models/${instance.equipmentModel?.documentId}`
                          )
                        }
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Equipment Model Details
                      </button>
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Notes
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {safeInstance.notes}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "details" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Detailed Information
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Serial Number
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {instance.serialNumber || "Not specified"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Purchase Price
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {instance.purchasePrice
                        ? `${instance.purchasePrice.toLocaleString()}`
                        : "Not specified"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Warranty Expiration
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {instance.warrantyExpiration
                        ? new Date(
                            instance.warrantyExpiration
                          ).toLocaleDateString()
                        : "Not specified"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Last Maintenance
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {instance.lastMaintenanceDate
                        ? new Date(
                            instance.lastMaintenanceDate
                          ).toLocaleDateString()
                        : "No maintenance recorded"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "history" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Equipment History
                </h3>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <Calendar className="mx-auto h-12 w-12 mb-4" />
                  <p>History tracking will be available in a future update.</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* System Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                System Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Date Added
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {safeInstance.createdAt
                      ? new Date(safeInstance.createdAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Last Updated
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {safeInstance.updatedAt
                      ? new Date(safeInstance.updatedAt).toLocaleDateString()
                      : "Unknown"}
                  </span>
                </div>

                {safeInstance.purchaseDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Purchase Date
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {new Date(safeInstance.purchaseDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={() => setActiveModal("status")}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  <Package className="h-4 w-4" />
                  Update Status
                </button>

                <button
                  onClick={() => setActiveModal("location")}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30"
                >
                  <MapPin className="h-4 w-4" />
                  Change Location
                </button>

                <button
                  onClick={() => setActiveModal("condition")}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                >
                  <FileText className="h-4 w-4" />
                  Assess Condition
                </button>

                <button
                  onClick={() => setActiveModal("maintenance")}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30"
                >
                  <Wrench className="h-4 w-4" />
                  Schedule Maintenance
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Modals - NOW ENABLED! */}
      <QuickActionModals
        selectedItems={new Set([equipmentId])}
        instances={[instance]}
        onClose={() => setActiveModal(null)}
        onSuccess={handleQuickActionSuccess}
        actionType={activeModal}
      />
    </div>
  );
}
