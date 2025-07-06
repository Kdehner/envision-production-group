// lib/strapi.ts - Official Strapi v5 + Axios syntax from Strapi blog
import axios from 'axios';

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || 'http://127.0.0.1:1337';

const api = axios.create({
  baseURL: `${STRAPI_URL}/api`,
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
  description: Array<{
    type: string;
    children: Array<{
      text: string;
      type?: string;
    }>;
  }>; // Strapi v5 blocks type
  featured: boolean;
  isActive: boolean;
  showOnWebsite?: boolean;
  // Relations
  category?: EquipmentCategory;
  brand?: BrandPrefix;
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

// Legacy alias for backwards compatibility
export type EquipmentItem = EquipmentModel;

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

// API Functions for Strapi v5 using clean, consistent object syntax
export const strapiApi = {
  // Get all equipment categories
  async getCategories(): Promise<EquipmentCategory[]> {
    try {
      const response = await api.get<StrapiResponse<EquipmentCategory[]>>(
        '/equipment-categories',
        {
          params: {
            filters: {
              isActive: true,
            },
            sort: 'sortOrder:asc',
          },
        }
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
        '/equipment-categories',
        {
          params: {
            filters: {
              slug: slug,
              isActive: true,
            },
          },
        }
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
        '/equipment-models',
        {
          params: {
            populate: ['category', 'brand', 'mainImage'],
            filters: {
              isActive: true,
              showOnWebsite: true,
            },
            sort: 'name:asc',
          },
        }
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
        '/equipment-models',
        {
          params: {
            populate: ['category', 'brand', 'mainImage'],
            filters: {
              category: {
                id: categoryId,
              },
              isActive: true,
              showOnWebsite: true,
            },
            sort: 'name:asc',
          },
        }
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
        '/equipment-models',
        {
          params: {
            populate: ['category', 'brand', 'mainImage'],
            filters: {
              category: {
                slug: categorySlug,
              },
              isActive: true,
              showOnWebsite: true,
            },
            sort: 'name:asc',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching equipment models by category slug:', error);
      return [];
    }
  },

  // Get single equipment model by slug (the working method we'll use)
  async getEquipmentModelBySlug(slug: string): Promise<EquipmentModel | null> {
    try {
      console.log(`Fetching equipment model with slug: ${slug}`);

      const response = await api.get<StrapiResponse<EquipmentModel[]>>(
        '/equipment-models',
        {
          params: {
            populate: ['category', 'brand', 'mainImage', 'gallery', 'manuals'],
            filters: {
              slug: slug,
              isActive: true,
              showOnWebsite: true,
            },
          },
        }
      );

      console.log('Equipment model by slug response:', response.data);
      return response.data.data[0] || null;
    } catch (error) {
      console.error('Error fetching equipment model by slug:', error);
      return null;
    }
  },

  // Legacy support - redirect to slug method
  async getEquipmentModel(id: number): Promise<EquipmentModel | null> {
    console.warn(
      'getEquipmentModel(id) is deprecated. Use getEquipmentModelBySlug(slug) instead.'
    );
    try {
      const response = await api.get<StrapiResponse<EquipmentModel[]>>(
        '/equipment-models',
        {
          params: {
            populate: ['category', 'brand', 'mainImage', 'gallery', 'manuals'],
            filters: {
              id: id,
              isActive: true,
              showOnWebsite: true,
            },
          },
        }
      );
      return response.data.data[0] || null;
    } catch (error) {
      console.error('Error fetching equipment model by id:', error);
      return null;
    }
  },

  // Get featured equipment for homepage
  async getFeaturedEquipment(): Promise<EquipmentModel[]> {
    try {
      const response = await api.get<StrapiResponse<EquipmentModel[]>>(
        '/equipment-models',
        {
          params: {
            populate: ['category', 'brand', 'mainImage'],
            filters: {
              featured: true,
              isActive: true,
              showOnWebsite: true,
            },
            sort: 'name:asc',
          },
        }
      );
      return Array.isArray(response.data.data)
        ? response.data.data
        : response.data.data
        ? [response.data.data]
        : [];
    } catch (error) {
      console.error('Error fetching featured equipment:', error);
      return [];
    }
  },

  // Search equipment models
  async searchEquipmentModels(query: string): Promise<EquipmentModel[]> {
    try {
      const response = await api.get<StrapiResponse<EquipmentModel[]>>(
        '/equipment-models',
        {
          params: {
            populate: ['category', 'brand', 'mainImage'],
            filters: {
              $or: [
                {
                  name: {
                    $containsi: query,
                  },
                },
                {
                  shortDescription: {
                    $containsi: query,
                  },
                },
              ],
              isActive: true,
              showOnWebsite: true,
            },
            sort: 'name:asc',
          },
        }
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
        '/brand-prefixes',
        {
          params: {
            filters: {
              isActive: true,
            },
            sort: 'brandName:asc',
          },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error('Error fetching brand prefixes:', error);
      return [];
    }
  },

  // Legacy support for old API calls
  async getEquipment(): Promise<EquipmentModel[]> {
    return this.getEquipmentModels();
  },

  async getEquipmentItem(id: number): Promise<EquipmentModel | null> {
    return this.getEquipmentModel(id);
  },
};

// Enhanced helper function to properly render Strapi v5 rich text content
export const extractTextFromBlocks = (
  blocks: Array<{
    type: string;
    children: Array<{
      text: string;
      type?: string;
    }>;
  }>
): string => {
  if (!Array.isArray(blocks)) {
    return '';
  }

  const processedBlocks: string[] = [];
  let currentSection: string[] = [];

  blocks.forEach((block) => {
    if (block?.type === 'paragraph' && block?.children) {
      const paragraphText = block.children
        .map((child) => child?.text || '')
        .join('');

      const trimmedText = paragraphText.trim();

      // Skip empty paragraphs
      if (trimmedText === '') {
        // If we have content in current section, push it and start new section
        if (currentSection.length > 0) {
          processedBlocks.push(currentSection.join('\n'));
          currentSection = [];
        }
        return;
      }

      // Check if this is a heading (ends with colon and doesn't start with dash)
      if (trimmedText.endsWith(':') && !trimmedText.startsWith('-')) {
        // Push current section if it exists
        if (currentSection.length > 0) {
          processedBlocks.push(currentSection.join('\n'));
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
    processedBlocks.push(currentSection.join('\n'));
  }

  // Join sections with double line breaks
  return processedBlocks.join('\n\n');
};

// ============================================================================
// ENHANCED IMAGE UTILITY FUNCTIONS - REPLACE THE OLD ONES
// ============================================================================

// Enhanced image URL function with better error handling
export const getStrapiImageUrl = (url: string | null | undefined): string => {
  // Handle null, undefined, or empty string
  if (!url || typeof url !== 'string' || url.trim() === '') {
    console.warn('getStrapiImageUrl: Invalid or empty URL provided:', url);
    return '';
  }

  // If already a full URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Ensure URL starts with /
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;

  // Construct full URL
  const fullUrl = `${STRAPI_URL}${cleanUrl}`;

  return fullUrl;
};

// Safe image validation function
export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string') return false;

  // Check if it's a valid URL format
  try {
    new URL(url.startsWith('http') ? url : `${STRAPI_URL}${url}`);
    return true;
  } catch {
    return false;
  }
};

// Enhanced file URL function
export const getStrapiFileUrl = (url: string | null | undefined): string => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    console.warn('getStrapiFileUrl: Invalid or empty URL provided:', url);
    return '';
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${STRAPI_URL}${cleanUrl}`;
};

// Safe image component props generator
export const getSafeImageProps = (
  image: any,
  fallbackAlt: string = 'Equipment image'
) => {
  if (!image || !image.url) {
    return null;
  }

  const url = getStrapiImageUrl(image.url);
  if (!url) {
    return null;
  }

  return {
    src: url,
    alt: image.alternativeText || fallbackAlt,
    width: image.width || 600,
    height: image.height || 600,
  };
};

// Debug function to log image data
export const debugImageData = (image: any, context: string = 'Image') => {
  console.group(`${context} Debug Info`);
  console.log('Raw image object:', image);
  console.log('Image URL:', image?.url);
  console.log('Alternative text:', image?.alternativeText);
  console.log('Generated URL:', getStrapiImageUrl(image?.url));
  console.log('Is valid URL:', isValidImageUrl(image?.url));
  console.groupEnd();
};

// Consultation-focused helper
export const getEquipmentForQuote = async (
  categorySlug?: string
): Promise<EquipmentModel[]> => {
  if (categorySlug) {
    return await strapiApi.getEquipmentModelsByCategorySlug(categorySlug);
  }
  return await strapiApi.getEquipmentModels();
};
