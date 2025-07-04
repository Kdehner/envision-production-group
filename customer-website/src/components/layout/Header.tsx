// frontend/src/components/layout/Header.tsx
'use client';

import { brandConfig } from '@/lib/config';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  activeSection?: string; // Override automatic active detection if needed
}

export default function Header({ activeSection }: HeaderProps) {
  const pathname = usePathname();

  // Determine which nav item should be active
  const getActiveSection = () => {
    if (activeSection) return activeSection;

    // Auto-detect based on current path
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/equipment')) return 'equipment';
    if (pathname.startsWith('/services')) return 'services';
    if (pathname.startsWith('/about')) return 'about';
    if (pathname.startsWith('/contact')) return 'contact';
    if (pathname.startsWith('/quote')) return 'quote';

    return '';
  };

  // Fix: Rename the const variable to avoid conflict with the parameter
  const currentActiveSection = getActiveSection();

  return (
    <header className="bg-gray-800 shadow-sm border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Company Name */}
          <div className="flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-white hover:text-blue-400 transition-colors"
            >
              {brandConfig.company.name}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {brandConfig.navigation.main.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={
                  item.href === `/${currentActiveSection}` ||
                  (item.href === '/' && currentActiveSection === 'home')
                    ? 'text-yellow-400 font-semibold'
                    : 'text-gray-300 hover:text-white transition-colors'
                }
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button (for future mobile nav implementation) */}
          <div className="md:hidden">
            <button className="text-gray-300 hover:text-white">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
