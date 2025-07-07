// employee-ops/src/app/equipment/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Package,
  MapPin,
  Wrench,
  FileText,
  Eye,
  Edit,
  CheckSquare,
  Square,
} from "lucide-react";
import { strapiAPI, EquipmentInstance } from "@/lib/api/strapi";
import QuickActionModals from "@/components/equipment/QuickActionModals";

interface EquipmentData {
  instances: EquipmentInstance[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

type ModalType = "status" | "location" | "condition" | "maintenance" | null;

export default function EquipmentPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Data state
  const [data, setData] = useState<EquipmentData>({
    instances: [],
    pagination: { page: 1, pageSize: 25, pageCount: 1, total: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter/search state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("sku");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Modal and selection state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeModal, setActiveModal] = useState<ModalType>(null);

  // Authentication redirect
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load equipment data
  const loadEquipmentData = async (page = 1) => {
    if (status !== "authenticated") return;

    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        pageSize: 25,
        search: searchTerm,
        status: statusFilter,
        sort: `${sortBy}:${sortOrder}`,
      };

      console.log("📦 Loading equipment with params:", params);
      const response = await strapiAPI.getEquipmentInstances(params);
      setData(response);
    } catch (err: any) {
      console.error("Equipment loading error:", err);
      setError(err.message || "Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  // Initial load and search handling
  useEffect(() => {
    if (status === "authenticated") {
      loadEquipmentData();
    }
  }, [status, searchTerm, statusFilter, sortBy, sortOrder]);

  // Selection handlers
  const handleSelectAll = () => {
    if (selectedItems.size === data.instances.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(data.instances.map((item) => item.documentId)));
    }
  };

  const handleSelectItem = (id: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  };

  // Quick action handlers
  const handleQuickActionSuccess = () => {
    loadEquipmentData(data.pagination.page);
    setSelectedItems(new Set());
    setActiveModal(null);
  };

  // Pagination
  const handlePageChange = (page: number) => {
    loadEquipmentData(page);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Equipment Management
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage equipment instances, track status, and perform bulk
            operations
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by SKU, model, or location..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full lg:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Damaged">Damaged</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="sku">Sort by SKU</option>
                <option value="createdAt">Date Added</option>
                <option value="equipmentStatus">Status</option>
                <option value="currentLocation">Location</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {sortOrder === "asc" ? "↑" : "↓"}
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions Bar */}
        {selectedItems.size > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {selectedItems.size} item{selectedItems.size > 1 ? "s" : ""}{" "}
                  selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveModal("status")}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <Package className="h-4 w-4" />
                  Update Status
                </button>
                <button
                  onClick={() => setActiveModal("location")}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <MapPin className="h-4 w-4" />
                  Change Location
                </button>
                <button
                  onClick={() => setActiveModal("condition")}
                  className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                >
                  <FileText className="h-4 w-4" />
                  Assess Condition
                </button>
                <button
                  onClick={() => setActiveModal("maintenance")}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  <Wrench className="h-4 w-4" />
                  Schedule Maintenance
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Equipment List */}
        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">
                Loading equipment...
              </span>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
              <button
                onClick={() => loadEquipmentData()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {/* Table Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <button
                  onClick={handleSelectAll}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {selectedItems.size === data.instances.length ? (
                    <CheckSquare className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400" />
                  )}
                </button>
                <div className="ml-4 grid grid-cols-12 gap-4 w-full text-sm font-medium text-gray-500 dark:text-gray-400">
                  <div className="col-span-2">SKU</div>
                  <div className="col-span-3">Equipment Model</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Location</div>
                  <div className="col-span-2">Last Updated</div>
                  <div className="col-span-1">Actions</div>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.instances.map((instance) => {
                const isSelected = selectedItems.has(instance.documentId);
                const safeInstance = {
                  ...instance,
                  sku: instance.sku || "Unknown",
                  equipmentStatus: instance.equipmentStatus || "Unknown",
                  location: instance.location || "Unknown", // Use 'location' instead of 'currentLocation'
                  updatedAt: instance.updatedAt || null,
                };

                return (
                  <div
                    key={instance.documentId}
                    className={`px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      isSelected ? "bg-blue-50 dark:bg-blue-900/20" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <button
                        onClick={() => handleSelectItem(instance.documentId)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                      <div className="ml-4 grid grid-cols-12 gap-4 w-full items-center">
                        {/* SKU */}
                        <div className="col-span-2">
                          <div className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                            {safeInstance.sku}
                          </div>
                        </div>

                        {/* Equipment Model */}
                        <div className="col-span-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {instance.equipmentModel?.name || "Unknown Model"}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {instance.brand?.brandName ||
                              instance.equipmentModel?.brand?.brandName ||
                              "Unknown Brand"}
                          </div>
                        </div>

                        {/* Status */}
                        <div className="col-span-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              safeInstance.equipmentStatus === "Available"
                                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                                : safeInstance.equipmentStatus === "Rented"
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                                  : safeInstance.equipmentStatus ===
                                      "Maintenance"
                                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300"
                                    : safeInstance.equipmentStatus === "Damaged"
                                      ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300"
                                      : "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300"
                            }`}
                          >
                            {safeInstance.equipmentStatus}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="col-span-2">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {safeInstance.location}
                          </div>
                        </div>

                        {/* Last Updated */}
                        <div className="col-span-2">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {safeInstance.updatedAt
                              ? new Date(
                                  safeInstance.updatedAt
                                ).toLocaleDateString()
                              : "Unknown"}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1">
                          <div className="flex gap-1">
                            <button
                              onClick={() =>
                                router.push(`/equipment/${instance.documentId}`)
                              }
                              className="p-1 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItems(
                                  new Set([instance.documentId])
                                );
                                setActiveModal("status");
                              }}
                              className="p-1 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              title="Quick Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {data.instances.length === 0 && (
              <div className="px-6 py-12 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
                  No equipment found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {data.pagination.pageCount > 1 && (
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(data.pagination.page - 1)}
              disabled={data.pagination.page === 1}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from(
              { length: Math.min(5, data.pagination.pageCount) },
              (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg ${
                      data.pagination.page === page
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                );
              }
            )}

            <button
              onClick={() => handlePageChange(data.pagination.page + 1)}
              disabled={data.pagination.page === data.pagination.pageCount}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Quick Action Modals - NOW ENABLED! */}
      <QuickActionModals
        selectedItems={selectedItems}
        instances={data.instances}
        onClose={() => {
          setActiveModal(null);
        }}
        onSuccess={handleQuickActionSuccess}
        actionType={activeModal}
      />
    </div>
  );
}
