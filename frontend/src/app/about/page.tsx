// frontend/src/app/about/page.tsx
import { brandConfig, brandUtils } from '@/lib/config';
import { PageLayout, BREADCRUMBS, HeroSection } from '@/components';
import { AboutCTA } from '@/components/shared/CTAs';
import Link from 'next/link';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <PageLayout activeSection="about" breadcrumbs={BREADCRUMBS.about}>
      {/* Hero Section */}
      <HeroSection
        title="About Envision Production Group"
        subtitle="Over a decade of experience providing professional lighting and audio solutions for events across Colorado. From intimate gatherings to large-scale productions, we bring technical excellence and creative vision to every project."
        primaryButton={{
          text: 'Get Your Quote',
          href: '/quote',
        }}
        secondaryButton={{
          text: 'View Our Equipment',
          href: '/equipment',
        }}
      />

      {/* Company Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Founded in Denver, Colorado, Envision Production Group was
                  born from a simple belief: every event deserves
                  professional-grade production value, regardless of size or
                  budget. What started as a small equipment rental business has
                  grown into the Denver area's trusted partner for lighting and
                  audio solutions.
                </p>
                <p>
                  We've had the privilege of working on everything from intimate
                  wedding receptions to major corporate events and music
                  festivals. Our experience has taught us that great events
                  aren't just about having the right equipment—they're about
                  understanding your vision and bringing it to life with
                  technical precision and creative flair.
                </p>
                <p>
                  Today, we focus exclusively on what we do best: professional
                  lighting and audio equipment rentals. By concentrating our
                  expertise in these areas, we can offer deeper knowledge,
                  better service, and more innovative solutions than generalist
                  rental companies.
                </p>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                Why Choose EPG?
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="text-yellow-400 text-xl">✨</div>
                  <div>
                    <h4 className="font-semibold text-white">
                      Specialized Expertise
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Deep knowledge of lighting and audio technology, not
                      spread thin across multiple disciplines.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-yellow-400 text-xl">🛠️</div>
                  <div>
                    <h4 className="font-semibold text-white">
                      Professional Equipment
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Industry-standard gear from trusted brands, maintained to
                      the highest standards.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-yellow-400 text-xl">👥</div>
                  <div>
                    <h4 className="font-semibold text-white">
                      Personal Service
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Direct access to experienced technicians who understand
                      your event needs.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-yellow-400 text-xl">💰</div>
                  <div>
                    <h4 className="font-semibold text-white">
                      Transparent Pricing
                    </h4>
                    <p className="text-gray-300 text-sm">
                      Custom quotes with no hidden fees, plus discounts for
                      schools and repeat clients.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-300">
              Experienced professionals who are passionate about bringing your
              events to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-700 rounded-lg p-6 text-center border border-gray-600">
              <div className="w-24 h-24 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-900 text-2xl font-bold">
                JS
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                John Smith
              </h3>
              <p className="text-yellow-400 font-medium mb-3">
                Founder & Chief Technical Officer
              </p>
              <p className="text-gray-300 text-sm">
                With over 15 years in live production, John founded EPG to bring
                professional-grade equipment and expertise to events of all
                sizes. Certified in multiple lighting control systems.
              </p>
            </div>

            {/* Team Member 2 */}
            <div className="bg-gray-700 rounded-lg p-6 text-center border border-gray-600">
              <div className="w-24 h-24 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-900 text-2xl font-bold">
                MD
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Maria Davis
              </h3>
              <p className="text-yellow-400 font-medium mb-3">
                Audio Specialist & Operations Manager
              </p>
              <p className="text-gray-300 text-sm">
                Maria brings 12 years of audio engineering experience from
                venues across Colorado. She ensures every sound system delivers
                crystal-clear audio tailored to your space.
              </p>
            </div>

            {/* Team Member 3 */}
            <div className="bg-gray-700 rounded-lg p-6 text-center border border-gray-600">
              <div className="w-24 h-24 bg-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center text-gray-900 text-2xl font-bold">
                RJ
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Robert Johnson
              </h3>
              <p className="text-yellow-400 font-medium mb-3">
                Lighting Designer & Equipment Coordinator
              </p>
              <p className="text-gray-300 text-sm">
                Robert's creative vision and technical expertise in LED
                technology and lighting design help transform ordinary spaces
                into extraordinary experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Partnerships */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Certifications & Partnerships
            </h2>
            <p className="text-xl text-gray-300">
              Trusted by industry professionals and certified in the latest
              technologies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Certifications */}
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                Professional Certifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="text-yellow-400 text-xl">🏆</div>
                  <span className="text-gray-300">
                    MA Lighting GrandMA2 Certified
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-yellow-400 text-xl">🏆</div>
                  <span className="text-gray-300">
                    ETC Eos Console Training Certified
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-yellow-400 text-xl">🏆</div>
                  <span className="text-gray-300">
                    OSHA 10-Hour Safety Certified
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-yellow-400 text-xl">🏆</div>
                  <span className="text-gray-300">
                    Colorado State Business License
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-yellow-400 text-xl">🏆</div>
                  <span className="text-gray-300">
                    Comprehensive Liability Insurance
                  </span>
                </div>
              </div>
            </div>

            {/* Partnerships */}
            <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
              <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                Trusted Brand Partners
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-400 text-xl">🤝</div>
                  <span className="text-gray-300">
                    Chauvet Professional Authorized Dealer
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-blue-400 text-xl">🤝</div>
                  <span className="text-gray-300">QSC Audio Partner</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-blue-400 text-xl">🤝</div>
                  <span className="text-gray-300">
                    Martin by Harman Lighting
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-blue-400 text-xl">🤝</div>
                  <span className="text-gray-300">
                    Shure Microphone Systems
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-blue-400 text-xl">🤝</div>
                  <span className="text-gray-300">ADJ Lighting Equipment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Mission */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Our Mission & Values
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              We believe every event deserves professional production value. Our
              mission is to make high-quality lighting and audio equipment
              accessible to events of all sizes while providing expert guidance
              every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quality */}
            <div className="text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Quality First
              </h3>
              <p className="text-gray-300">
                We maintain our equipment to the highest standards and only
                stock professional-grade gear from trusted manufacturers. Your
                event deserves reliable performance.
              </p>
            </div>

            {/* Service */}
            <div className="text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Expert Guidance
              </h3>
              <p className="text-gray-300">
                Our team doesn't just rent equipment—we partner with you to
                understand your vision and recommend the perfect setup for your
                specific needs and budget.
              </p>
            </div>

            {/* Community */}
            <div className="text-center">
              <div className="text-6xl mb-4">🌟</div>
              <h3 className="text-xl font-semibold text-white mb-4">
                Community Focus
              </h3>
              <p className="text-gray-300">
                As a Colorado-based business, we're proud to support local
                events, offer educational discounts, and help bring our
                community's celebrations to life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <AboutCTA />
    </PageLayout>
  );
}
