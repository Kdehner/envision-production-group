// app/page.tsx
import {
  strapiApi,
  EquipmentItem,
  EquipmentCategory,
  getStrapiImageUrl,
} from '@/lib/strapi';
import { brandConfig, brandUtils } from '@/lib/config';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const [featuredEquipment, categories] = await Promise.all([
    strapiApi.getFeaturedEquipment(),
    strapiApi.getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-white">
                {brandConfig.company.name}
              </h1>
            </div>
            <nav className="flex space-x-8">
              {brandConfig.navigation.main.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={
                    item.href === '/'
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

      {/* Hero Section */}
      <section
        className={`text-white relative ${brandUtils.getHeroBackgroundClasses()}`}
      >
        {/* Overlay for text readability */}
        <div
          className={`absolute inset-0 ${brandUtils.getOverlayClasses()}`}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">
              Professional Event Equipment Rentals
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {brandConfig.company.description}
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/equipment"
                className="inline-block bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Browse Equipment
              </Link>
              <Link
                href="/quote"
                className="inline-block border-2 border-yellow-400 bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
              >
                Get Expert Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Equipment Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white text-center mb-12">
            Equipment Categories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 text-center border border-gray-700"
              >
                <div
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl"
                  style={{
                    backgroundColor: brandUtils.getCategoryColor(category.slug),
                  }}
                >
                  {category.name.charAt(0)}
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">
                  {category.name}
                </h4>
                <p className="text-gray-300 mb-4">
                  {category.description ||
                    `Professional ${category.name.toLowerCase()} equipment`}
                </p>
                <Link
                  href={`/equipment?category=${category.slug}`}
                  className="text-blue-400 hover:text-blue-300 font-medium"
                >
                  View Equipment →
                </Link>
              </div>
            ))}
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
                  <p className="text-gray-300 text-sm mb-3">
                    {item.brand} {item.model}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-400">
                      {item.specifications?.power && (
                        <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded mr-2">
                          {item.specifications.power}
                        </span>
                      )}
                      {item.quantity > 1 && (
                        <span className="text-green-400 font-medium">
                          {item.availableQuantity} Available
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
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
