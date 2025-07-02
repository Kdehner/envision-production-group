// frontend/src/components/index.ts
// Export all shared components for easy importing

// Layout Components
export { default as Header } from './layout/Header';
export { default as Footer } from './layout/Footer';
export {
  default as Breadcrumb,
  BREADCRUMBS,
  createBreadcrumbs,
} from './layout/Breadcrumb';
export { default as PageLayout, HeroSection } from './layout/PageLayout';

// CTA Components - NOW ENABLED
export {
  CTASection,
  EquipmentCTA,
  ServicesCTA,
  ContactCTA,
  AboutCTA,
  HelpCTA,
  ConsultationCTA,
} from './shared/CTAs';

// Types (if you want to export them)
export type { BreadcrumbItem } from './layout/Breadcrumb';
