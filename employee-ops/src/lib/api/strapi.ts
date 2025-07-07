// employee-ops/src/lib/api/strapi.ts - Updated types and API methods

import axios, { AxiosInstance } from "axios";
import { getSession } from "next-auth/react";

class StrapiAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL:
        process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor for authentication
    this.client.interceptors.request.use(async (config) => {
      const session = await getSession();
      if (session?.strapiToken) {
        config.headers.Authorization = `Bearer ${session.strapiToken}`;
      }
      return config;
    });
  }

  // Get equipment instances with proper typing - FIXED VERSION
  async getEquipmentInstances(
    params: {
      page?: number;
      pageSize?: number;
      search?: string;
      status?: string;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
      filters?: Record<string, any>;
      sort?: string;
    } = {}
  ) {
    try {
      console.log("📦 Loading equipment instances with params:", params);

      // Use object-based parameters like the working customer website
      const queryParams: any = {
        populate: [
          "equipmentModel",
          "brand",
          "equipmentModel.category",
          "equipmentModel.mainImage",
        ],
        pagination: {
          page: params.page || 1,
          pageSize: params.pageSize || 25,
        },
        filters: {
          isActive: true,
          ...params.filters,
        },
        sort: params.sort || "createdAt:desc",
      };

      // Add status filter if provided
      if (params.status) {
        queryParams.filters.equipmentStatus = params.status;
      }

      // Add search using $or syntax like customer website
      if (params.search) {
        queryParams.filters.$or = [
          {
            sku: {
              $containsi: params.search,
            },
          },
          {
            serialNumber: {
              $containsi: params.search,
            },
          },
          {
            equipmentModel: {
              name: {
                $containsi: params.search,
              },
            },
          },
        ];
      }

      // Use axios params object directly (like customer website)
      const response = await this.client.get("/api/equipment-instances", {
        params: queryParams,
      });

      console.log("✅ Raw API response:", response.data);

      // Transform response to match expected format
      const instances = response.data.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        sku: item.sku,
        serialNumber: item.serialNumber,
        equipmentStatus: item.equipmentStatus,
        location: item.location,
        condition: item.condition,
        notes: item.notes,
        purchaseDate: item.purchaseDate,
        purchasePrice: item.purchasePrice,
        warrantyExpiration: item.warrantyExpiration,
        lastMaintenanceDate: item.lastMaintenanceDate,
        nextMaintenanceDate: item.nextMaintenanceDate,
        isActive: item.isActive,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        equipmentModel: item.equipmentModel,
        brand: item.brand,
      }));

      const result = {
        instances,
        pagination: response.data.meta.pagination,
      };

      console.log("✅ Equipment instances loaded:", result);
      return result;
    } catch (error: any) {
      console.error(
        "❌ Failed to load equipment instances:",
        error.response?.data || error.message
      );
      console.error("❌ Full error:", error);
      throw error;
    }
  }

  // Get single equipment instance - FIXED VERSION
  async getEquipmentInstance(id: string) {
    try {
      console.log(`📦 Loading equipment instance: ${id}`);

      // Use object-based parameters like the working getEquipmentInstances method
      const queryParams = {
        populate: [
          "equipmentModel",
          "brand",
          "equipmentModel.category",
          "equipmentModel.mainImage",
        ],
      };

      const response = await this.client.get(`/api/equipment-instances/${id}`, {
        params: queryParams,
      });

      console.log("✅ Raw equipment instance response:", response.data);

      // Transform response - data is at root level in Strapi v5
      const item = response.data.data;
      const transformedInstance = {
        id: item.id,
        documentId: item.documentId,
        sku: item.sku,
        serialNumber: item.serialNumber,
        equipmentStatus: item.equipmentStatus,
        location: item.location,
        condition: item.condition,
        notes: item.notes,
        purchaseDate: item.purchaseDate,
        purchasePrice: item.purchasePrice,
        warrantyExpiration: item.warrantyExpiration,
        lastMaintenanceDate: item.lastMaintenanceDate,
        nextMaintenanceDate: item.nextMaintenanceDate,
        isActive: item.isActive,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        equipmentModel: item.equipmentModel,
        brand: item.brand,
      };

      console.log("✅ Equipment instance loaded:", transformedInstance);
      return transformedInstance;
    } catch (error: any) {
      console.error(
        "❌ Failed to load equipment instance:",
        error.response?.data || error.message
      );
      console.error("❌ Full error:", error);
      throw error;
    }
  }

  // Update equipment instance - CORRECTED PARAMETERS
  async updateEquipmentInstance(
    id: string,
    data: {
      equipmentStatus?: string;
      location?: string; // Changed from currentLocation to location
      condition?: string;
      notes?: string;
      lastMaintenanceDate?: string;
      nextMaintenanceDate?: string;
      serialNumber?: string;
      purchaseDate?: string;
      purchasePrice?: number;
      warrantyExpiration?: string;
    }
  ) {
    try {
      console.log(`📝 Updating equipment instance: ${id}`, data);
      const response = await this.client.put(`/api/equipment-instances/${id}`, {
        data,
      });
      console.log("✅ Equipment instance updated");
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Failed to update equipment instance:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Create equipment instance
  async createEquipmentInstance(data: {
    equipmentModel: string;
    brand: string;
    serialNumber?: string;
    purchaseDate?: string;
    location?: string;
    condition?: string;
    notes?: string;
    skipAutoSKU?: boolean;
  }) {
    try {
      console.log("📝 Creating equipment instance...");
      const response = await this.client.post("/api/equipment-instances", {
        data,
      });
      console.log("✅ Equipment instance created");
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Failed to create equipment instance:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      console.log("📊 Loading dashboard statistics...");

      const [instancesResult, modelsResult, skuStatsResult] =
        await Promise.allSettled([
          this.client.get("/api/equipment-instances", {
            params: {
              "pagination[pageSize]": 1,
              "fields[0]": "equipmentStatus",
            },
          }),
          this.client.get("/api/equipment-models", {
            params: {
              "pagination[pageSize]": 1,
            },
          }),
          this.client.get("/api/sku-admin/statistics"),
        ]);

      const instances =
        instancesResult.status === "fulfilled"
          ? instancesResult.value
          : { meta: { pagination: { total: 0 } }, data: [] };

      const models =
        modelsResult.status === "fulfilled"
          ? modelsResult.value
          : { meta: { pagination: { total: 0 } }, data: [] };

      const skuStats =
        skuStatsResult.status === "fulfilled"
          ? skuStatsResult.value
          : {
              data: { totalSequences: 0, totalBrands: 0, autoGeneration: true },
            };

      // Get status breakdown with larger sample if instances are available
      let statusCounts = {};
      if (
        instancesResult.status === "fulfilled" &&
        instances.data?.length > 0
      ) {
        try {
          const statusBreakdown = await this.getEquipmentInstances({
            pageSize: 100,
          });

          if (statusBreakdown.instances) {
            statusCounts = statusBreakdown.instances.reduce(
              (acc: Record<string, number>, item: any) => {
                const status = item.equipmentStatus || "Unknown";
                acc[status] = (acc[status] || 0) + 1;
                return acc;
              },
              {}
            );
          }
        } catch (error) {
          console.warn("⚠️ Could not load status breakdown, using empty data");
        }
      }

      const dashboardData = {
        totalInstances:
          instances.meta?.pagination?.total || instances.data?.length || 0,
        totalModels: models.meta?.pagination?.total || models.data?.length || 0,
        statusCounts,
        skuStats: skuStats.data || {
          totalSequences: 0,
          totalBrands: 0,
          autoGeneration: true,
        },
      };

      console.log("✅ Dashboard stats loaded:", dashboardData);
      return dashboardData;
    } catch (error: any) {
      console.error("❌ Dashboard stats failed:", error.message);
      // Return empty dashboard instead of throwing
      return {
        totalInstances: 0,
        totalModels: 0,
        statusCounts: {},
        skuStats: { totalSequences: 0, totalBrands: 0, autoGeneration: true },
      };
    }
  }

  // Check current user permissions
  async checkPermissions() {
    try {
      const session = await getSession();
      if (!session?.strapiToken) {
        return { authenticated: false, permissions: [] };
      }

      // Test various endpoints to see what works
      const tests = [
        {
          name: "Equipment Categories",
          endpoint: "/api/equipment-categories",
          params: { filters: { isActive: true } },
        },
        {
          name: "Equipment Models",
          endpoint: "/api/equipment-models",
          params: { populate: ["category"], filters: { isActive: true } },
        },
        {
          name: "Equipment Instances",
          endpoint: "/api/equipment-instances",
          params: { filters: { isActive: true } },
        },
        {
          name: "Brand Prefixes",
          endpoint: "/api/brand-prefixes",
          params: { filters: { isActive: true } },
        },
        {
          name: "SKU Admin",
          endpoint: "/api/sku-admin/statistics",
          params: {},
        },
      ];

      const results = await Promise.allSettled(
        tests.map((test) =>
          this.client
            .get(test.endpoint, { params: test.params })
            .then(() => ({ ...test, success: true }))
            .catch((error) => ({
              ...test,
              success: false,
              error: error.response?.status,
            }))
        )
      );

      const permissions = results.map((result) =>
        result.status === "fulfilled" ? result.value : result.reason
      );

      console.log("🔍 Permission check results:", permissions);
      return { authenticated: true, permissions };
    } catch (error) {
      console.error("❌ Permission check failed:", error);
      return { authenticated: false, permissions: [] };
    }
  }
}

// Export singleton instance
export const strapiAPI = new StrapiAPI();

// CORRECTED Types for equipment data (matching actual Strapi v5 schema)
export interface EquipmentInstance {
  id: number;
  documentId: string;
  sku?: string;
  serialNumber?: string;
  equipmentStatus:
    | "Available"
    | "Rented"
    | "Maintenance"
    | "Damaged"
    | "Retired";
  location?: string; // Note: using 'location' to match schema
  condition?: "Excellent" | "Good" | "Fair" | "Poor";
  notes?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiration?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  equipmentModel?: {
    id: number;
    documentId: string;
    name: string;
    modelNumber?: string;
    category?: {
      id: number;
      name: string;
      skuPrefix: string;
    };
  };
  brand?: {
    id: number;
    documentId: string;
    brandName: string;
    prefix: string;
  };
}

export interface DashboardStats {
  totalInstances: number;
  totalModels: number;
  statusCounts: Record<string, number>;
  skuStats: {
    totalSequences: number;
    totalBrands: number;
    autoGeneration: boolean;
  };
}
