// frontend/src/lib/config.ts
export const brandConfig = {
  // Company Information
  company: {
    name: 'Envision Production Group',
    shortName: 'EPG',
    tagline:
      'Professional event equipment rentals for all your production needs',
    description:
      'From lighting and audio to staging and effects, we provide top-quality equipment for concerts, corporate events, weddings, and productions. Get custom quotes tailored to your event needs.',
  },

  // Contact Information
  contact: {
    email: 'info@epg.kevbot.app',
    phone: '(555) 123-4567',
    website: 'epg.kevbot.app',
    address: {
      street: '123 Production Way',
      city: 'Denver',
      state: 'CO',
      zip: '80202',
    },
  },

  // Branding Assets
  branding: {
    logo: {
      main: '/images/logo.png', // Main logo
      light: '/images/logo-light.png', // Light version for dark backgrounds
      dark: '/images/logo-dark.png', // Dark version for light backgrounds
      icon: '/images/logo-icon.png', // Just the icon/favicon
      favicon: '/favicon.ico',
    },

    // Background Images
    backgrounds: {
      hero: {
        desktop: '/images/hero-bg.jpg', // Main hero background
        mobile: '/images/hero-bg-mobile.jpg', // Mobile optimized version
        overlay: 'bg-black/50', // Dark overlay for text readability
        position: 'center', // center, top, bottom
        size: 'cover', // cover, contain, auto
      },
      sections: {
        equipment: '/images/equipment-bg.jpg', // Equipment showcase background
        about: '/images/about-bg.jpg', // About section background
        contact: '/images/contact-bg.jpg', // Contact section background
      },
      patterns: {
        subtle: '/images/pattern-subtle.png', // Subtle texture overlay
        noise: '/images/noise.png', // Film grain effect
      },
    },
    colors: {
      // Primary Brand Colors (based on your logo)
      primary: {
        50: '#fffbeb', // Very light gold
        100: '#fef3c7', // Light gold
        200: '#fde68a', //
        300: '#fcd34d', //
        400: '#fbbf24', // Logo gold
        500: '#f59e0b', // Main brand gold
        600: '#d97706', // Darker gold
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
      },
      // Secondary Brand Colors
      secondary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6', // Main brand blue
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
      },
    },
  },

  // Theme Settings
  theme: {
    mode: 'dark', // "light" | "dark" | "system"

    // Background Options
    backgrounds: {
      useImages: true, // Toggle between images and gradients
      fallbackToGradient: true, // Use gradient if image fails to load
    },

    gradients: {
      hero: 'from-gray-800 via-gray-700 to-yellow-600', // Gray to gold like your logo
      card: 'from-gray-900 to-gray-800',
      accent: 'from-yellow-400 to-yellow-600', // Gold accent gradient
    },
    borderRadius: {
      small: '4px',
      medium: '8px',
      large: '12px',
    },
    shadows: {
      small: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      medium: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      large: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    },
  },

  // Business Settings
  business: {
    // Equipment Categories Default Colors (complementing your brand) - REMOVED VIDEO
    categoryColors: {
      lighting: '#fbbf24', // Your logo gold
      audio: '#1e40af', // Professional blue
      power: '#dc2626', // Alert red
      staging: '#7c3aed', // Creative purple
      effects: '#f59e0b', // Warm gold variant
      'power & distribution': '#dc2626', // Alternative name for power
      'special effects': '#f59e0b', // Alternative name for effects
    },

    // Rental Terms
    defaultTerms: {
      paymentTerms: 'Net 30',
      deliveryRadius: 50, // miles
      minimumRental: 100, // dollars
    },

    // Features
    features: {
      showPricing: false, // Hide all pricing from public
      enableQuoteRequests: true, // Show "Request Quote" buttons
      enableOnlineBooking: false, // Future feature
      showInventoryCount: true, // Show "X Available"
    },
  },

  // SEO & Meta - UPDATED TO REMOVE VIDEO
  seo: {
    defaultTitle:
      'Envision Production Group - Professional Event Equipment Rentals',
    defaultDescription:
      'Professional lighting, audio, and staging equipment rentals in Denver, Colorado. Custom quotes for concerts, corporate events, weddings, and productions.',
    keywords: [
      'event equipment rental',
      'lighting rental',
      'audio rental',
      'staging rental',
      'Denver',
      'Colorado',
      'production equipment',
      'event production',
      'professional lighting',
      'sound equipment',
    ],
    ogImage: '/images/og-image.jpg',
  },

  // Navigation
  navigation: {
    main: [
      { name: 'Home', href: '/' },
      { name: 'Equipment', href: '/equipment' },
      { name: 'Services', href: '/services' },
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    footer: [
      { name: 'Equipment Catalog', href: '/equipment' },
      { name: 'Request Quote', href: '/quote' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
  },
};

// Helper function to get nested config values safely
export const getConfig = (path: string) => {
  return path.split('.').reduce((obj: any, key) => obj?.[key], brandConfig);
};

// Utility functions for common operations
export const brandUtils = {
  // Get logo based on theme
  getLogo: (theme: 'light' | 'dark' = 'dark') => {
    return theme === 'dark'
      ? brandConfig.branding.logo.light
      : brandConfig.branding.logo.dark;
  },

  // Get background styles for sections
  getBackgroundStyle: (section: 'hero' | 'equipment' | 'about' | 'contact') => {
    const config = brandConfig.branding.backgrounds;
    const themeConfig = brandConfig.theme;

    if (themeConfig.backgrounds.useImages && section === 'hero') {
      return {
        backgroundImage: `url('${config.hero.desktop}')`,
        backgroundPosition: config.hero.position,
        backgroundSize: config.hero.size,
        backgroundRepeat: 'no-repeat',
      };
    }

    // Fallback to gradient
    return {};
  },

  // Get hero background classes for Tailwind
  getHeroBackgroundClasses: () => {
    const useImages = brandConfig.theme.backgrounds.useImages;
    const fallback = brandConfig.theme.backgrounds.fallbackToGradient;

    if (useImages) {
      // Use both image and gradient as fallback
      return `bg-gradient-to-r ${brandConfig.theme.gradients.hero} bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-no-repeat`;
    }

    return `bg-gradient-to-r ${brandConfig.theme.gradients.hero}`;
  },

  // Get overlay classes for text readability over images
  getOverlayClasses: (
    section: 'hero' | 'equipment' | 'about' | 'contact' = 'hero'
  ) => {
    if (brandConfig.theme.backgrounds.useImages) {
      return brandConfig.branding.backgrounds.hero.overlay;
    }
    return '';
  },

  // Get category color
  getCategoryColor: (categorySlug: string) => {
    return (
      brandConfig.business.categoryColors[
        categorySlug as keyof typeof brandConfig.business.categoryColors
      ] || brandConfig.branding.colors.primary[500]
    );
  },

  // Format phone number
  formatPhone: (phone: string = brandConfig.contact.phone) => {
    return phone
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  },

  // Build full address string
  getFullAddress: () => {
    const addr = brandConfig.contact.address;
    return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`;
  },
};
