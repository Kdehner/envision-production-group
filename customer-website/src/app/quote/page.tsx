// frontend/src/app/quote/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { strapiApi, EquipmentItem, getStrapiImageUrl } from '@/lib/strapi';
import { brandConfig, brandUtils } from '@/lib/config';
import { PageLayout, BREADCRUMBS } from '@/components';
import Link from 'next/link';
import Image from 'next/image';

interface ContactRequestData {
  // Contact Information
  contactName: string;
  companyName: string;
  email: string;
  phone: string;

  // Project Overview
  projectName: string;
  projectType: string;
  eventDate: string;
  estimatedAttendees: string;
  venue: string;

  // Equipment Interest
  interestedEquipment: EquipmentItem[];
  equipmentNeeds: string;

  // Additional Info
  budget: string;
  additionalInfo: string;
  preferredContact: 'email' | 'phone';
  urgency: 'asap' | 'this-week' | 'next-week' | 'flexible';
}

interface FormErrors {
  [key: string]: string;
}

export default function ContactForQuotePage() {
  const searchParams = useSearchParams();
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<ContactRequestData>({
    contactName: '',
    companyName: '',
    email: '',
    phone: '',
    projectName: '',
    projectType: '',
    eventDate: '',
    estimatedAttendees: '',
    venue: '',
    interestedEquipment: [],
    equipmentNeeds: '',
    budget: '',
    additionalInfo: '',
    preferredContact: 'email',
    urgency: 'flexible',
  });

  // Load equipment data and handle pre-selected equipment
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const equipmentData = await strapiApi.getEquipment();
        setEquipment(equipmentData);

        // Handle pre-selected equipment from URL params
        const preSelectedId = searchParams.get('equipment');
        if (preSelectedId) {
          const preSelectedItem = equipmentData.find(
            (item) => item.id.toString() === preSelectedId
          );
          if (preSelectedItem) {
            setFormData((prev) => ({
              ...prev,
              interestedEquipment: [preSelectedItem],
            }));
          }
        }
      } catch (error) {
        console.error('Error loading equipment:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [searchParams]);

  const handleInputChange = (
    field: keyof ContactRequestData,
    value: string | EquipmentItem[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const toggleEquipmentInterest = (item: EquipmentItem) => {
    setFormData((prev) => {
      const isAlreadySelected = prev.interestedEquipment.some(
        (eq) => eq.id === item.id
      );
      if (isAlreadySelected) {
        return {
          ...prev,
          interestedEquipment: prev.interestedEquipment.filter(
            (eq) => eq.id !== item.id
          ),
        };
      } else {
        return {
          ...prev,
          interestedEquipment: [...prev.interestedEquipment, item],
        };
      }
    });
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.contactName.trim())
      newErrors.contactName = 'Contact name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.projectName.trim())
      newErrors.projectName = 'Project name is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Create a formatted contact request
      const contactData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        interestedEquipmentSummary: formData.interestedEquipment.map(
          (item) => ({
            name: item.name,
            sku: item.sku,
            brand: item.brand,
            model: item.model,
          })
        ),
      };

      // Here you would send this to your email/CRM system
      console.log('Contact request submitted:', contactData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting contact request:', error);
      alert('Error submitting request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Success page
  if (submitted) {
    return (
      <PageLayout activeSection="quote" breadcrumbs={BREADCRUMBS.quote}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">✅</div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Quote Request Submitted!
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Thank you for your interest in our equipment and services. We'll
                be in touch soon to discuss your project in detail.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                What happens next?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div>
                  <div className="text-yellow-400 text-2xl mb-2">📞</div>
                  <h3 className="font-semibold text-white mb-2">
                    Within 2 Hours
                  </h3>
                  <p className="text-gray-300 text-sm">
                    One of our equipment specialists will contact you to discuss
                    your needs
                  </p>
                </div>
                <div>
                  <div className="text-yellow-400 text-2xl mb-2">📋</div>
                  <h3 className="font-semibold text-white mb-2">
                    Consultation
                  </h3>
                  <p className="text-gray-300 text-sm">
                    We'll create a detailed equipment list and provide
                    transparent pricing
                  </p>
                </div>
                <div>
                  <div className="text-yellow-400 text-2xl mb-2">✨</div>
                  <h3 className="font-semibold text-white mb-2">Your Event</h3>
                  <p className="text-gray-300 text-sm">
                    Professional setup and support to make your event
                    exceptional
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-600">
                <p className="text-gray-300">
                  <strong className="text-white">Project:</strong>{' '}
                  {formData.projectName}
                </p>
                <p className="text-gray-300">
                  <strong className="text-white">Timeline:</strong>{' '}
                  {formData.urgency === 'asap'
                    ? 'ASAP'
                    : formData.urgency === 'this-week'
                    ? 'This week'
                    : formData.urgency === 'next-week'
                    ? 'Next week'
                    : 'Flexible timing'}
                </p>
                <p className="text-gray-300">
                  ⚡ Questions? Call us at:{' '}
                  <strong className="text-white">
                    {brandUtils.formatPhone()}
                  </strong>
                </p>
              </div>
            </div>

            <div className="space-x-4">
              <Link
                href="/equipment"
                className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse More Equipment
              </Link>
              <Link
                href="/"
                className="inline-block border border-gray-600 text-gray-300 py-3 px-6 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout activeSection="quote" breadcrumbs={BREADCRUMBS.quote}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Let's Discuss Your Equipment Needs
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Tell us about your project and we'll create a custom solution that
            fits your vision and budget perfectly.
          </p>

          {/* Value Proposition */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl mb-2">💡</div>
              <h3 className="text-white font-semibold mb-2">
                Expert Consultation
              </h3>
              <p className="text-gray-300 text-sm">
                Our specialists help you choose the right equipment for your
                specific needs
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl mb-2">💰</div>
              <h3 className="text-white font-semibold mb-2">
                Best Value Solutions
              </h3>
              <p className="text-gray-300 text-sm">
                We'll find package deals and alternatives that maximize your
                budget
              </p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-center">
              <div className="text-2xl mb-2">🚚</div>
              <h3 className="text-white font-semibold mb-2">
                Full Service Options
              </h3>
              <p className="text-gray-300 text-sm">
                From delivery to setup, we can handle everything for your event
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Your Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) =>
                    handleInputChange('contactName', e.target.value)
                  }
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.contactName ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="John Smith"
                />
                {errors.contactName && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.contactName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company/Organization
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    handleInputChange('companyName', e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="ABC Company"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </section>

          {/* Project Information */}
          <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Event Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event/Project Name *
                </label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) =>
                    handleInputChange('projectName', e.target.value)
                  }
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.projectName ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Summer Corporate Gala"
                />
                {errors.projectName && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.projectName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) =>
                    handleInputChange('projectType', e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select event type...</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="wedding">Wedding</option>
                  <option value="concert">Concert/Performance</option>
                  <option value="party">Private Party</option>
                  <option value="gala">Gala/Fundraiser</option>
                  <option value="festival">Festival/Outdoor Event</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Date
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) =>
                    handleInputChange('eventDate', e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estimated Attendees
                </label>
                <select
                  value={formData.estimatedAttendees}
                  onChange={(e) =>
                    handleInputChange('estimatedAttendees', e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select attendance...</option>
                  <option value="1-25">1-25 people</option>
                  <option value="26-50">26-50 people</option>
                  <option value="51-100">51-100 people</option>
                  <option value="101-250">101-250 people</option>
                  <option value="251-500">251-500 people</option>
                  <option value="500+">500+ people</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venue/Location
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Denver Convention Center"
                />
              </div>
            </div>
          </section>

          {/* Equipment Interest */}
          <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Equipment Needs
            </h2>

            {/* Selected Equipment Display */}
            {formData.interestedEquipment.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-3">
                  Selected Equipment ({formData.interestedEquipment.length})
                </h3>
                <div className="space-y-3">
                  {formData.interestedEquipment.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-700 p-3 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-600 rounded overflow-hidden">
                          {item.mainImage ? (
                            <Image
                              src={getStrapiImageUrl(item.mainImage.url)}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                              📦
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-sm">
                            {item.name}
                          </h4>
                          <p className="text-gray-300 text-xs">
                            {item.brand} {item.model}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleEquipmentInterest(item)}
                        className="text-red-400 hover:text-red-300 font-medium text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-600 my-6"></div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                What type of equipment are you looking for?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {[
                  'Audio/Sound',
                  'Lighting',
                  'Staging',
                  'Power/Electrical',
                  'Special Effects',
                  'Other',
                ].map((category) => (
                  <label
                    key={category}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-yellow-600 bg-gray-700 border-gray-600 rounded focus:ring-yellow-500 focus:ring-2"
                      onChange={(e) => {
                        const current = formData.equipmentNeeds;
                        if (e.target.checked) {
                          handleInputChange(
                            'equipmentNeeds',
                            current ? `${current}, ${category}` : category
                          );
                        } else {
                          handleInputChange(
                            'equipmentNeeds',
                            current
                              ?.split(', ')
                              .filter((item) => item !== category)
                              .join(', ') || ''
                          );
                        }
                      }}
                    />
                    <span className="text-gray-300 text-sm">{category}</span>
                  </label>
                ))}
              </div>

              <textarea
                value={formData.equipmentNeeds}
                onChange={(e) =>
                  handleInputChange('equipmentNeeds', e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your equipment needs or any specific requirements..."
              />
            </div>
          </section>

          {/* Additional Information */}
          <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Additional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Budget Range
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select budget range...</option>
                  <option value="under-1000">Under $1,000</option>
                  <option value="1000-2500">$1,000 - $2,500</option>
                  <option value="2500-5000">$2,500 - $5,000</option>
                  <option value="5000-10000">$5,000 - $10,000</option>
                  <option value="10000+">$10,000+</option>
                  <option value="discuss">Let's discuss</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timeline
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) =>
                    handleInputChange(
                      'urgency',
                      e.target.value as
                        | 'asap'
                        | 'this-week'
                        | 'next-week'
                        | 'flexible'
                    )
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="flexible">Flexible timing</option>
                  <option value="next-week">Next week</option>
                  <option value="this-week">This week</option>
                  <option value="asap">ASAP</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Additional Information
                </label>
                <textarea
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    handleInputChange('additionalInfo', e.target.value)
                  }
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any additional details about your event, special requirements, or questions..."
                />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={submitting}
              className={`bg-yellow-500 text-gray-900 py-3 px-8 rounded-lg font-semibold hover:bg-yellow-400 transition-colors ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Submitting...' : 'Submit Quote Request'}
            </button>
            <p className="text-gray-400 text-sm mt-3">
              We'll respond within 2 hours during business hours
            </p>
          </div>
        </form>
      </div>
    </PageLayout>
  );
}
