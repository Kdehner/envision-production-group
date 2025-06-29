// frontend/src/app/equipment/[id]/page.tsx
import { strapiApi, EquipmentItem, getStrapiImageUrl } from '@/lib/strapi';
import { brandConfig, brandUtils } from '@/lib/config';
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
  const relatedEquipment = allEquipment
    .filter(
      (item) =>
        item.id !== equipment.id &&
        item.equipment_category?.id === equipment.equipment_category?.id
    )
    .slice(0, 3);

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
                  className="text-gray-300 hover:text-blue-400"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white">
              Home
            </Link>
            <span className="text-gray-500">/</span>
            <Link href="/equipment" className="text-gray-400 hover:text-white">
              Equipment
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-white">{equipment.name}</span>
          </div>
        </div>
      </nav>

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
                      ? 'bg-red-900 text-red-300'
                      : 'bg-yellow-900 text-yellow-300'
                  }`}
                >
                  {equipment.status}
                </span>
              </div>

              {/* Brand and Model */}
              {(equipment.brand || equipment.model) && (
                <p className="text-xl text-gray-300 mb-4">
                  {equipment.brand} {equipment.model}
                </p>
              )}

              {/* Category */}
              {equipment.equipment_category && (
                <div className="mb-4">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      backgroundColor:
                        brandUtils.getCategoryColor(
                          equipment.equipment_category.slug || ''
                        ) + '20',
                      color: brandUtils.getCategoryColor(
                        equipment.equipment_category.slug || ''
                      ),
                    }}
                  >
                    {equipment.equipment_category.name}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {equipment.description && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  Description
                </h3>
                <div
                  className="text-gray-300 prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: equipment.description }}
                />
              </div>
            )}

            {/* Key Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-white mb-2">SKU</h4>
                <p className="text-gray-300">{equipment.sku}</p>
              </div>

              {equipment.quantity && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-semibold text-white mb-2">
                    Availability
                  </h4>
                  <p className="text-gray-300">
                    {equipment.availableQuantity}/{equipment.quantity} Available
                  </p>
                </div>
              )}

              {equipment.location && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-semibold text-white mb-2">Location</h4>
                  <p className="text-gray-300">{equipment.location}</p>
                </div>
              )}

              {equipment.serialNumber && (
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h4 className="font-semibold text-white mb-2">
                    Serial Number
                  </h4>
                  <p className="text-gray-300">{equipment.serialNumber}</p>
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

            {/* Tags */}
            {equipment.tags && equipment.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {equipment.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href={`/quote?equipment=${equipment.id}`}
                className="block w-full text-center bg-yellow-500 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-lg"
              >
                Request Quote for This Item
              </Link>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/quote"
                  className="text-center border-2 border-blue-600 text-blue-400 py-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
                >
                  Custom Quote
                </Link>
                <Link
                  href="/equipment"
                  className="text-center border-2 border-gray-600 text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
                >
                  Back to Catalog
                </Link>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <h4 className="font-semibold text-white mb-2">Need Help?</h4>
              <p className="text-gray-300 text-sm mb-3">
                Contact us for pricing, availability, or technical questions.
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
            <h2 className="text-2xl font-bold text-white mb-8">
              Related Equipment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEquipment.map((item) => (
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
                      <p className="text-gray-300 text-sm">
                        {item.brand} {item.model}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-16">
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
