// frontend/src/app/equipment/[slug]/page.tsx
'use client';

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

export default function EquipmentDetailPage({
  params,
}: EquipmentDetailPageProps) {
  const [equipment, setEquipment] = useState<EquipmentModel | null>(null);
  const [relatedEquipment, setRelatedEquipment] = useState<EquipmentModel[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);

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

  // Create image gallery array (main image + gallery images) with validation
  const getAllImages = () => {
    if (!equipment) return [];

    const images = [];

    // Add main image first (with validation)
    if (equipment.mainImage && equipment.mainImage.url) {
      images.push(equipment.mainImage);
    }

    // Add gallery images (with validation)
    if (equipment.gallery && Array.isArray(equipment.gallery)) {
      equipment.gallery.forEach((image) => {
        if (image && image.url) {
          images.push(image);
        }
      });
    }

    return images;
  };

  const allImages = getAllImages();
  const currentImage = allImages[selectedImageIndex];

  // Calculate visible thumbnails (4 at a time)
  const maxVisibleThumbnails = 4;
  const visibleThumbnails = allImages.slice(
    thumbnailStartIndex,
    thumbnailStartIndex + maxVisibleThumbnails
  );

  // Navigation functions
  const goToPrevious = () => {
    const newIndex =
      selectedImageIndex === 0 ? allImages.length - 1 : selectedImageIndex - 1;
    setSelectedImageIndex(newIndex);

    // Adjust thumbnail view if needed
    if (newIndex < thumbnailStartIndex) {
      setThumbnailStartIndex(Math.max(0, newIndex - maxVisibleThumbnails + 1));
    } else if (newIndex >= thumbnailStartIndex + maxVisibleThumbnails) {
      setThumbnailStartIndex(
        Math.min(allImages.length - maxVisibleThumbnails, newIndex)
      );
    }
  };

  const goToNext = () => {
    const newIndex =
      selectedImageIndex === allImages.length - 1 ? 0 : selectedImageIndex + 1;
    setSelectedImageIndex(newIndex);

    // Adjust thumbnail view if needed
    if (newIndex < thumbnailStartIndex) {
      setThumbnailStartIndex(Math.max(0, newIndex - maxVisibleThumbnails + 1));
    } else if (newIndex >= thumbnailStartIndex + maxVisibleThumbnails) {
      setThumbnailStartIndex(
        Math.min(allImages.length - maxVisibleThumbnails, newIndex)
      );
    }
  };

  const selectImage = (index: number) => {
    const actualIndex = thumbnailStartIndex + index;
    setSelectedImageIndex(actualIndex);
  };

  // Safe image URL function
  const getSafeImageUrl = (image: any) => {
    if (!image || !image.url) {
      return null;
    }
    try {
      return getStrapiImageUrl(image.url);
    } catch (error) {
      console.error('Error processing image URL:', error);
      return null;
    }
  };

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
            {/* Main Image Display with Overlay Navigation */}
            <div className="relative aspect-square bg-gray-700 rounded-lg overflow-hidden shadow-lg border border-gray-600 group">
              {currentImage && getSafeImageUrl(currentImage) ? (
                <>
                  <Image
                    src={getSafeImageUrl(currentImage)!}
                    alt={currentImage.alternativeText || equipment.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    priority
                    onError={(e) => {
                      console.error('Image failed to load:', currentImage);
                      // Hide the broken image and show placeholder
                      e.currentTarget.style.display = 'none';
                    }}
                  />

                  {/* Left Arrow - Only show if more than 1 image */}
                  {allImages.length > 1 && (
                    <button
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                      aria-label="Previous image"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Right Arrow - Only show if more than 1 image */}
                  {allImages.length > 1 && (
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                      aria-label="Next image"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  )}

                  {/* Image Counter Overlay - Only show if more than 1 image */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                      {selectedImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gradient-to-br from-gray-700 to-gray-800">
                  <div className="text-center">
                    <span className="text-6xl mb-4 block">📦</span>
                    <p className="text-lg font-medium">No Image Available</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Professional specifications available upon request
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails - Limited to 4 with Smart Navigation */}
            {allImages.length > 1 && (
              <div className="space-y-3">
                {/* Thumbnail Grid - Always shows 4 slots */}
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: maxVisibleThumbnails }).map(
                    (_, index) => {
                      const image = visibleThumbnails[index];
                      const actualImageIndex = thumbnailStartIndex + index;
                      const uniqueKey = `thumbnail-${
                        image?.id || 'empty'
                      }-${actualImageIndex}`;

                      // Empty slot if no image
                      if (!image) {
                        return (
                          <div
                            key={uniqueKey}
                            className="aspect-square bg-gray-800 rounded-lg border border-gray-600 opacity-50"
                          />
                        );
                      }

                      const safeImageUrl = getSafeImageUrl(image);

                      if (!safeImageUrl) {
                        return (
                          <div
                            key={uniqueKey}
                            className="aspect-square bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center text-gray-500 border border-gray-600"
                          >
                            <span className="text-xs">No Image</span>
                          </div>
                        );
                      }

                      return (
                        <button
                          key={uniqueKey}
                          onClick={() => selectImage(index)}
                          className={`aspect-square bg-gray-700 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 ${
                            selectedImageIndex === actualImageIndex
                              ? 'ring-3 ring-blue-500 ring-offset-2 ring-offset-gray-900 shadow-lg scale-105'
                              : 'hover:ring-2 hover:ring-gray-400 hover:ring-offset-2 hover:ring-offset-gray-900 hover:shadow-md'
                          }`}
                        >
                          <Image
                            src={safeImageUrl}
                            alt={
                              image.alternativeText ||
                              `${equipment.name} image ${actualImageIndex + 1}`
                            }
                            width={150}
                            height={150}
                            className="w-full h-full object-cover transition-transform duration-300"
                            onError={(e) => {
                              console.error('Thumbnail failed to load:', image);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </button>
                      );
                    }
                  )}
                </div>

                {/* Thumbnail Navigation - Only show if more than 4 images */}
                {allImages.length > maxVisibleThumbnails && (
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() =>
                        setThumbnailStartIndex(
                          Math.max(0, thumbnailStartIndex - 1)
                        )
                      }
                      disabled={thumbnailStartIndex === 0}
                      className="flex items-center space-x-1 px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <span>←</span>
                    </button>

                    <div className="text-xs text-gray-400">
                      {thumbnailStartIndex + 1}-
                      {Math.min(
                        thumbnailStartIndex + maxVisibleThumbnails,
                        allImages.length
                      )}{' '}
                      of {allImages.length}
                    </div>

                    <button
                      onClick={() =>
                        setThumbnailStartIndex(
                          Math.min(
                            allImages.length - maxVisibleThumbnails,
                            thumbnailStartIndex + 1
                          )
                        )
                      }
                      disabled={
                        thumbnailStartIndex + maxVisibleThumbnails >=
                        allImages.length
                      }
                      className="flex items-center space-x-1 px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Main Image Navigation */}
            {allImages.length > 1 && (
              <div className="flex items-center justify-between text-gray-400 text-sm">
                <button
                  onClick={goToPrevious}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <span>←</span>
                  <span>Previous</span>
                </button>

                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">
                    {selectedImageIndex + 1}
                  </span>
                  <span>of</span>
                  <span>{allImages.length}</span>
                </div>

                <button
                  onClick={goToNext}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  <span>Next</span>
                  <span>→</span>
                </button>
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
              <div className="text-gray-300 space-y-2">
                <p className="whitespace-pre-line">
                  {renderDescription(equipment.description)}
                </p>
              </div>
            </div>

            {/* Technical Specifications */}
            {equipment.technicalSpecs && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  Technical Specifications
                </h2>
                <div className="text-gray-300 space-y-2">
                  <p className="whitespace-pre-line">
                    {renderDescription(equipment.technicalSpecs)}
                  </p>
                </div>
              </div>
            )}
            {/* Manual Downloads */}
            {equipment.manuals && equipment.manuals.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white mb-3">
                  Documentation
                </h2>
                <div className="space-y-2">
                  {equipment.manuals.map((manual) => (
                    <a
                      key={manual.id}
                      href={getStrapiImageUrl(manual.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <span>📄</span>
                      <span>{manual.name}</span>
                      <span className="text-gray-400 text-sm">
                        ({(manual.size / 1024 / 1024).toFixed(1)} MB)
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}
            {/* Consultation CTA */}
            <div className="pt-6">
              <ConsultationCTA
                equipment={equipment}
                message={`I'm interested in learning more about the ${equipment.name} for my upcoming event. Could we schedule a consultation?`}
              />
            </div>
          </div>
        </div>

        {/* Related Equipment */}
        {relatedEquipment.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-white mb-8">
              Related Equipment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedEquipment.map((item) => {
                const mainImageUrl = item.mainImage
                  ? getSafeImageUrl(item.mainImage)
                  : null;

                return (
                  <Link
                    key={item.id}
                    href={`/equipment/${item.slug}`}
                    className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors"
                  >
                    <div className="aspect-video bg-gray-700">
                      {mainImageUrl ? (
                        <Image
                          src={mainImageUrl}
                          alt={item.mainImage?.alternativeText || item.name}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <span className="text-4xl">📦</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {item.name}
                      </h3>
                      {item.shortDescription && (
                        <p className="text-gray-400 text-sm">
                          {item.shortDescription}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
