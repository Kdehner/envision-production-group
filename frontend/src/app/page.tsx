// frontend/src/app/page.tsx - UPDATED VERSION
'use client';

import { useState, useEffect } from 'react';
import {
  strapiApi,
  EquipmentItem,
  EquipmentCategory,
  getStrapiImageUrl,
} from '@/lib/strapi';
import { brandConfig, brandUtils } from '@/lib/config';
import { PageLayout, HeroSection } from '@/components';
import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  const [featuredEquipment, setFeaturedEquipment] = useState<EquipmentItem[]>(
    []
  );
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [equipmentData, categoriesData] = await Promise.all([
          strapiApi.getEquipment(),
          strapiApi.getCategories(),
        ]);

        // Get first 3 items as featured
        setFeaturedEquipment(equipmentData.slice(0, 3));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <PageLayout
      activeSection="home"
      showBreadcrumbs={false} // Homepage doesn't need breadcrumbs
    >
      {/* Hero Section */}
      <HeroSection
        title="Professional Event Equipment & Production Services"
        subtitle="From intimate gatherings to large-scale productions, we provide the technical expertise and professional equipment to bring your vision to life."
        primaryButton={{
          text: 'Browse Equipment',
          href: '/equipment',
        }}
        secondaryButton={{
          text: 'Get Expert Quote',
          href: '/quote',
        }}
        backgroundImage="/images/hero-bg.jpg"
      />

      {/* Featured Equipment Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Featured Equipment
            </h2>
            <p className="text-xl text-gray-300">
              Professional-grade equipment for your next event
            </p>
          </div>

          {loading ? (
            <div className="text-center text-white text-xl">
              Loading featured equipment...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEquipment.map((item) => (
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

                    {/* Category */}
                    {item.equipment_category && (
                      <div className="mb-4">
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
                      </div>
                    )}

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {item.description.replace(/<[^>]*>/g, '')}
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

          {/* View All Equipment Link */}
          <div className="text-center mt-8">
            <Link
              href="/equipment"
              className="inline-block bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Equipment
            </Link>
          </div>
        </div>
      </section>

      {/* Equipment Categories */}
      <section className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Equipment Categories
            </h2>
            <p className="text-xl text-gray-300">
              Explore our comprehensive inventory organized by specialty
            </p>
          </div>

          {loading ? (
            <div className="text-center text-white text-xl">
              Loading categories...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/equipment?category=${category.id}`}
                  className="bg-gray-900 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-all group"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                      {brandUtils.getCategoryIcon(category.slug || '')}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {category.description ||
                        'Professional equipment for your event needs'}
                    </p>
                    <span className="text-yellow-400 group-hover:text-yellow-300 font-medium">
                      Explore {category.name} →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's discuss your event and create a custom solution that brings
            your vision to life.
          </p>
          <div className="space-x-4">
            <Link
              href="/quote"
              className="inline-block bg-yellow-500 text-gray-900 py-3 px-8 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Start Your Project
            </Link>
            <Link
              href="/equipment"
              className="inline-block border-2 border-blue-600 text-blue-400 py-3 px-8 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
            >
              Browse Equipment
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
