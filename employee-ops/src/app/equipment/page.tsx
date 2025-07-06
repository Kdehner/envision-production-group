// src/app/equipment/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { strapiAPI, EquipmentInstance } from "@/lib/api/strapi";
import {
  Search,
  Filter,
  Download,
  Settings,
  RefreshCw,
  Package,
  MapPin,
  FileText,
  Wrench,
} from "lucide-react";

interface EquipmentFilters {
  status?: string;
  category?: string;
  brand?: string;
  location?: string;
  search?: string;
}

interface EquipmentPageData {
  instances: EquipmentInstance[];
  pagination: {
    page: number;
    pageCount: number;
    pageSize: number;
    total: number;
  };
  categories: any[];
  brands: any[];
}

export default function EquipmentPage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<EquipmentPageData>({
    instances: [],
    pagination: { page: 1, pageCount: 1, pageSize: 25, total: 0 },
    categories: [],
    brands: [],
  });
  const [filters, setFilters] = useState<EquipmentFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchDebounce, setSearchDebounce] = useState<NodeJS.Timeout | null>(
    null
  );
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeModal, setActiveModal] = useState<
    "status" | "location" | "condition" | "maintenance" | null
  >(null);

  // Load equipment data
  const loadEquipmentData = useCallback(
    async (currentFilters = filters, page = 1) => {
      if (authLoading || !user) {
        console.log("🔄 Skipping load - auth loading or no user:", {
          authLoading,
          user: !!user,
        });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("🔄 Loading equipment data...", { currentFilters, page });

        // Prepare API parameters
        const params: any = {
          page,
          pageSize: 25,
          sort: "createdAt:desc",
        };

        // Add filters
        if (currentFilters.status) {
          params.filters = {
            ...params.filters,
            equipmentStatus: currentFilters.status,
          };
        }
        if (currentFilters.location) {
          params.filters = {
            ...params.filters,
            location: { $containsi: currentFilters.location },
          };
        }
        if (currentFilters.search) {
          params.search = currentFilters.search;
        }

        console.log("📡 API params:", params);

        // Try to load equipment instances first
        console.log("📦 Fetching equipment instances...");

        // Add proper populate parameters for Strapi v5
        const equipmentParams = {
          ...params,
          populate: [
            "equipmentModel",
            "brand",
            "equipmentModel.category",
            "equipmentModel.mainImage",
          ],
        };

        console.log("📡 Equipment API params with populate:", equipmentParams);
        const instancesResult =
          await strapiAPI.getEquipmentInstances(equipmentParams);
        console.log("✅ Equipment instances result:", instancesResult);

        // Debug: Log the first instance structure to understand the data format
        if (instancesResult.data && instancesResult.data.length > 0) {
          console.log(
            "🔍 First instance structure:",
            JSON.stringify(instancesResult.data[0], null, 2)
          );
        }

        // Set the data even if we can't load categories/brands
        setData({
          instances: instancesResult.data || [],
          pagination: instancesResult.meta?.pagination || {
            page: 1,
            pageCount: 1,
            pageSize: 25,
            total: 0,
          },
          categories: [],
          brands: [],
        });

        console.log("📊 Data set successfully:", {
          instancesCount: instancesResult.data?.length || 0,
          total: instancesResult.meta?.pagination?.total || 0,
        });
      } catch (err: any) {
        console.error("❌ Failed to load equipment data:", err);
        console.error("❌ Error details:", {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(err.message || "Failed to load equipment data");
      } finally {
        setLoading(false);
      }
    },
    [authLoading, user, filters]
  );

  // Initial load
  useEffect(() => {
    console.log("🎯 useEffect triggered:", {
      authLoading,
      user: !!user,
      userDetails: user
        ? { id: user.id, email: user.email, role: user.role }
        : null,
    });
    if (!authLoading && user) {
      console.log("🚀 Starting initial load...");
      loadEquipmentData();
    } else {
      console.log("⏳ Waiting for auth or user...");
    }
  }, [authLoading, user, loadEquipmentData]);

  // Handle search with debouncing
  const handleSearch = (searchTerm: string) => {
    if (searchDebounce) {
      clearTimeout(searchDebounce);
    }

    const newTimeout = setTimeout(() => {
      const newFilters = { ...filters, search: searchTerm };
      setFilters(newFilters);
      loadEquipmentData(newFilters, 1);
    }, 500);

    setSearchDebounce(newTimeout);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof EquipmentFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    loadEquipmentData(newFilters, 1);
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    loadEquipmentData(filters, newPage);
  };

  // Handle item selection
  const toggleItemSelection = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === data.instances.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(data.instances.map((item) => item.documentId)));
    }
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
        className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
      >
        {status}
      </span>
    );
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
            Please sign in to access equipment management.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Equipment Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track and manage individual equipment instances
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => loadEquipmentData()}
            disabled={loading}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          <button
            onClick={async () => {
              console.log("🧪 Testing Strapi connection...");
              try {
                const testResult = await strapiAPI.testConnection();
                console.log("🧪 Connection test result:", testResult);
                alert(
                  `Connection test: ${testResult.success ? "SUCCESS" : "FAILED"}\nCheck console for details`
                );
              } catch (err) {
                console.error("🧪 Connection test failed:", err);
                alert("Connection test failed - check console");
              }
            }}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
          >
            Test API
          </button>

          <button
            onClick={async () => {
              console.log("🔄 Manual equipment load triggered...");
              await loadEquipmentData();
            }}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Load Equipment
          </button>

          {selectedItems.size > 0 && (
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {selectedItems.size} selected
              </div>

              {/* Temporarily disabled quick action buttons for debugging */}
              <span className="text-xs text-gray-500">
                Quick actions temporarily disabled
              </span>

              {/*
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
                onClick={() => setActiveModal("condition")}
                className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2 text-sm"
              >
                <FileText className="h-4 w-4" />
                Condition
              </button>
              
              <button
                onClick={() => setActiveModal("maintenance")}
                className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2 text-sm"
              >
                <Wrench className="h-4 w-4" />
                Maintenance
              </button>
              */}
            </div>
          )}

          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Equipment
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by SKU, serial number, or model..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={filters.status || ""}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Rented">Rented</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Damaged">Damaged</option>
              <option value="Retired">Retired</option>
            </select>
          </div>

          {/* Location Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              placeholder="Filter by location..."
              value={filters.location || ""}
              onChange={(e) => handleFilterChange("location", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.status || filters.location || filters.search) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {filters.search && (
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm">
                Search: "{filters.search}"
                <button
                  onClick={() => handleFilterChange("search", "")}
                  className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                >
                  ×
                </button>
              </span>
            )}
            {filters.status && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                Status: {filters.status}
                <button
                  onClick={() => handleFilterChange("status", "")}
                  className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                >
                  ×
                </button>
              </span>
            )}
            {filters.location && (
              <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 rounded-full text-sm">
                Location: {filters.location}
                <button
                  onClick={() => handleFilterChange("location", "")}
                  className="ml-2 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {loading
            ? "Loading equipment..."
            : error
              ? `Error: ${error}`
              : `Showing ${data.instances.length} of ${data.pagination.total} equipment instances`}
        </p>

        {data.pagination.total > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Page {data.pagination.page} of {data.pagination.pageCount}
          </div>
        )}
      </div>

      {/* Equipment Table */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
              Try Again
            </button>
          </div>
        </div>
      ) : data.instances.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No equipment instances found matching your criteria.
            </p>
            <button
              onClick={() => {
                setFilters({});
                loadEquipmentData({}, 1);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 dark:text-gray-300">
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={
                    selectedItems.size === data.instances.length &&
                    data.instances.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-blue-600 focus:ring-blue-500"
                />
              </div>
              <div className="col-span-2">SKU</div>
              <div className="col-span-3">Equipment Model</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Location</div>
              <div className="col-span-2">Actions</div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {data.instances.map((instance) => {
              // Safety check for data structure
              if (!instance || !instance.sku) {
                console.warn("⚠️ Invalid instance:", instance);
                return null;
              }

              // Data is at root level, not in attributes
              const equipmentModel =
                instance.equipmentModel?.data?.attributes ||
                instance.equipmentModel;
              const brand = instance.brand?.data?.attributes || instance.brand;
              const category =
                equipmentModel?.category?.data?.attributes ||
                equipmentModel?.category;

              return (
                <div
                  key={instance.documentId}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 items-center">
                    {/* Checkbox */}
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedItems.has(instance.documentId)}
                        onChange={() =>
                          toggleItemSelection(instance.documentId)
                        }
                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-blue-600 focus:ring-blue-500"
                      />
                    </div>

                    {/* SKU */}
                    <div className="col-span-2">
                      <div className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                        {instance.sku}
                      </div>
                      {instance.serialNumber && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          S/N: {instance.serialNumber}
                        </div>
                      )}
                    </div>

                    {/* Equipment Model */}
                    <div className="col-span-3">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {equipmentModel?.name || "No Model Assigned"}
                      </div>
                      {category?.name && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {category.name}
                        </div>
                      )}
                      {brand?.brandName && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Brand: {brand.brandName}
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <StatusBadge status={instance.equipmentStatus} />
                    </div>

                    {/* Location */}
                    <div className="col-span-2">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {instance.location || "Not specified"}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            (window.location.href = `/equipment/${instance.documentId}`)
                          }
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            // Temporarily disabled for debugging
                            console.log(
                              "Edit clicked for:",
                              instance.documentId
                            );
                          }}
                          className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {data.pagination.pageCount > 1 && (
        <div className="flex justify-center items-center gap-2">
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

      {/* Quick Action Modals - Temporarily disabled for debugging */}
      {/*
      <QuickActionModals
        selectedItems={selectedItems}
        instances={data.instances}
        onClose={() => {
          setActiveModal(null);
          setSelectedItems(new Set());
        }}
        onSuccess={() => {
          loadEquipmentData();
          setSelectedItems(new Set());
        }}
        actionType={activeModal}
      />
      */}
    </div>
  );
}
