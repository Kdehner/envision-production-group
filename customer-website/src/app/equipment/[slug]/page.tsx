// frontend/src/app/equipment/[slug]/page.tsx
'use client'; // Make it a client component for interactivity

import React, { useState } from 'react';
import {
  strapiApi,
  getStrapiImageUrl,
  extractTextFromBlocks,
  EquipmentModel,
} from '@/lib/strapi';
import { brandConfig, brandUtils } from '@/lib/config';
import { PageLayout, BREADCRUMBS } from '@/components';
import { ConsultationCTA } from '@/components/shared/CTAs';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface EquipmentDetailPageProps {
  params: Promise<{ slug: string }>;
}

// We need to fetch data on client side now
export default function EquipmentDetailPage({
  params,
}: EquipmentDetailPageProps) {
  const [equipment, setEquipment] = useState<EquipmentModel | null>(null);
  const [relatedEquipment, setRelatedEquipment] = useState<EquipmentModel[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Fetch data on component mount
  React.useEffect(() => {
    async function loadData() {
      const { slug } = await params;

      try {
        setLoading(true);

        // Fetch the specific equipment model by slug
        const equipmentData = await strapiApi.getEquipmentModelBySlug(slug);

        if (!equipmentData) {
          notFound();
          return;
        }

        setEquipment(equipmentData);

        // Fetch related equipment (same category, excluding current item)
        const allEquipment = await strapiApi.getEquipmentModels();
        const related = allEquipment
          .filter((item) => {
            return (
              item.id !== equipmentData.id &&
              item.category?.id === equipmentData.category?.id
            );
          })
          .slice(0, 3);

        setRelatedEquipment(related);
      } catch (error) {
        console.error('Error loading equipment:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params]);

  // Helper function to render blocks description
  const renderDescription = (description: any) => {
    if (Array.isArray(description)) {
      return extractTextFromBlocks(description);
    }
    if (typeof description === 'string') {
      return description;
    }
    return 'Professional equipment specifications and details available upon request.';
  };

  // Create image gallery array (main image + gallery images)
  const getAllImages = () => {
    if (!equipment) return [];

    const images = [];

    // Add main image first
    if (equipment.mainImage) {
      images.push(equipment.mainImage);
    }

    // Add gallery images
    if (equipment.gallery && equipment.gallery.length > 0) {
      images.push(...equipment.gallery);
    }

    return images;
  };

  const allImages = getAllImages();
  const currentImage = allImages[selectedImageIndex];

  if (loading) {
    return (
      <PageLayout activeSection="equipment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center text-white text-xl">
            Loading equipment details...
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!equipment) {
    notFound();
    return null;
  }

  return (
    <PageLayout
      activeSection="equipment"
      breadcrumbs={BREADCRUMBS.equipmentDetail(equipment.name)}
    >
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Interactive Image Gallery */}
          <div className="space-y-4">
            {/* Main Image Display */}
            <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
              {currentImage ? (
                <Image
                  src={getStrapiImageUrl(currentImage.url)}
                  alt={currentImage.alternativeText || equipment.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span className="text-6xl">📦</span>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails - Clickable */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.slice(0, 8).map((image, index) => (
                  <button
                    key={image.id || index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square bg-gray-700 rounded-lg overflow-hidden transition-all duration-200 ${
                      selectedImageIndex === index
                        ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900'
                        : 'hover:ring-2 hover:ring-gray-400 hover:ring-offset-2 hover:ring-offset-gray-900'
                    }`}
                  >
                    <Image
                      src={getStrapiImageUrl(image.url)}
                      alt={
                        image.alternativeText ||
                        `${equipment.name} ${index + 1}`
                      }
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Image Counter */}
            {allImages.length > 1 && (
              <div className="text-center text-gray-400 text-sm">
                {selectedImageIndex + 1} of {allImages.length}
              </div>
            )}
          </div>

          {/* Equipment Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {equipment.name}
              </h1>

              {/* Brand and Category */}
              <div className="flex flex-wrap gap-2 mb-4">
                {equipment.brand && (
                  <span className="inline-block bg-gray-700 text-gray-300 text-sm px-3 py-1 rounded">
                    {typeof equipment.brand === 'string'
                      ? equipment.brand
                      : equipment.brand.brandName}
                  </span>
                )}
                {equipment.category && (
                  <span
                    className="inline-block text-white text-sm px-3 py-1 rounded font-medium"
                    style={{
                      backgroundColor: brandUtils.getCategoryColor(
                        equipment.category.slug ||
                          equipment.category.name.toLowerCase()
                      ),
                    }}
                  >
                    {equipment.category.name}
                  </span>
                )}
              </div>

              {/* Short Description */}
              {equipment.shortDescription && (
                <p className="text-lg text-gray-300 mb-4">
                  {equipment.shortDescription}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Description
              </h2>
              <div className="text-gray-300 space-y-3">
                <p>{renderDescription(equipment.description)}</p>
              </div>
            </div>

            {/* Enhanced Manuals/Downloads Section */}
            {equipment.manuals && equipment.manuals.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  Documentation & Downloads
                </h2>
                <div className="space-y-3">
                  {equipment.manuals.map((manual, index) => (
                    <a
                      key={manual.id || index}
                      href={getStrapiImageUrl(manual.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700 hover:border-blue-500"
                    >
                      <div className="flex-shrink-0">
                        <span className="text-blue-400 text-2xl">📄</span>
                      </div>
                      <div className="flex-grow">
                        <div className="text-white font-medium mb-1">
                          {manual.name || `Manual ${index + 1}`}
                        </div>
                        <div className="text-gray-400 text-sm">
                          {manual.mime} •{' '}
                          {Math.round((manual.size || 0) / 1024)} KB
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-blue-400 text-sm font-medium">
                          Download →
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">
                Need This Equipment?
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                Our equipment specialists can provide technical details,
                availability, and package recommendations for your event.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={`/quote?equipment=${encodeURIComponent(
                    equipment.name
                  )}`}
                  className="flex-1 bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Request Quote
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 bg-gray-700 text-white text-center px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Contact Us
                </Link>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-white font-medium mb-2">
                  Get Expert Consultation
                </h4>
                <p className="text-gray-300 text-sm mb-3">
                  Our equipment specialists can provide technical details,
                  availability, and package recommendations.
                </p>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-300">
                    📧 {brandConfig.contact.email}
                  </p>
                  <p className="text-gray-300">📞 {brandUtils.formatPhone()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Equipment */}
        {relatedEquipment.length > 0 && (
          <section className="mt-16">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white">
                Related Equipment
              </h2>
              <Link
                href="/equipment"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                View All Equipment →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEquipment.map((item) => (
                <Link
                  key={item.id}
                  href={`/equipment/${item.slug}`}
                  className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all overflow-hidden border border-gray-700 hover:border-blue-500 group"
                >
                  <div className="h-48 bg-gray-700 relative">
                    {item.mainImage ? (
                      <Image
                        src={getStrapiImageUrl(item.mainImage.url)}
                        alt={item.mainImage.alternativeText || item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <span className="text-4xl">📦</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {item.name}
                    </h3>
                    {item.brand && (
                      <p className="text-gray-300 text-sm mb-2">
                        {typeof item.brand === 'string'
                          ? item.brand
                          : item.brand.brandName}
                      </p>
                    )}
                    <div className="flex justify-between items-center">
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
                      <span className="text-blue-400 text-sm">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Consultation CTA */}
      <ConsultationCTA />
    </PageLayout>
  );
}
