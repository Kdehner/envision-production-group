// frontend/src/app/equipment/[id]/page.tsx
import { strapiApi, getStrapiImageUrl } from '@/lib/strapi';
import { brandConfig, brandUtils } from '@/lib/config';
import { PageLayout, BREADCRUMBS } from '@/components';
import { ConsultationCTA } from '@/components/shared/CTAs';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface EquipmentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EquipmentDetailPage({
  params,
}: EquipmentDetailPageProps) {
  const { id } = await params;
  const equipmentId = parseInt(id);

  if (isNaN(equipmentId)) {
    notFound();
  }

  // Fetch the specific equipment item
  const equipment = await strapiApi.getEquipmentItem(equipmentId);

  if (!equipment) {
    notFound();
  }

  // Fetch related equipment (same category, excluding current item)
  const allEquipment = await strapiApi.getEquipment();
  const equipmentCategory = equipment.equipment_category || equipment.category;
  const relatedEquipment = allEquipment
    .filter((item) => {
      const itemCategory = item.equipment_category || item.category;
      return (
        item.id !== equipment.id && itemCategory?.id === equipmentCategory?.id
      );
    })
    .slice(0, 3);

  return (
    <PageLayout
      activeSection="equipment"
      breadcrumbs={BREADCRUMBS.equipmentDetail(equipment.name)}
    >
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
              {equipment.mainImage ? (
                <Image
                  src={getStrapiImageUrl(equipment.mainImage.url)}
                  alt={equipment.mainImage.alternativeText || equipment.name}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <span className="text-8xl mb-4 block">📦</span>
                    <p>No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {equipment.gallery && equipment.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {/* Main image as first thumbnail */}
                {equipment.mainImage && (
                  <div className="aspect-square bg-gray-700 rounded overflow-hidden border-2 border-blue-500">
                    <Image
                      src={getStrapiImageUrl(equipment.mainImage.url)}
                      alt={
                        equipment.mainImage.alternativeText || equipment.name
                      }
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Additional gallery images */}
                {equipment.gallery.slice(0, 3).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-gray-700 rounded overflow-hidden border border-gray-600 hover:border-blue-400 cursor-pointer"
                  >
                    <Image
                      src={getStrapiImageUrl(image.url)}
                      alt={
                        image.alternativeText ||
                        `${equipment.name} ${index + 2}`
                      }
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Equipment Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-white">
                  {equipment.name}
                </h1>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    equipment.status === 'Available'
                      ? 'bg-green-900 text-green-300'
                      : equipment.status === 'Rented'
                      ? 'bg-yellow-900 text-yellow-300'
                      : 'bg-red-900 text-red-300'
                  }`}
                >
                  {equipment.status}
                </span>
              </div>

              {/* Category and Brand */}
              <div className="flex items-center gap-4 mb-4">
                {equipmentCategory && (
                  <span
                    className="inline-block px-3 py-1 rounded text-sm font-medium text-white"
                    style={{
                      backgroundColor: brandUtils.getCategoryColor(
                        equipmentCategory.slug ||
                          equipmentCategory.name?.toLowerCase() ||
                          ''
                      ),
                    }}
                  >
                    {equipmentCategory.name}
                  </span>
                )}
                {(equipment.brand || equipment.model) && (
                  <span className="text-gray-300">
                    {equipment.brand} {equipment.model}
                  </span>
                )}
              </div>

              {/* Description */}
              {equipment.description && (
                <div className="prose prose-gray max-w-none">
                  <div
                    className="text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: equipment.description.replace(/<[^>]*>/g, ''),
                    }}
                  />
                </div>
              )}
            </div>

            {/* Specifications */}
            {equipment.specifications &&
              Object.keys(equipment.specifications).length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Specifications
                  </h3>
                  <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(equipment.specifications).map(
                        ([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="text-white font-medium">
                              {value as string}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* Notes */}
            {equipment.notes && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Additional Information
                </h3>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div
                    className="text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: equipment.notes.replace(/<[^>]*>/g, ''),
                    }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href={`/quote?equipment=${equipment.id}`}
                className="block w-full text-center bg-yellow-500 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Get Quote for This Item
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/quote"
                  className="text-center border-2 border-white text-white py-2 px-4 rounded-lg hover:bg-white hover:text-gray-900 transition-colors"
                >
                  Discuss My Needs
                </Link>
                <a
                  href={`tel:${brandConfig.contact.phone.replace(/\D/g, '')}`}
                  className="text-center border-2 border-yellow-400 text-yellow-400 py-2 px-4 rounded-lg hover:bg-yellow-400 hover:text-gray-900 transition-colors"
                >
                  Call Now
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h4 className="font-semibold text-white mb-2">
                Questions About This Equipment?
              </h4>
              <p className="text-gray-300 text-sm mb-3">
                Our equipment specialists can provide technical details,
                availability, and package recommendations.
              </p>
              <div className="space-y-1 text-sm">
                <p className="text-gray-300">📧 {brandConfig.contact.email}</p>
                <p className="text-gray-300">📞 {brandUtils.formatPhone()}</p>
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
              {relatedEquipment.map((item) => {
                const itemCategory = item.equipment_category || item.category;
                return (
                  <Link
                    key={item.id}
                    href={`/equipment/${item.id}`}
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
                      {(item.brand || item.model) && (
                        <p className="text-gray-300 text-sm mb-2">
                          {item.brand} {item.model}
                        </p>
                      )}
                      <div className="flex justify-between items-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === 'Available'
                              ? 'bg-green-900 text-green-300'
                              : 'bg-red-900 text-red-300'
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-blue-400 text-sm group-hover:text-blue-300">
                          View Details →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Final CTA Section */}
        <section className="mt-16">
          <ConsultationCTA
            itemId={equipment.id}
            title="Ready to Plan Your Event?"
            subtitle="Whether you need just this item or a complete equipment package, our specialists will help you create the perfect setup for your event."
          />
        </section>
      </div>
    </PageLayout>
  );
}
