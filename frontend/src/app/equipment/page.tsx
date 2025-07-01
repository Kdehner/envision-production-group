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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading equipment catalog...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-white hover:text-blue-400"
              >
                {brandConfig.company.name}
              </Link>
            </div>
            <nav className="flex space-x-8">
              {brandConfig.navigation.main.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={
                    item.href === '/equipment'
                      ? 'text-white hover:text-blue-400'
                      : 'text-gray-300 hover:text-blue-400'
                  }
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Page Header */}
      <section className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Equipment Catalog
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Browse our professional event equipment. Contact us for
              personalized recommendations and custom quotes.
            </p>
          </div>

          {/* Centered Quick Quote CTA */}
          <div className="flex justify-center">
            <div className="bg-gray-800 border-2 border-yellow-500 rounded-lg p-6 max-w-4xl w-full">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <div className="flex items-center space-x-3 flex-1">
                  <span className="text-yellow-400 text-2xl">💡</span>
                  <div className="text-center md:text-left">
                    <h3 className="text-yellow-400 font-semibold mb-2">
                      Need help choosing equipment?
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Our equipment specialists will help you find the perfect
                      solution for your event.
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <Link
                    href="/quote"
                    className="inline-block bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-center"
                  >
                    Get Expert Quote
                  </Link>
                  <a
                    href={`tel:${brandConfig.contact.phone.replace(/\D/g, '')}`}
                    className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors text-center"
                  >
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Filters Section */}
      <section className="sticky top-0 z-10 bg-gray-800 border-b border-gray-700 py-6 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Search Equipment
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by name, brand, or model..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Availability
              </label>
              <select
                id="status"
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
          </div>

          {/* Results Count and Clear Filters */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-gray-300">
              Showing {filteredEquipment.length} of {equipment.length} items
            </div>
            {(searchTerm ||
              selectedCategory !== 'all' ||
              statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setStatusFilter('all');
                }}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEquipment.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-xl mb-4">
                No equipment found
              </div>
              <p className="text-gray-500 mb-6">
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
              <Link
                href="/quote"
                className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Tell Us What You Need
              </Link>
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

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Available'
                            ? 'bg-green-900 text-green-300'
                            : item.status === 'Rented'
                            ? 'bg-red-900 text-red-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Equipment Details */}
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {item.name}
                    </h3>

                    {/* Brand and Model */}
                    {(item.brand || item.model) && (
                      <p className="text-gray-300 text-sm mb-3">
                        {item.brand} {item.model}
                      </p>
                    )}

                    {/* SKU and Category */}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-gray-400">
                        SKU: {item.sku}
                      </span>
                      {item.equipment_category && (
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor:
                              brandUtils.getCategoryColor(
                                item.equipment_category.slug || ''
                              ) + '20',
                            color: brandUtils.getCategoryColor(
                              item.equipment_category.slug || ''
                            ),
                          }}
                        >
                          {item.equipment_category.name}
                        </span>
                      )}
                    </div>

                    {/* Quantity Info */}
                    {item.quantity > 1 && (
                      <div className="text-sm text-gray-400 mb-4">
                        <span className="text-green-400 font-medium">
                          {item.availableQuantity}/{item.quantity} Available
                        </span>
                      </div>
                    )}

                    {/* Specifications Preview */}
                    {item.specifications && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(item.specifications)
                            .slice(0, 2) // Show first 2 specs
                            .map(([key, value]) => (
                              <span
                                key={key}
                                className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs"
                              >
                                {value as string}
                              </span>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {item.description.replace(/<[^>]*>/g, '')}{' '}
                        {/* Strip HTML tags */}
                      </p>
                    )}

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
                        className="block w-full text-center border border-yellow-500 text-yellow-400 py-2 rounded-lg hover:bg-yellow-500 hover:text-gray-900 transition-colors"
                      >
                        Get Quote
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="bg-gray-800 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Plan Your Event?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Our equipment specialists are ready to help you create the perfect
            setup for your event.
          </p>
          <div className="space-x-4">
            <Link
              href="/quote"
              className="inline-block bg-yellow-500 text-gray-900 py-3 px-8 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Start Your Quote
            </Link>
            <a
              href={`tel:${brandConfig.contact.phone.replace(/\D/g, '')}`}
              className="inline-block border-2 border-blue-600 text-blue-400 py-3 px-8 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Call {brandUtils.formatPhone()}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4">
              {brandConfig.company.name}
            </h4>
            <p className="text-gray-300 mb-6">{brandConfig.company.tagline}</p>
            <div className="flex justify-center space-x-8">
              <span>📧 {brandConfig.contact.email}</span>
              <span>📞 {brandUtils.formatPhone()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
