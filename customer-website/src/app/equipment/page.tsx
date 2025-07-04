// frontend/src/app/equipment/page.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  strapiApi,
  EquipmentItem,
  EquipmentCategory,
  getStrapiImageUrl,
} from '@/lib/strapi';
import { brandConfig, brandUtils } from '@/lib/config';
import { PageLayout, BREADCRUMBS } from '@/components';
import { EquipmentCTA } from '@/components/shared/CTAs';
import Link from 'next/link';
import Image from 'next/image';

export default function EquipmentCatalog() {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [filteredEquipment, setFilteredEquipment] = useState<EquipmentItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load data on component mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [equipmentData, categoriesData] = await Promise.all([
          strapiApi.getEquipment(),
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

  // Filter equipment based on search, category, and status
  useEffect(() => {
    let filtered = equipment;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => {
        const categoryId = item.equipment_category?.id || item.category?.id;
        return categoryId?.toString() === selectedCategory;
      });
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((item) => item.status === statusFilter);
    }

    setFilteredEquipment(filtered);
  }, [equipment, searchTerm, selectedCategory, statusFilter]);

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

      {/* Filters Section */}
      <section className="py-8 bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Search Equipment
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, brand, model..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories
                  .filter((cat) => cat.name.toLowerCase() !== 'video')
                  .map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Availability
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Equipment</option>
                <option value="Available">Available</option>
                <option value="Rented">Currently Rented</option>
                <option value="Maintenance">In Maintenance</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
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
                  setStatusFilter('all');
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
                        <span className="text-6xl">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Equipment Info */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.name}
                    </h3>

                    {(item.brand || item.model) && (
                      <p className="text-gray-300 text-sm mb-2">
                        {item.brand} {item.model}
                      </p>
                    )}

                    {/* Category Badge */}
                    {item.equipment_category && (
                      <div className="mb-3">
                        <span
                          className="inline-block px-2 py-1 rounded text-xs font-medium text-white"
                          style={{
                            backgroundColor: brandUtils.getCategoryColor(
                              item.equipment_category.slug ||
                                item.equipment_category.name.toLowerCase()
                            ),
                          }}
                        >
                          {item.equipment_category.name}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {item.description.replace(/<[^>]*>/g, '')}
                      </p>
                    )}

                    {/* Status and Availability */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-sm text-gray-400">
                        {item.quantity > 1 && (
                          <span className="text-green-400 font-medium">
                            {item.availableQuantity || item.quantity} Available
                          </span>
                        )}
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Available'
                            ? 'bg-green-900 text-green-300'
                            : item.status === 'Rented'
                            ? 'bg-yellow-900 text-yellow-300'
                            : 'bg-red-900 text-red-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Link
                        href={`/equipment/${item.id}`}
                        className="block w-full text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/quote?equipment=${item.id}`}
                        className="block w-full text-center border border-blue-600 text-blue-400 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                      >
                        Request Quote
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <EquipmentCTA />
    </PageLayout>
  );
}
