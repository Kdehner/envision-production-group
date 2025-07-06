// frontend/src/app/page.tsx
import {
  strapiApi,
  EquipmentModel, // Updated import
  EquipmentCategory,
  getStrapiImageUrl,
  extractTextFromBlocks, // Add this import
} from '@/lib/strapi';
import { brandConfig, brandUtils } from '@/lib/config';
import { PageLayout, HeroSection } from '@/components';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const [featuredEquipment, categories] = await Promise.all([
    strapiApi.getFeaturedEquipment(),
    strapiApi.getCategories(),
  ]);

  return (
    <PageLayout activeSection="home" showBreadcrumbs={false}>
      {/* Hero Section */}
      <HeroSection
        title="Professional Event Equipment Rentals"
        subtitle={brandConfig.company.description}
        primaryButton={{
          text: 'Browse Equipment',
          href: '/equipment',
        }}
        secondaryButton={{
          text: 'Request Quote',
          href: '/quote',
        }}
        backgroundImage="/images/hero-bg.jpg"
      />

      {/* Equipment Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Equipment Categories
          </h3>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
              {categories
                .filter((category) => category.name.toLowerCase() !== 'video')
                .map((category) => (
                  <div
                    key={category.id}
                    className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 text-center border border-gray-700"
                  >
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl"
                      style={{
                        backgroundColor: brandUtils.getCategoryColor(
                          category.slug || category.name.toLowerCase()
                        ),
                      }}
                    >
                      {category.name.charAt(0)}
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {category.name}
                    </h4>
                    <p className="text-gray-300 mb-4">
                      {category.description
                        ? category.description.replace(/<[^>]*>/g, '')
                        : `Professional ${category.name.toLowerCase()} equipment`}
                    </p>
                    <Link
                      href={`/equipment?category=${
                        category.slug || category.id
                      }`}
                      className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                      View Equipment →
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Equipment */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Featured Equipment
          </h3>

          {/* Check if we have featured equipment */}
          {featuredEquipment.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⭐</div>
              <h4 className="text-xl font-semibold text-white mb-2">
                No Featured Equipment Yet
              </h4>
              <p className="text-gray-300 mb-6">
                We're updating our featured equipment selection. Check back
                soon!
              </p>
              <Link
                href="/equipment"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Browse All Equipment
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEquipment.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-900 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-700"
                >
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
                  <div className="p-6">
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {item.name}
                    </h4>

                    {/* Handle brand as object */}
                    {item.brand && (
                      <p className="text-gray-300 text-sm mb-3">
                        {typeof item.brand === 'string'
                          ? item.brand
                          : item.brand.brandName}
                      </p>
                    )}

                    {/* Handle blocks description properly */}
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {item.shortDescription ||
                        (Array.isArray(item.description)
                          ? extractTextFromBlocks(item.description)
                          : typeof item.description === 'string'
                          ? item.description
                          : 'Professional equipment for your event needs.')}
                    </p>

                    {/* Handle category as object */}
                    <div className="flex items-center justify-between">
                      {item.category && (
                        <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded">
                          {typeof item.category === 'string'
                            ? item.category
                            : item.category.name}
                        </span>
                      )}
                      <Link
                        href={`/equipment/${item.slug}`} // Use slug instead of ID
                        className="text-blue-400 hover:text-blue-300 font-medium text-sm"
                      >
                        Learn More →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact & Quote Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Plan Your Event?
          </h3>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Our equipment specialists work with you to create the perfect setup
            for your event. From intimate gatherings to large productions, we
            provide professional consultation and support.
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Link
              href="/quote"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Request a Quote
            </Link>
            <Link
              href="/equipment"
              className="inline-block bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
            >
              Browse Equipment
            </Link>
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
