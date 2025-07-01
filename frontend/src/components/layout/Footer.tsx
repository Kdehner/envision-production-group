// frontend/src/components/layout/Footer.tsx
import { brandConfig, brandUtils } from '@/lib/config';
import Link from 'next/link';

interface FooterProps {
  variant?: 'default' | 'simple'; // Different footer layouts if needed
}

export default function Footer({ variant = 'default' }: FooterProps) {
  if (variant === 'simple') {
    return (
      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-300">
            © 2024 {brandConfig.company.name}. All rights reserved.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h4 className="text-2xl font-bold mb-4">
              {brandConfig.company.name}
            </h4>
            <p className="text-gray-300 mb-4">{brandConfig.company.tagline}</p>
            <p className="text-gray-400 text-sm mb-4">
              {brandConfig.company.description}
            </p>
            <div className="space-y-2">
              <p className="text-gray-300">📧 {brandConfig.contact.email}</p>
              <p className="text-gray-300">📞 {brandUtils.formatPhone()}</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2">
              {brandConfig.navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h5 className="text-lg font-semibold mb-4">Services</h5>
            <ul className="space-y-2 text-gray-300">
              <li>Equipment Rental</li>
              <li>Production Services</li>
              <li>Design & Consultation</li>
              <li>Lighting & Sound</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 {brandConfig.company.name}. All rights reserved.
            </p>

            {/* Optional: Social Links or Additional Links */}
            <div className="mt-4 md:mt-0 flex space-x-6">
              <Link
                href="/quote"
                className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
              >
                Get Quote
              </Link>
              <a
                href={`tel:${brandConfig.contact.phone.replace(/\D/g, '')}`}
                className="text-gray-400 hover:text-yellow-400 text-sm transition-colors"
              >
                {brandUtils.formatPhone()}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
