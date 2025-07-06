// src/lib/api/strapi.ts - Corrected to match customer website patterns
import axios, { AxiosInstance } from "axios";
import { getSession } from "next-auth/react";

class StrapiAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_STRAPI_URL || "http://127.0.0.1:1337",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(async (config) => {
      const session = await getSession();
      if (session?.strapiToken) {
        config.headers.Authorization = `Bearer ${session.strapiToken}`;
        console.log("🔑 API Request with token:", config.url);
      } else {
        console.log("⚠️ API Request without token:", config.url);
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log("✅ API Success:", response.config.url, response.status);
        return response;
      },
      (error) => {
        console.error(
          "❌ API Error:",
          error.config?.url,
          error.response?.status,
          error.response?.data
        );

        if (error.response?.status === 401) {
          console.error("🚨 401 Unauthorized - Check Strapi permissions");
          if (typeof window !== "undefined") {
            window.location.href = "/auth/signin";
          }
        }

        if (error.response?.status === 403) {
          console.error(
            "🚨 403 Forbidden - User lacks permission for this resource"
          );
        }

        return Promise.reject(error);
      }
    );
  }

  // Test basic connectivity using proven customer patterns
  async testConnection() {
    try {
      console.log("🧪 Testing Strapi connection...");
      const response = await this.client.get("/api/equipment-categories", {
        params: {
          filters: {
            isActive: true,
          },
          sort: "sortOrder:asc",
        },
      });
      console.log("✅ Connection test successful");
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error(
        "❌ Connection test failed:",
        error.response?.status,
        error.response?.data
      );
      return { success: false, error: error.response?.data || error.message };
    }
  }

  // Equipment Categories using customer website patterns
  async getCategories() {
    try {
      console.log("📂 Fetching equipment categories...");
      const response = await this.client.get("/api/equipment-categories", {
        params: {
          filters: {
            isActive: true,
          },
          sort: "sortOrder:asc",
        },
      });
      console.log("✅ Categories loaded:", response.data.data?.length || 0);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to fetch categories:", error.response?.data);
      throw error;
    }
  }

  // Equipment Models using customer website patterns
  async getEquipmentModels() {
    try {
      console.log("🏷️ Fetching equipment models...");
      const response = await this.client.get("/api/equipment-models", {
        params: {
          populate: ["category", "brand", "mainImage"],
          filters: {
            isActive: true,
          },
          sort: "name:asc",
        },
      });
      console.log(
        "✅ Equipment models loaded:",
        response.data.data?.length || 0
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Failed to fetch equipment models:",
        error.response?.data
      );
      throw error;
    }
  }

  // Equipment Instances using corrected Strapi v5 patterns
  async getEquipmentInstances(params?: {
    page?: number;
    pageSize?: number;
    filters?: Record<string, any>;
    sort?: string;
    search?: string;
  }) {
    try {
      console.log("📦 Fetching equipment instances...");

      // Build query parameters using customer website patterns
      const queryParams: any = {
        populate: [
          "equipmentModel",
          "brand",
          "equipmentModel.category",
          "equipmentModel.mainImage",
        ],
        sort: params?.sort || "createdAt:desc",
      };

      // Add pagination
      if (params?.page || params?.pageSize) {
        queryParams.pagination = {
          page: params?.page || 1,
          pageSize: params?.pageSize || 25,
        };
      }

      // Add filters using Strapi v5 syntax
      const filters: any = {
        isActive: true,
        ...params?.filters,
      };

      // Add search filters using $or syntax like customer website
      if (params?.search) {
        filters.$or = [
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

      queryParams.filters = filters;

      const response = await this.client.get("/api/equipment-instances", {
        params: queryParams,
      });

      console.log(
        "✅ Equipment instances loaded:",
        response.data.meta?.pagination?.total || response.data.data?.length || 0
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Failed to fetch equipment instances:",
        error.response?.data
      );
      throw error;
    }
  }

  // Get single equipment instance
  async getEquipmentInstance(id: string) {
    try {
      console.log(`📋 Fetching equipment instance: ${id}`);
      const response = await this.client.get(`/api/equipment-instances/${id}`, {
        params: {
          populate: [
            "equipmentModel",
            "brand",
            "equipmentModel.category",
            "equipmentModel.mainImage",
            "equipmentModel.gallery",
          ],
        },
      });
      console.log("✅ Equipment instance loaded");
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Failed to fetch equipment instance:",
        error.response?.data
      );
      throw error;
    }
  }

  // Brand Prefixes using customer website patterns
  async getBrandPrefixes() {
    try {
      console.log("🏭 Fetching brand prefixes...");
      const response = await this.client.get("/api/brand-prefixes", {
        params: {
          filters: {
            isActive: true,
          },
          sort: "brandName:asc",
        },
      });
      console.log("✅ Brand prefixes loaded:", response.data.data?.length || 0);
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to fetch brand prefixes:", error.response?.data);
      throw error;
    }
  }

  // SKU Admin API - these might be custom endpoints from Phase 3
  async getSKUStatistics() {
    try {
      console.log("📊 Fetching SKU statistics...");
      const response = await this.client.get("/api/sku-admin/statistics");
      console.log("✅ SKU statistics loaded");
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ SKU statistics failed - using fallback data:",
        error.response?.status
      );
      // Return fallback data if the custom API isn't available
      return {
        data: {
          totalSequences: 0,
          totalBrands: 0,
          autoGeneration: true,
        },
      };
    }
  }

  // Dashboard statistics with proper error handling
  async getDashboardStats() {
    try {
      console.log("📊 Loading dashboard statistics...");

      // Test connection first
      const connectionTest = await this.testConnection();
      if (!connectionTest.success) {
        throw new Error(`Strapi connection failed: ${connectionTest.error}`);
      }

      // Load data using proven patterns
      const results = await Promise.allSettled([
        this.getEquipmentInstances({
          pageSize: 1,
        }),
        this.getEquipmentModels(),
        this.getSKUStatistics(),
      ]);

      // Extract successful results
      const [instancesResult, modelsResult, skuStatsResult] = results;

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

          if (statusBreakdown.data) {
            statusCounts = statusBreakdown.data.reduce(
              (acc: Record<string, number>, item: any) => {
                const status =
                  item.attributes?.equipmentStatus ||
                  item.equipmentStatus ||
                  "Unknown";
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

  // Update equipment instance
  async updateEquipmentInstance(
    id: string,
    data: {
      equipmentStatus?: string;
      location?: string;
      condition?: string;
      notes?: string;
      lastMaintenanceDate?: string;
    }
  ) {
    try {
      console.log(`📝 Updating equipment instance: ${id}`);
      const response = await this.client.put(`/api/equipment-instances/${id}`, {
        data,
      });
      console.log("✅ Equipment instance updated");
      return response.data;
    } catch (error: any) {
      console.error(
        "❌ Failed to update equipment instance:",
        error.response?.data
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
        error.response?.data
      );
      throw error;
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

// Export types for equipment data (matching Strapi v5 structure)
export interface EquipmentInstance {
  id: number;
  documentId: string;
  attributes: {
    sku: string;
    serialNumber?: string;
    equipmentStatus:
      | "Available"
      | "Rented"
      | "Maintenance"
      | "Damaged"
      | "Retired";
    location?: string;
    condition?: string;
    notes?: string;
    purchaseDate?: string;
    lastMaintenanceDate?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    equipmentModel?: {
      data: {
        id: number;
        attributes: {
          name: string;
          description?: any;
          specifications?: string;
          category?: {
            data: {
              attributes: {
                name: string;
                skuPrefix: string;
              };
            };
          };
        };
      };
    };
    brand?: {
      data: {
        id: number;
        attributes: {
          brandName: string;
          prefix: string;
        };
      };
    };
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
