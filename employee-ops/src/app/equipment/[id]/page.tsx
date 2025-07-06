// src/app/equipment/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { strapiAPI, EquipmentInstance } from "@/lib/api/strapi";
import {
  ArrowLeft,
  Package,
  MapPin,
  Calendar,
  FileText,
  Settings,
  History,
  Camera,
  Download,
  Edit,
  Wrench,
  AlertCircle,
} from "lucide-react";

export default function EquipmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [instance, setInstance] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<
    "status" | "location" | "condition" | "maintenance" | null
  >(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "history" | "maintenance" | "documents"
  >("overview");

  const equipmentId = params.id as string;

  // Load equipment instance data
  useEffect(() => {
    if (!authLoading && user && equipmentId) {
      loadEquipmentInstance();
    }
  }, [authLoading, user, equipmentId]);

  const loadEquipmentInstance = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("📦 Loading equipment instance:", equipmentId);
      const response = await strapiAPI.getEquipmentInstance(equipmentId);
      console.log("✅ Equipment instance response:", response);

      // The data structure is at root level, not in data.attributes
      const instanceData = response.data || response;
      console.log("🔍 Instance data structure:", instanceData);

      // Debug rich text fields if they exist
      if (instanceData?.notes) {
        console.log(
          "📝 Notes structure:",
          JSON.stringify(instanceData.notes, null, 2)
        );
      }

      // Debug equipment model rich text if it exists
      const equipmentModel =
        instanceData?.equipmentModel?.data?.attributes ||
        instanceData?.equipmentModel;
      if (equipmentModel?.description) {
        console.log(
          "📄 Description structure:",
          JSON.stringify(equipmentModel.description, null, 2)
        );
      }
      if (equipmentModel?.specifications) {
        console.log(
          "📋 Specifications structure:",
          JSON.stringify(equipmentModel.specifications, null, 2)
        );
      }

      setInstance(instanceData);
    } catch (err: any) {
      console.error("Failed to load equipment instance:", err);
      setError(err.message || "Failed to load equipment instance");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickActionSuccess = () => {
    loadEquipmentInstance();
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const getStatusColor = (status: string) => {
      switch (status) {
        case "Available":
          return "bg-green-500/20 text-green-400 border-green-500/30";
        case "Rented":
          return "bg-blue-500/20 text-blue-400 border-blue-500/30";
        case "Maintenance":
          return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
        case "Damaged":
          return "bg-red-500/20 text-red-400 border-red-500/30";
        case "Retired":
          return "bg-gray-500/20 text-gray-400 border-gray-500/30";
        default:
          return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      }
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}
      >
        {status}
      </span>
    );
  };

  // Tab navigation component
  const TabButton = ({
    id,
    label,
    icon: Icon,
  }: {
    id: string;
    label: string;
    icon: any;
  }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? "bg-blue-600 text-white"
          : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );

  if (authLoading || loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please sign in to access equipment details.
          </p>
        </div>
      </div>
    );
  }

  if (error || !instance) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Equipment Not Found
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full w-fit mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Equipment Instance Not Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {error || "The requested equipment instance could not be found."}
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => router.push("/equipment")}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Equipment List
              </button>
              <button
                onClick={loadEquipmentInstance}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add safety checks for the instance data
  if (!instance || typeof instance !== "object") {
    console.error("Invalid instance data:", instance);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Invalid Equipment Data
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              The equipment data is invalid or corrupted.
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

  // Enhanced helper function to properly render Strapi v5 rich text content
  const renderRichText = (richTextContent: any): string => {
    if (!richTextContent) return "";

    console.log("🔍 Rendering rich text:", richTextContent);

    // If it's already a string, return it
    if (typeof richTextContent === "string") {
      return richTextContent;
    }

    // Handle Strapi v5 rich text block structure
    if (Array.isArray(richTextContent)) {
      const processedBlocks: string[] = [];
      let currentSection: string[] = [];

      richTextContent.forEach((block: any) => {
        if (block?.type === "paragraph" && block?.children) {
          const paragraphText = block.children
            .map((child: any) => {
              if (typeof child === "string") return child;
              return child?.text || "";
            })
            .join("");

          const trimmedText = paragraphText.trim();

          // Skip empty paragraphs
          if (trimmedText === "") {
            // If we have content in current section, push it and start new section
            if (currentSection.length > 0) {
              processedBlocks.push(currentSection.join("\n"));
              currentSection = [];
            }
            return;
          }

          // Check if this is a heading (ends with colon and doesn't start with dash)
          if (trimmedText.endsWith(":") && !trimmedText.startsWith("-")) {
            // Push current section if it exists
            if (currentSection.length > 0) {
              processedBlocks.push(currentSection.join("\n"));
              currentSection = [];
            }
            // Add heading as its own section
            processedBlocks.push(trimmedText);
            return;
          }

          // Add to current section
          currentSection.push(trimmedText);
        }
      });

      // Don't forget the last section
      if (currentSection.length > 0) {
        processedBlocks.push(currentSection.join("\n"));
      }

      // Join sections with double line breaks
      return processedBlocks.join("\n\n");
    }

    // If it's an object with children (single block)
    if (richTextContent?.children) {
      return richTextContent.children
        .map((child: any) => {
          if (typeof child === "string") return child;
          return child?.text || "";
        })
        .join("");
    }

    // Fallback: try to extract any text property
    if (richTextContent?.text) {
      return richTextContent.text;
    }

    // If it's a plain object, try to stringify and clean it up
    if (typeof richTextContent === "object") {
      try {
        const str = JSON.stringify(richTextContent);
        if (str !== "{}" && str !== "[]") {
          console.warn("⚠️ Unknown rich text structure:", richTextContent);
          return "Rich text content (format not supported)";
        }
      } catch (e) {
        console.error("❌ Error stringifying rich text:", e);
      }
    }

    // Last resort: return empty string instead of [object Object]
    return "";
  };

  // Safely extract data with proper fallbacks and rich text handling
  const equipmentModel =
    instance?.equipmentModel?.data?.attributes || instance?.equipmentModel;
  const category =
    equipmentModel?.category?.data?.attributes || equipmentModel?.category;
  const brand = instance?.brand?.data?.attributes || instance?.brand;

  // Ensure all values are strings or proper primitives for rendering
  const safeInstance = {
    sku: String(instance?.sku || "No SKU"),
    serialNumber: instance?.serialNumber ? String(instance.serialNumber) : null,
    equipmentStatus: String(instance?.equipmentStatus || "Unknown"),
    location: instance?.location ? String(instance.location) : null,
    condition: instance?.condition ? String(instance.condition) : null,
    notes: renderRichText(instance?.notes) || null,
    createdAt: instance?.createdAt || null,
    updatedAt: instance?.updatedAt || null,
    purchaseDate: instance?.purchaseDate || null,
    lastMaintenanceDate: instance?.lastMaintenanceDate || null,
  };

  const safeEquipmentModel = {
    name: equipmentModel?.name ? String(equipmentModel.name) : null,
    description: renderRichText(equipmentModel?.description) || null,
    specifications: renderRichText(equipmentModel?.specifications) || null,
  };

  const safeCategory = {
    name: category?.name ? String(category.name) : null,
  };

  const safeBrand = {
    brandName: brand?.brandName ? String(brand.brandName) : null,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {safeInstance.sku}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {safeEquipmentModel.name || "Equipment Instance Details"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={safeInstance.equipmentStatus} />

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal("status")}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 text-sm"
            >
              <Package className="h-4 w-4" />
              Status
            </button>

            <button
              onClick={() => setActiveModal("location")}
              className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
            >
              <MapPin className="h-4 w-4" />
              Location
            </button>

            <button
              onClick={() => setActiveModal("maintenance")}
              className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm"
            >
              <Wrench className="h-4 w-4" />
              Maintenance
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <TabButton id="overview" label="Overview" icon={Package} />
        <TabButton id="history" label="History" icon={History} />
        <TabButton id="maintenance" label="Maintenance" icon={Wrench} />
        <TabButton id="documents" label="Documents" icon={FileText} />
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === "overview" && (
            <>
              {/* Equipment Details */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Equipment Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        SKU
                      </label>
                      <p className="font-mono text-lg text-gray-900 dark:text-white">
                        {safeInstance.sku}
                      </p>
                    </div>

                    {safeInstance.serialNumber && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Serial Number
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {safeInstance.serialNumber}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Equipment Model
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {safeEquipmentModel.name || "No Model Assigned"}
                      </p>
                    </div>

                    {safeCategory.name && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Category
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {safeCategory.name}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    {safeBrand.brandName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Brand
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {safeBrand.brandName}
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Current Status
                      </label>
                      <div className="flex items-center gap-2">
                        <StatusBadge status={safeInstance.equipmentStatus} />
                      </div>
                    </div>

                    {safeInstance.location && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Location
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {safeInstance.location}
                        </p>
                      </div>
                    )}

                    {safeInstance.condition && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Condition
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {safeInstance.condition}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {safeInstance.notes && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                      Notes
                    </label>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-gray-900 dark:text-white whitespace-pre-line">
                        {safeInstance.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Equipment Model Information */}
              {safeEquipmentModel.name && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Model Information
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Description
                      </label>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-gray-900 dark:text-white whitespace-pre-line">
                          {safeEquipmentModel.description ||
                            "No description available"}
                        </p>
                      </div>
                    </div>

                    {safeEquipmentModel.specifications && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Specifications
                        </label>
                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <p className="text-gray-900 dark:text-white whitespace-pre-line">
                            {safeEquipmentModel.specifications}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {activeTab === "history" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Equipment History
              </h3>
              <div className="text-center py-8">
                <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  History tracking will be implemented in the next phase.
                </p>
              </div>
            </div>
          )}

          {activeTab === "maintenance" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Maintenance Records
              </h3>

              <div className="space-y-4">
                {safeInstance.lastMaintenanceDate && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium text-blue-900 dark:text-blue-100">
                          Last Maintenance
                        </p>
                        <p className="text-blue-700 dark:text-blue-300">
                          {new Date(
                            safeInstance.lastMaintenanceDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-center py-8">
                  <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    Detailed maintenance tracking will be implemented in the
                    next phase.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Documents & Photos
              </h3>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Document management will be implemented in the next phase.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Info
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Created
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

      {/* Quick Action Modals - Temporarily disabled */}
      {/*
      <QuickActionModals
        selectedItems={new Set([equipmentId])}
        instances={[instance]}
        onClose={() => setActiveModal(null)}
        onSuccess={handleQuickActionSuccess}
        actionType={activeModal}
      />
      */}
    </div>
  );
}
