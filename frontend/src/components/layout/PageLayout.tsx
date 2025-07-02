// frontend/src/components/layout/PageLayout.tsx
import Link from 'next/link';
import Header from './Header';
import Breadcrumb, { BreadcrumbItem } from './Breadcrumb';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  activeSection?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBreadcrumbs?: boolean;
  footerVariant?: 'default' | 'simple';
}

export default function PageLayout({
  children,
  activeSection,
  breadcrumbs,
  showBreadcrumbs = true,
  footerVariant = 'default',
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900">
      <Header activeSection={activeSection} />

      {showBreadcrumbs && breadcrumbs && <Breadcrumb items={breadcrumbs} />}

      <main>{children}</main>

      <Footer variant={footerVariant} />
    </div>
  );
}

// Hero Section Component (used on most pages)
interface HeroSectionProps {
  title: string;
  subtitle: string;
  primaryButton?: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
    external?: boolean;
  };
  backgroundImage?: string;
}

export function HeroSection({
  title,
  subtitle,
  primaryButton,
  secondaryButton,
  backgroundImage,
}: HeroSectionProps) {
  return (
    <section
      className={`bg-gray-800 py-16 ${
        backgroundImage ? 'bg-cover bg-center' : ''
      }`}
      style={
        backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}
      }
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">{title}</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          {subtitle}
        </p>

        {(primaryButton || secondaryButton) && (
          <div className="space-x-4">
            {primaryButton && (
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
                  className="inline-block border-2 border-white text-white py-3 px-8 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
                >
                  {secondaryButton.text}
                </a>
              ) : (
                <Link
                  href={secondaryButton.href}
                  className="inline-block border-2 border-white text-white py-3 px-8 rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors"
                >
                  {secondaryButton.text}
                </Link>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
