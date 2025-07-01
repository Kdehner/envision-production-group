// frontend/src/app/quote/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { strapiApi, EquipmentItem, getStrapiImageUrl } from '@/lib/strapi';
import { brandConfig, brandUtils } from '@/lib/config';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading contact form...</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-900">
        {/* Header */}
        <header className="bg-gray-800 shadow-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link
                  href="/"
                  className="text-2xl font-bold text-white hover:text-blue-400"
                >
                  {brandConfig.company.name}
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Success Message */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              We'll Be In Touch Soon!
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for reaching out to {brandConfig.company.shortName}! Our
              equipment specialists will contact you to discuss your needs and
              create the perfect solution.
            </p>

            <div className="bg-gray-800 rounded-lg p-8 mb-8 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">
                What happens next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="text-center">
                  <div className="text-3xl mb-3">📞</div>
                  <h4 className="text-white font-semibold mb-2">
                    We'll Contact You
                  </h4>
                  <p className="text-gray-300 text-sm">
                    {formData.urgency === 'asap'
                      ? 'Within 2 hours'
                      : formData.urgency === 'this-week'
                      ? 'Within 24 hours'
                      : 'Within 24-48 hours'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">💡</div>
                  <h4 className="text-white font-semibold mb-2">
                    Discuss Your Needs
                  </h4>
                  <p className="text-gray-300 text-sm">
                    We'll understand your vision and recommend the best
                    equipment solutions
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">📋</div>
                  <h4 className="text-white font-semibold mb-2">
                    Custom Quote
                  </h4>
                  <p className="text-gray-300 text-sm">
                    Receive a detailed quote tailored to your specific
                    requirements
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <p className="text-gray-300">
                📧 We'll reach out via:{' '}
                <strong className="text-white">
                  {formData.preferredContact === 'email'
                    ? formData.email
                    : formData.phone}
                </strong>
              </p>
              <p className="text-gray-300">
                🕒 Timeline:{' '}
                <strong className="text-white">
                  {formData.urgency === 'asap'
                    ? 'ASAP'
                    : formData.urgency === 'this-week'
                    ? 'This week'
                    : formData.urgency === 'next-week'
                    ? 'Next week'
                    : 'Flexible timing'}
                </strong>
              </p>
              <p className="text-gray-300">
                ⚡ Questions? Call us at:{' '}
                <strong className="text-white">
                  {brandUtils.formatPhone()}
                </strong>
              </p>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-white hover:text-blue-400"
              >
                {brandConfig.company.name}
              </Link>
            </div>
            <nav className="flex space-x-8">
              {brandConfig.navigation.main.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-blue-400"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-400 hover:text-white">
              Home
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-white">Contact for Quote</span>
          </div>
        </div>
      </nav>

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
                  placeholder="Your full name"
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
                  placeholder="Company name (optional)"
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
                  placeholder="your@email.com"
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  How would you prefer we contact you?
                </label>
                <select
                  value={formData.preferredContact}
                  onChange={(e) =>
                    handleInputChange(
                      'preferredContact',
                      e.target.value as 'email' | 'phone'
                    )
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone call</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  How urgent is this request?
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
                  <option value="next-week">Need quote next week</option>
                  <option value="this-week">Need quote this week</option>
                  <option value="asap">Need quote ASAP</option>
                </select>
              </div>
            </div>
          </section>

          {/* Project Overview */}
          <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Tell Us About Your Project
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project/Event Name *
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
                  placeholder="Annual Conference, Wedding, Concert, etc."
                />
                {errors.projectName && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.projectName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type of Event
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) =>
                    handleInputChange('projectType', e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select event type</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Conference">Conference</option>
                  <option value="Concert/Festival">Concert/Festival</option>
                  <option value="Trade Show">Trade Show</option>
                  <option value="Private Party">Private Party</option>
                  <option value="Theater/Performance">
                    Theater/Performance
                  </option>
                  <option value="Film/Video Production">
                    Film/Video Production
                  </option>
                  <option value="Other">Other</option>
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
                  Expected Attendees
                </label>
                <select
                  value={formData.estimatedAttendees}
                  onChange={(e) =>
                    handleInputChange('estimatedAttendees', e.target.value)
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  <option value="Under 50">Under 50 people</option>
                  <option value="50-100">50-100 people</option>
                  <option value="100-250">100-250 people</option>
                  <option value="250-500">250-500 people</option>
                  <option value="500-1000">500-1000 people</option>
                  <option value="Over 1000">Over 1000 people</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venue/Location
                </label>
                <input
                  type="text"
                  value={formData.venue}
                  onChange={(e) => handleInputChange('venue', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Convention center, hotel ballroom, outdoor venue, etc."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Estimated Budget Range
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select budget range (optional)</option>
                  <option value="Under $1,000">Under $1,000</option>
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                  <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                  <option value="Over $25,000">Over $25,000</option>
                  <option value="Prefer to discuss">Prefer to discuss</option>
                </select>
              </div>
            </div>
          </section>

          {/* Equipment Interest - Simplified */}
          <section className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-2xl font-semibold text-white mb-6">
              Tell Us About Your Equipment Needs
            </h2>

            {/* Pre-selected Equipment (if coming from equipment page) */}
            {formData.interestedEquipment.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Equipment You're Inquiring About
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.interestedEquipment.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-700 p-4 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
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

                {/* Add separator */}
                <div className="border-t border-gray-600 my-6"></div>
              </div>
            )}

            {/* Equipment Needs Description */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  What type of equipment are you looking for? *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {[
                    'Audio/Sound',
                    'Lighting',
                    'Video/Screens',
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
                                .replace(
                                  new RegExp(`${category},?\\s*`, 'g'),
                                  ''
                                )
                                .replace(/,\s*$/, '')
                            );
                          }
                        }}
                      />
                      <span className="text-gray-300 text-sm">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Describe your equipment needs and vision for the event
                </label>
                <textarea
                  value={formData.equipmentNeeds}
                  onChange={(e) =>
                    handleInputChange('equipmentNeeds', e.target.value)
                  }
                  rows={5}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us about your audio, lighting, staging, or other equipment needs. What's your vision for the event? Any specific requirements or challenges we should know about?"
                />
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div className="flex justify-between items-center">
            <Link
              href="/equipment"
              className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-600 hover:text-white transition-colors"
            >
              ← Browse Equipment First
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
                submitting
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
              }`}
            >
              {submitting ? 'Submitting...' : 'Contact Me About This Project'}
            </button>
          </div>

          {/* Contact Alternative */}
          <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-6 text-center">
            <h3 className="text-blue-300 font-semibold mb-3">
              Prefer to Talk Directly?
            </h3>
            <p className="text-gray-300 mb-4">
              Sometimes it's easier to discuss your needs over the phone. We're
              here to help!
            </p>
            <div className="space-x-4">
              <a
                href={`tel:${brandConfig.contact.phone.replace(/\D/g, '')}`}
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Call {brandUtils.formatPhone()}
              </a>
              <a
                href={`mailto:${brandConfig.contact.email}?subject=Equipment Quote Request`}
                className="inline-block border border-blue-600 text-blue-300 px-6 py-2 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-colors"
              >
                Send Email
              </a>
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-2xl font-bold mb-4">
              {brandConfig.company.name}
            </h4>
            <p className="text-gray-300 mb-6">{brandConfig.company.tagline}</p>
            <div className="flex justify-center space-x-8">
              <span>📧 {brandConfig.contact.email}</span>
              <span>📞 {brandUtils.formatPhone()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
