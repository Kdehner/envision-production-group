// frontend/src/app/services/page.tsx
import { brandConfig, brandUtils } from '@/lib/config';
import { PageLayout, BREADCRUMBS, HeroSection } from '@/components';
import { ServicesCTA } from '@/components/shared/CTAs';
import Link from 'next/link';

export default function ServicesPage() {
  return (
    <PageLayout activeSection="services" breadcrumbs={BREADCRUMBS.services}>
      {/* Hero Section */}
      <HeroSection
        title="Professional Lighting & Sound Services"
        subtitle="Specializing in professional lighting and audio solutions for events of all sizes. From equipment rental to full production services, we bring your vision to life with technical excellence."
        primaryButton={{
          text: 'Get Your Quote',
          href: '/quote',
        }}
        secondaryButton={{
          text: `Call ${brandUtils.formatPhone()}`,
          href: `tel:${brandConfig.contact.phone.replace(/\D/g, '')}`,
        }}
      />

      {/* Service Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Our Expertise
            </h2>
            <p className="text-xl text-gray-300">
              Comprehensive lighting and audio solutions for every type of event
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Lighting Expertise */}
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Professional Lighting
                </h3>
              </div>
              <p className="text-gray-300 mb-6 text-center">
                From subtle ambient lighting to dramatic stage effects, we
                create the perfect atmosphere for your event with cutting-edge
                LED technology and expert design.
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
                  <span className="text-gray-300">PA systems & speakers</span>
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
                    Mixing consoles & control
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-gray-300">Live sound engineering</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-yellow-400">✓</span>
                  <span className="text-gray-300">
                    Background music systems
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How We Work</h2>
            <p className="text-xl text-gray-300">
              Our streamlined process ensures your event goes off without a
              hitch
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
                We discuss your vision, venue, and technical requirements to
                create the perfect solution.
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
                Our experts design the lighting and sound setup, providing
                detailed plans and equipment lists.
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

      {/* Event Types */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Events We Serve
            </h2>
            <p className="text-xl text-gray-300">
              Professional lighting and sound for every occasion
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
                <div className="text-4xl mb-4">🎭</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Corporate Events
                </h3>
                <p className="text-gray-300 text-sm">
                  Conferences, meetings, product launches, and corporate parties
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
                <div className="text-4xl mb-4">💒</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Weddings
                </h3>
                <p className="text-gray-300 text-sm">
                  Ceremonies, receptions, and celebration lighting & sound
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
                <div className="text-4xl mb-4">🎤</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Concerts & Performances
                </h3>
                <p className="text-gray-300 text-sm">
                  Live music, theater, and performance arts productions
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Private Parties
                </h3>
                <p className="text-gray-300 text-sm">
                  Birthdays, anniversaries, and special celebrations
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
                <div className="text-4xl mb-4">🏛️</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Galas & Fundraisers
                </h3>
                <p className="text-gray-300 text-sm">
                  Charity events, awards ceremonies, and formal gatherings
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-yellow-500 transition-colors">
                <div className="text-4xl mb-4">🎪</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Festivals & Outdoor Events
                </h3>
                <p className="text-gray-300 text-sm">
                  Large-scale outdoor productions and festival stages
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <ServicesCTA />
    </PageLayout>
  );
}
