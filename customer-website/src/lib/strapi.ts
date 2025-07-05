// lib/strapi.ts - Updated for Strapi v5 and EPG Two-Tier Architecture
import axios from 'axios';

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`, // Note: /api prefix for Strapi v5
});

// Types for Strapi v5 structure and EPG two-tier system
export interface EquipmentCategory {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description?: string;
  skuPrefix: string;
  isActive: boolean;
  sortOrder: number;
  icon?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface BrandPrefix {
  id: number;
  documentId: string;
  brandName: string;
  prefix: string;
  description?: string;
  website?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface EquipmentModel {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  brand: string;
  model?: string;
  specifications?: Record<string, unknown>;
  featured: boolean;
  isActive: boolean;
  showOnWebsite: boolean;
  metaDescription?: string;
  keywords?: string;
  // Relations
  category?: EquipmentCategory;
  mainImage?: {
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  };
  gallery?: Array<{
    id: number;
    documentId: string;
    url: string;
    alternativeText?: string;
    width?: number;
    height?: number;
  }>;
  manuals?: Array<{
    id: number;
    documentId: string;
    url: string;
    name: string;
    mime: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Strapi v5 API response wrapper
interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// API Functions for Strapi v5 with EPG business logic
export const strapiApi = {
  // Get all equipment categories
  async getCategories(): Promise<EquipmentCategory[]> {
    try {
      const response = await api.get<StrapiResponse<EquipmentCategory[]>>(
        '/equipment-categories?sort=sortOrder:asc&filters[isActive][$eq]=true'
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get single category by slug
  async getCategoryBySlug(slug: string): Promise<EquipmentCategory | null> {
    try {
      const response = await api.get<StrapiResponse<EquipmentCategory[]>>(
        `/equipment-categories?filters[slug][$eq]=${slug}&filters[isActive][$eq]=true`
      );
      return response.data.data[0] || null;
    } catch (error) {
      console.error('Error fetching category by slug:', error);
      return null;
    }
  },

  // Get all equipment models (customer-facing catalog)
  async getEquipmentModels(): Promise<EquipmentModel[]> {
    try {
      const response = await api.get<StrapiResponse<EquipmentModel[]>>(
        '/equipment-models?populate[category]=*&populate[mainImage]=*&filters[isActive][$eq]=true&filters[showOnWebsite][$eq]=true&sort=name:asc'
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching equipment models:', error);
      return [];
    }
  },

  // Get equipment models by category
  async getEquipmentModelsByCategory(
    categoryId: number
  ): Promise<EquipmentModel[]> {
    try {
      const response = await api.get<StrapiResponse<EquipmentModel[]>>(
        `/equipment-models?populate[category]=*&populate[mainImage]=*&filters[category][id][$eq]=${categoryId}&filters[isActive][$eq]=true&filters[showOnWebsite][$eq]=true&sort=name:asc`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching equipment models by category:', error);
      return [];
    }
  },

  // Get equipment models by category slug
  async getEquipmentModelsByCategorySlug(
    categorySlug: string
  ): Promise<EquipmentModel[]> {
    try {
      const response = await api.get<StrapiResponse<EquipmentModel[]>>(
        `/equipment-models?populate[category]=*&populate[mainImage]=*&filters[category][slug][$eq]=${categorySlug}&filters[isActive][$eq]=true&filters[showOnWebsite][$eq]=true&sort=name:asc`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching equipment models by category slug:', error);
      return [];
    }
  },

  // Get single equipment model
  async getEquipmentModel(id: number): Promise<EquipmentModel | null> {
    try {
      const response = await api.get<StrapiResponse<EquipmentModel>>(
        `/equipment-models/${id}?populate[category]=*&populate[mainImage]=*&populate[gallery]=*&populate[manuals]=*`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching equipment model:', error);
      return null;
    }
  },

  // Get equipment model by slug
  async getEquipmentModelBySlug(slug: string): Promise<EquipmentModel | null> {
    try {
      const response = await api.get<StrapiResponse<EquipmentModel[]>>(
        `/equipment-models?populate[category]=*&populate[mainImage]=*&populate[gallery]=*&populate[manuals]=*&filters[slug][$eq]=${slug}&filters[isActive][$eq]=true&filters[showOnWebsite][$eq]=true`
      );
      return response.data.data[0] || null;
    } catch (error) {
      console.error('Error fetching equipment model by slug:', error);
      return null;
    }
  },

  // Get featured equipment models (for homepage)
  async getFeaturedEquipment(): Promise<EquipmentModel[]> {
    try {
      const response = await api.get<StrapiResponse<EquipmentModel[]>>(
        '/equipment-models?populate[category]=*&populate[mainImage]=*&filters[featured][$eq]=true&filters[isActive][$eq]=true&filters[showOnWebsite][$eq]=true&sort=name:asc'
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching featured equipment:', error);
      return [];
    }
  },

  // Search equipment models
  async searchEquipmentModels(query: string): Promise<EquipmentModel[]> {
    try {
      const response = await api.get<StrapiResponse<EquipmentModel[]>>(
        `/equipment-models?populate[category]=*&populate[mainImage]=*&filters[$or][0][name][$containsi]=${query}&filters[$or][1][shortDescription][$containsi]=${query}&filters[$or][2][brand][$containsi]=${query}&filters[isActive][$eq]=true&filters[showOnWebsite][$eq]=true&sort=name:asc`
      );
      return response.data.data;
    } catch (error) {
      console.error('Error searching equipment models:', error);
      return [];
    }
  },

  // Get brand prefixes (for future use)
  async getBrandPrefixes(): Promise<BrandPrefix[]> {
    try {
      const response = await api.get<StrapiResponse<BrandPrefix[]>>(
        '/brand-prefixes?filters[isActive][$eq]=true&sort=brandName:asc'
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching brand prefixes:', error);
      return [];
    }
  },
};

// Helper function to get full image URL (handles both absolute and relative URLs)
export const getStrapiImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
};

// Helper function to get file URL (for manuals/PDFs)
export const getStrapiFileUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
};

// Consultation-focused helper - no inventory quantities exposed
export const getEquipmentForQuote = async (
  categorySlug?: string
): Promise<EquipmentModel[]> => {
  if (categorySlug) {
    return await strapiApi.getEquipmentModelsByCategorySlug(categorySlug);
  }
  return await strapiApi.getEquipmentModels();
};
