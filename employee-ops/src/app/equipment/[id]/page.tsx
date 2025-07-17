// employee-ops/src/app/equipment/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
  QrCode,
} from "lucide-react";
import { strapiAPI, EquipmentInstance } from "@/lib/api/strapi";
import QuickActionModals from "@/components/equipment/QuickActionModals";
import QRSection from "@/components/equipment/QRSection";
import QRThumbnail from "@/components/equipment/QRThumbnail";
import MobileQRView from "@/components/equipment/MobileQRView";
import { getDeviceInfo, shouldUseMobileQRInterface } from "@/lib/qr";

interface EquipmentDetailPageProps {
  params: Promise<{ id: string }>;
}

type ModalType = "status" | "location" | "condition" | "maintenance" | null;

export default function EquipmentDetailPage({
  params,
}: EquipmentDetailPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const resolvedParams = use(params);
  const equipmentId = resolvedParams.id;

  // State
  const [instance, setInstance] = useState<EquipmentInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // QR-specific state
  const [isQRScan, setIsQRScan] = useState(false);
  const [isMobileOptimized, setIsMobileOptimized] = useState(false);

  // Authentication redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  // QR detection and mobile optimization
  useEffect(() => {
    const qrParam = searchParams.get("qr");
    const tabParam = searchParams.get("tab");
    const isQRAccess = qrParam === "true";
    setIsQRScan(isQRAccess);

    // Set initial tab based on URL parameters
    if (
      tabParam &&
      ["overview", "details", "history", "qr"].includes(tabParam)
    ) {
      setActiveTab(tabParam);
    } else if (isQRAccess) {
      // If QR scan but no specific tab, detect device and set appropriate tab
      getDeviceInfo().then((deviceInfo) => {
        const shouldUseMobile = shouldUseMobileQRInterface(deviceInfo);
        setIsMobileOptimized(shouldUseMobile);

        // If not mobile optimized but QR scan, go to QR tab
        if (!shouldUseMobile) {
          setActiveTab("qr");
        }
      });
    }
  }, [searchParams]);

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
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading equipment details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Equipment Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => router.push("/equipment")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Equipment List
          </button>
        </div>
      </div>
    );
  }

  if (!instance) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Equipment Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The equipment you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push("/equipment")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Equipment List
          </button>
        </div>
      </div>
    );
  }

  // Show mobile-optimized QR view for mobile devices
  if (isQRScan && isMobileOptimized) {
    return (
      <MobileQRView
        equipment={instance}
        onBack={() => router.push("/equipment")}
      />
    );
  }

  // Safe instance for display (with fallbacks)
  const safeInstance = {
    sku: instance.sku || "No SKU",
    equipmentStatus: instance.equipmentStatus || "Unknown",
    condition: instance.condition || "Unknown",
    location: instance.location || "Unknown",
    notes: instance.notes || "No notes available",
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push("/equipment")}
              className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {safeInstance.sku}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {instance.equipmentModel?.name || "Equipment Details"}
              </p>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveModal("status")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              Update Status
            </button>
            <button
              onClick={() => setActiveModal("location")}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Change Location
            </button>
            <button
              onClick={() => setActiveModal("condition")}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
            >
              <Wrench className="h-4 w-4" />
              Assess Condition
            </button>
            <button
              onClick={() => setActiveModal("maintenance")}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Schedule Maintenance
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Status
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {safeInstance.equipmentStatus}
                </p>
              </div>
              <div
                className={`p-3 rounded-full ${
                  safeInstance.equipmentStatus === "Available"
                    ? "bg-green-100 dark:bg-green-900/30"
                    : safeInstance.equipmentStatus === "Rented"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : safeInstance.equipmentStatus === "Maintenance"
                        ? "bg-yellow-100 dark:bg-yellow-900/30"
                        : safeInstance.equipmentStatus === "Damaged"
                          ? "bg-red-100 dark:bg-red-900/30"
                          : "bg-gray-100 dark:bg-gray-900/30"
                }`}
              >
                <Package
                  className={`h-6 w-6 ${
                    safeInstance.equipmentStatus === "Available"
                      ? "text-green-600 dark:text-green-400"
                      : safeInstance.equipmentStatus === "Rented"
                        ? "text-blue-600 dark:text-blue-400"
                        : safeInstance.equipmentStatus === "Maintenance"
                          ? "text-yellow-600 dark:text-yellow-400"
                          : safeInstance.equipmentStatus === "Damaged"
                            ? "text-red-600 dark:text-red-400"
                            : "text-gray-600 dark:text-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Location
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {safeInstance.location}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Condition
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {safeInstance.condition}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                <Wrench className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
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
                onClick={() => setActiveTab("qr")}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === "qr"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300"
                }`}
              >
                <QrCode className="h-4 w-4" />
                QR Code
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
                {/* QR Quick Access Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <QRThumbnail
                        documentId={instance.documentId}
                        sku={instance.sku}
                        size="medium"
                        onClick={() => setActiveTab("qr")}
                      />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Quick QR Access
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Scan for mobile access or view full QR options
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab("qr")}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                    >
                      View QR Options →
                    </button>
                  </div>
                </div>

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
                        {instance.brand?.brandName || "Unknown"}
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
                        Serial Number
                      </span>
                      <span className="text-gray-900 dark:text-white">
                        {instance.serialNumber || "Not specified"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Status
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
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

                  {/* Related Equipment Model Link */}
                  {instance.equipmentModel && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <button
                        onClick={() =>
                          window.open(
                            `https://epg.kevbot.app/equipment/${instance.equipmentModel?.slug}`,
                            "_blank"
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
                        ? `$${instance.purchasePrice.toLocaleString()}`
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
                      Purchase Date
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {instance.purchaseDate
                        ? new Date(instance.purchaseDate).toLocaleDateString()
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

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Next Maintenance
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {instance.nextMaintenanceDate
                        ? new Date(
                            instance.nextMaintenanceDate
                          ).toLocaleDateString()
                        : "Not scheduled"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "qr" && <QRSection equipment={instance} />}

            {activeTab === "history" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Equipment History
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Equipment history tracking will be available in a future
                  update. This will include rental history, maintenance records,
                  and status changes.
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => setActiveModal("status")}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Update Status
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Change equipment availability
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal("location")}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                  <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Change Location
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Update equipment location
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal("condition")}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                  <Wrench className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Assess Condition
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Rate equipment condition
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setActiveModal("maintenance")}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      Schedule Maintenance
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Plan maintenance activities
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Equipment Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Summary
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">SKU:</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {safeInstance.sku}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Location:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {safeInstance.location}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Condition:
                  </span>
                  <span className="text-gray-900 dark:text-white">
                    {safeInstance.condition}
                  </span>
                </div>
                {instance.equipmentModel?.name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Model:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {instance.equipmentModel.name}
                    </span>
                  </div>
                )}
                {instance.brand?.brandName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Brand:
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {instance.brand.brandName}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Modals */}
      {activeModal && (
        <QuickActionModals
          selectedItems={new Set([equipmentId])}
          instances={[instance]}
          onClose={() => setActiveModal(null)}
          onSuccess={handleQuickActionSuccess}
          actionType={activeModal}
        />
      )}
    </div>
  );
}
