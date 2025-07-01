// frontend/src/app/services/page.tsx
import { brandConfig, brandUtils } from '@/lib/config';
import Link from 'next/link';

export default function ServicesPage() {
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
                    item.href === '/services'
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

      {/* Breadcrumb */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white">
              Home
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-white">Services</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Professional Lighting & Sound Services
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Specializing in professional lighting and audio solutions for events
            of all sizes. From equipment rental to full production services, we
            bring your vision to life with technical excellence.
          </p>
          <div className="space-x-4">
            <Link
              href="/quote"
              className="inline-block bg-yellow-500 text-gray-900 py-3 px-8 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Get Custom Quote
            </Link>
            <a
              href={`tel:${brandConfig.contact.phone.replace(/\D/g, '')}`}
              className="inline-block border-2 border-white text-white py-3 px-8 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
            >
              Call {brandUtils.formatPhone()}
            </a>
          </div>
        </div>
      </section>

      {/* Our Specialties */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Our Specialties
            </h2>
            <p className="text-xl text-gray-300">
              Professional lighting and sound solutions that make your event
              exceptional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Lighting Expertise */}
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Professional Lighting
                </h3>
              </div>
              <p className="text-gray-300 mb-6 text-center">
                From subtle ambiance to dynamic stage lighting, we create the
                perfect atmosphere for your event with professional-grade
                equipment and expert design.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-gray-300">
                    Architectural & uplighting
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-gray-300">
                    Stage & performance lighting
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-gray-300">
                    LED technology & color mixing
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-gray-300">
                    Lighting control & programming
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-gray-300">
                    Dance floor & ambient lighting
                  </span>
                </div>
              </div>
            </div>

            {/* Audio Expertise */}
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎵</div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Professional Audio
                </h3>
              </div>
              <p className="text-gray-300 mb-6 text-center">
                Crystal-clear sound reinforcement and professional audio
                engineering ensure your message is heard with perfect clarity at
                events of any size.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-gray-300">
                    Live sound mixing & engineering
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-gray-300">
                    Wireless microphone systems
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-gray-300">
                    PA system design & deployment
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-gray-300">
                    Background music & announcements
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-gray-300">
                    Recording & playback solutions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-xl text-gray-300">
              Three comprehensive service levels to meet your needs and budget
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Rental Services */}
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 hover:border-yellow-500 transition-colors">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  Rental Services
                </h3>
                <p className="text-gray-300">
                  Professional lighting and sound equipment available for pickup
                  or delivery. Perfect for experienced users who prefer to
                  handle setup themselves.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-lg font-semibold text-yellow-400">
                  What's Included:
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Professional-grade equipment</li>
                  <li>• Basic setup instructions</li>
                  <li>• Equipment delivery (optional)</li>
                  <li>• Technical support hotline</li>
                  <li>• Backup equipment options</li>
                </ul>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-lg font-semibold text-yellow-400">
                  Perfect For:
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• DIY event organizers</li>
                  <li>• Budget-conscious clients</li>
                  <li>• Simple setups</li>
                  <li>• Experienced users</li>
                </ul>
              </div>

              <Link
                href="/equipment"
                className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Equipment
              </Link>
            </div>

            {/* Production Services */}
            <div className="bg-gray-900 rounded-lg p-8 border-2 border-yellow-500 relative">
              {/* Most Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-6 mt-4">
                <div className="text-4xl mb-4">⚙️</div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  Production Services
                </h3>
                <p className="text-gray-300">
                  Complete turnkey service with professional setup, operation,
                  and technical support. We handle everything so you can focus
                  on your event.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-lg font-semibold text-yellow-400">
                  What's Included:
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Professional equipment selection</li>
                  <li>• Complete setup & testing</li>
                  <li>• Live operation by technicians</li>
                  <li>• Real-time troubleshooting</li>
                  <li>• Strike & equipment removal</li>
                </ul>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-lg font-semibold text-yellow-400">
                  Perfect For:
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Corporate events & conferences</li>
                  <li>• Weddings & celebrations</li>
                  <li>• Complex lighting designs</li>
                  <li>• Peace-of-mind service</li>
                </ul>
              </div>

              <Link
                href="/quote?service=production"
                className="block w-full text-center bg-yellow-500 text-gray-900 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
              >
                Get Production Quote
              </Link>
            </div>

            {/* Design & Consultation */}
            <div className="bg-gray-900 rounded-lg p-8 border border-gray-700 hover:border-yellow-500 transition-colors">
              <div className="text-center mb-6">
                <div className="text-4xl mb-4">🎨</div>
                <h3 className="text-2xl font-semibold text-white mb-3">
                  Design & Consultation
                </h3>
                <p className="text-gray-300">
                  Expert technical design and planning services to create the
                  perfect lighting and sound experience for your unique event
                  vision.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-lg font-semibold text-yellow-400">
                  What's Included:
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Technical site survey</li>
                  <li>• Custom lighting design</li>
                  <li>• Audio system planning</li>
                  <li>• Equipment specifications</li>
                  <li>• Setup diagrams & instructions</li>
                </ul>
              </div>

              <div className="space-y-4 mb-8">
                <h4 className="text-lg font-semibold text-yellow-400">
                  Perfect For:
                </h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Unique venue challenges</li>
                  <li>• Custom lighting concepts</li>
                  <li>• Large-scale events</li>
                  <li>• Technical planning phase</li>
                </ul>
              </div>

              <a
                href={`mailto:${brandConfig.contact.email}?subject=Design Consultation Request`}
                className="block w-full text-center border-2 border-blue-600 text-blue-400 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
              >
                Schedule Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* DJ Services CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800 border-2 border-purple-500 rounded-lg p-8 text-center">
            <div className="text-5xl mb-4">🎧</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Looking for DJ Services?
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              We also offer professional DJ services through our sister company.
              Get the complete package with both technical production and
              entertainment.
            </p>
            <a
              href="https://your-dj-website.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-purple-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Visit Our DJ Services Site
              <span className="ml-2">↗️</span>
            </a>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Our Process</h2>
            <p className="text-xl text-gray-300">
              How we work with you from initial contact to event completion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-yellow-500 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Consultation
              </h3>
              <p className="text-gray-300 text-sm">
                We discuss your event vision, venue details, and technical
                requirements to understand your needs.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Design & Planning
              </h3>
              <p className="text-gray-300 text-sm">
                Our team creates a custom lighting and audio plan tailored to
                your event and venue.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Setup & Testing
              </h3>
              <p className="text-gray-300 text-sm">
                Professional installation and comprehensive testing ensure
                everything works perfectly.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-500 text-gray-900 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Event Support
              </h3>
              <p className="text-gray-300 text-sm">
                Live technical support during your event and professional
                cleanup afterward.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Illuminate Your Event?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Let's discuss your lighting and sound needs and create a solution
            that brings your vision to life.
          </p>
          <div className="space-x-4">
            <Link
              href="/quote"
              className="inline-block bg-yellow-500 text-gray-900 py-3 px-8 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              Get Your Quote
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
