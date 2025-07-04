// frontend/src/components/shared/CTAs.tsx
import { brandConfig, brandUtils } from '@/lib/config';
import Link from 'next/link';

// Generic CTA Section
interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryButton: {
    text: string;
    href: string;
    external?: boolean;
  };
  secondaryButton?: {
    text: string;
    href: string;
    external?: boolean;
  };
  variant?: 'default' | 'centered' | 'gray-bg';
}

export function CTASection({
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  variant = 'default',
}: CTASectionProps) {
  const bgClass = variant === 'gray-bg' ? 'bg-gray-800' : '';
  const containerClass = variant === 'centered' ? 'text-center' : '';

  return (
    <section className={`py-16 ${bgClass}`}>
      <div
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClass}`}
      >
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-xl text-gray-300 mb-8">{subtitle}</p>
        <div className="space-x-4">
          {primaryButton.external ? (
            <a
              href={primaryButton.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-500 text-gray-900 py-3 px-8 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              {primaryButton.text}
            </a>
          ) : (
            <Link
              href={primaryButton.href}
              className="inline-block bg-yellow-500 text-gray-900 py-3 px-8 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            >
              {primaryButton.text}
            </Link>
          )}

          {secondaryButton &&
            (secondaryButton.external ? (
              <a
                href={secondaryButton.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-blue-600 text-blue-400 py-3 px-8 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
              >
                {secondaryButton.text}
              </a>
            ) : (
              <Link
                href={secondaryButton.href}
                className="inline-block border-2 border-blue-600 text-blue-400 py-3 px-8 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors"
              >
                {secondaryButton.text}
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}

// Equipment-specific CTA
export function EquipmentCTA() {
  return (
    <CTASection
      title="Ready to Plan Your Event?"
      subtitle="Our equipment specialists are ready to help you create the perfect setup for your event."
      primaryButton={{
        text: 'Start Your Quote',
        href: '/quote',
      }}
      secondaryButton={{
        text: `Call ${brandUtils.formatPhone()}`,
        href: `tel:${brandConfig.contact.phone.replace(/\D/g, '')}`,
      }}
      variant="gray-bg"
    />
  );
}

// Services-specific CTA
export function ServicesCTA() {
  return (
    <CTASection
      title="Ready to Illuminate Your Event?"
      subtitle="Let's discuss your lighting and sound needs and create a solution that brings your vision to life."
      primaryButton={{
        text: 'Get Your Quote',
        href: '/quote',
      }}
      secondaryButton={{
        text: `Call ${brandUtils.formatPhone()}`,
        href: `tel:${brandConfig.contact.phone.replace(/\D/g, '')}`,
      }}
      variant="centered"
    />
  );
}

// Contact-specific CTA
export function ContactCTA() {
  return (
    <CTASection
      title="Ready to Start Planning?"
      subtitle="Whether you need a simple equipment rental or complete event production, we're here to make your event exceptional."
      primaryButton={{
        text: 'Get Started',
        href: '/quote',
      }}
      secondaryButton={{
        text: 'Email Us',
        href: `mailto:${brandConfig.contact.email}`,
      }}
      variant="centered"
    />
  );
}

// About-specific CTA
export function AboutCTA() {
  return (
    <CTASection
      title="Ready to Work Together?"
      subtitle="Let's discuss how we can bring technical excellence and creative vision to your next event."
      primaryButton={{
        text: 'Start Your Project',
        href: '/quote',
      }}
      secondaryButton={{
        text: 'Get In Touch',
        href: '/contact',
      }}
      variant="gray-bg"
    />
  );
}

// Help/Consultation CTA (for equipment pages)
interface HelpCTAProps {
  title?: string;
  subtitle?: string;
}

export function HelpCTA({
  title = 'Need help choosing equipment?',
  subtitle = 'Our equipment specialists will help you find the perfect solution for your event.',
}: HelpCTAProps) {
  return (
    <div className="flex justify-center mb-8">
      <div className="bg-gray-800 border-2 border-yellow-500 rounded-lg p-6 max-w-4xl w-full">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex items-center space-x-3 flex-1">
            <span className="text-yellow-400 text-2xl">💡</span>
            <div className="text-center md:text-left">
              <h3 className="text-yellow-400 font-semibold mb-2">{title}</h3>
              <p className="text-gray-300 text-sm">{subtitle}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Link
              href="/quote"
              className="inline-block bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-center"
            >
              Get Expert Quote
            </Link>
            <a
              href={`tel:${brandConfig.contact.phone.replace(/\D/g, '')}`}
              className="inline-block border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors text-center"
            >
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quote consultation CTA (for equipment detail pages)
interface ConsultationCTAProps {
  itemId: number;
  title?: string;
  subtitle?: string;
}

export function ConsultationCTA({
  itemId,
  title = 'Interested in this equipment?',
  subtitle = 'Our specialists will help you determine the right quantity and configuration for your event, plus recommend complementary equipment.',
}: ConsultationCTAProps) {
  return (
    <div className="bg-gray-800 border-2 border-yellow-500 rounded-lg p-6">
      <h3 className="text-yellow-400 font-semibold mb-3">{title}</h3>
      <p className="text-gray-300 mb-4">{subtitle}</p>
      <div className="space-y-3">
        <Link
          href={`/quote?equipment=${itemId}`}
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
    </div>
  );
}

// DJ Services CTA (for services page)
export function DJServicesCTA({ djWebsiteUrl }: { djWebsiteUrl: string }) {
  return (
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
            href={djWebsiteUrl}
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
  );
}
