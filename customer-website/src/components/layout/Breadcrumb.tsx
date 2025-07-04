// frontend/src/components/layout/Breadcrumb.tsx
import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  href?: string; // If no href, it's the current page
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="bg-gray-800 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center space-x-2 text-sm">
          {/* Always start with Home */}
          <Link
            href="/"
            className="text-gray-400 hover:text-white transition-colors"
          >
            Home
          </Link>

          {/* Render each breadcrumb item */}
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span className="text-gray-500">/</span>
              {item.href ? (
                <Link
                  href={item.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="text-white font-medium">{item.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

// Helper function to create breadcrumbs easily
export function createBreadcrumbs(
  ...items: Array<string | BreadcrumbItem>
): BreadcrumbItem[] {
  return items.map((item, index, array) => {
    if (typeof item === 'string') {
      // If it's the last item, it's the current page (no href)
      if (index === array.length - 1) {
        return { name: item };
      }
      // Otherwise, create a href based on the item name
      return {
        name: item,
        href: `/${item.toLowerCase().replace(/\s+/g, '-')}`,
      };
    }
    return item;
  });
}

// Pre-defined breadcrumbs for common pages
export const BREADCRUMBS = {
  equipment: createBreadcrumbs('Equipment'),
  services: createBreadcrumbs('Services'),
  about: createBreadcrumbs('About'),
  contact: createBreadcrumbs('Contact'),
  quote: createBreadcrumbs('Request Quote'),
  equipmentDetail: (itemName: string) =>
    createBreadcrumbs({ name: 'Equipment', href: '/equipment' }, itemName),
};
