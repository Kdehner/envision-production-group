// frontend/src/app/equipment/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  strapiApi,
  EquipmentModel, // Updated import
  EquipmentCategory,
  getStrapiImageUrl,
  extractTextFromBlocks, // Add this import
} from '@/lib/strapi';
import { brandConfig, brandUtils } from '@/lib/config';
import { PageLayout, BREADCRUMBS } from '@/components';
import { EquipmentCTA } from '@/components/shared/CTAs';
import Link from 'next/link';
import Image from 'next/image';

export default function EquipmentCatalog() {
  const [equipment, setEquipment] = useState<EquipmentModel[]>([]);
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<EquipmentModel[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load data on component mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [equipmentData, categoriesData] = await Promise.all([
          strapiApi.getEquipmentModels(), // Updated method name
          strapiApi.getCategories(),
        ]);

        setEquipment(equipmentData);
        setCategories(categoriesData);
        setFilteredEquipment(equipmentData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Filter equipment based on search and category
  useEffect(() => {
    let filtered = equipment;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((item) => {
        const brandName =
          typeof item.brand === 'string'
            ? item.brand
            : item.brand?.brandName || '';
        const description = Array.isArray(item.description)
          ? extractTextFromBlocks(item.description)
          : typeof item.description === 'string'
          ? item.description
          : '';

        return (
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.shortDescription
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => {
        const categoryId = item.category?.id;
        return categoryId?.toString() === selectedCategory;
      });
    }

    setFilteredEquipment(filtered);
  }, [equipment, searchTerm, selectedCategory]);

  return (
    <PageLayout activeSection="equipment" breadcrumbs={BREADCRUMBS.equipment}>
      {/* Page Header */}
      <section className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Equipment Catalog
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Professional-grade lighting, audio, and staging equipment for
              events of all sizes. Browse our inventory or search for specific
              items.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search Bar */}
            <div className="flex-1">
              <label htmlFor="search" className="sr-only">
                Search equipment
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search equipment, brands, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <label htmlFor="category" className="sr-only">
                Filter by category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Summary */}
            <div className="lg:w-48 flex items-center justify-center lg:justify-end">
              <div className="text-gray-300 text-sm">
                {loading ? (
                  'Loading...'
                ) : (
                  <>
                    Showing {filteredEquipment.length} of {equipment.length}{' '}
                    items
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-center text-white text-xl">
              Loading equipment...
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No equipment found
              </h3>
              <p className="text-gray-300 mb-6">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEquipment.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-700"
                >
                  {/* Equipment Image */}
                  <div className="h-48 bg-gray-700 relative">
                    {item.mainImage ? (
                      <Image
                        src={getStrapiImageUrl(item.mainImage.url)}
                        alt={item.mainImage.alternativeText || item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Equipment Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.name}
                    </h3>

                    {/* Brand Name */}
                    {item.brand && (
                      <p className="text-gray-300 text-sm mb-2">
                        {typeof item.brand === 'string'
                          ? item.brand
                          : item.brand.brandName}
                      </p>
                    )}

                    {/* Description */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {item.shortDescription ||
                        (Array.isArray(item.description)
                          ? extractTextFromBlocks(item.description)
                          : typeof item.description === 'string'
                          ? item.description
                          : 'Professional equipment for your event needs.')}
                    </p>

                    {/* Footer */}
                    <div className="flex justify-between items-center">
                      {/* Category Badge */}
                      {item.category && (
                        <span
                          className="px-2 py-1 rounded-full text-xs font-medium text-white"
                          style={{
                            backgroundColor: brandUtils.getCategoryColor(
                              item.category.slug ||
                                item.category.name.toLowerCase()
                            ),
                          }}
                        >
                          {item.category.name}
                        </span>
                      )}

                      {/* View Details Link */}
                      <Link
                        href={`/equipment/${item.slug}`} // Use slug instead of ID
                        className="text-blue-400 hover:text-blue-300 font-medium text-sm"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <EquipmentCTA />
    </PageLayout>
  );
}
