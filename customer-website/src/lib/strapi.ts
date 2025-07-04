// lib/strapi.ts
import axios from 'axios';

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || 'http://192.168.0.41:1337';

const api = axios.create({
  baseURL: STRAPI_URL,
});

// Types for Strapi v3.6.8 structure
export interface EquipmentCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface EquipmentItem {
  id: number;
  name: string;
  model?: string;
  brand?: string;
  description?: string;
  sku: string;
  quantity: number;
  availableQuantity: number;
  status: 'Available' | 'Rented' | 'Maintenance' | 'Damaged' | 'Retired';
  location?: string;
  featured: boolean;
  specifications?: any;
  tags?: string[];
  serialNumber?: string;
  slug?: string;
  category?: EquipmentCategory;
  mainImage?: {
    url: string;
    alternativeText?: string;
  };
  gallery?: Array<{
    url: string;
    alternativeText?: string;
  }>;
  created_at: string;
  updated_at: string;
}

// API Functions
export const strapiApi = {
  // Get all equipment categories
  async getCategories(): Promise<EquipmentCategory[]> {
    try {
      const response = await api.get('/equipment-categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get all equipment items
  async getEquipment(): Promise<EquipmentItem[]> {
    try {
      const response = await api.get('/equipment-items');
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment:', error);
      return [];
    }
  },

  // Get equipment by category
  async getEquipmentByCategory(categoryId: number): Promise<EquipmentItem[]> {
    try {
      const response = await api.get(
        `/equipment-items?category.id=${categoryId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment by category:', error);
      return [];
    }
  },

  // Get single equipment item
  async getEquipmentItem(id: number): Promise<EquipmentItem | null> {
    try {
      const response = await api.get(`/equipment-items/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching equipment item:', error);
      return null;
    }
  },

  // Get featured equipment
  async getFeaturedEquipment(): Promise<EquipmentItem[]> {
    try {
      const response = await api.get('/equipment-items?featured=true');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured equipment:', error);
      return [];
    }
  },
};

// Helper function to get full image URL
export const getStrapiImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
};
