// frontend/src/app/page.tsx
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
                      <span className="text-6xl">📦</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-white mb-2">
                    {item.name}
                  </h4>
                  {(item.brand || item.model) && (
                    <p className="text-gray-300 text-sm mb-3">
                      {item.brand} {item.model}
                    </p>
                  )}
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-400">
                      {item.specifications?.power && (
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded mr-2">
                          {item.specifications.power}
                        </span>
                      )}
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
                          : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
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
        </div>
      </section>
    </PageLayout>
  );
}
