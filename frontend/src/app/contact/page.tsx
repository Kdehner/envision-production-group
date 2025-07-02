// frontend/src/app/contact/page.tsx
'use client';

import { useState } from 'react';
import { brandConfig, brandUtils } from '@/lib/config';
import { PageLayout, BREADCRUMBS, HeroSection } from '@/components';
import { ContactCTA } from '@/components/shared/CTAs';
import Link from 'next/link';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  preferredContact: 'email' | 'phone';
  urgency: 'low' | 'medium' | 'high';
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email',
    urgency: 'medium',
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // TODO: Implement actual form submission to backend
      // For now, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log('Contact form submitted:', formData);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(
        'There was an error sending your message. Please try calling us directly.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Success page
  if (submitted) {
    return (
      <PageLayout activeSection="contact" breadcrumbs={BREADCRUMBS.contact}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">📧</div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Message Sent Successfully!
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Thank you for reaching out to Envision Production Group. We'll
                get back to you within 24 hours.
              </p>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                What happens next?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div>
                  <div className="text-yellow-400 text-2xl mb-2">
                    {formData.preferredContact === 'phone' ? '📞' : '📧'}
                  </div>
                  <h3 className="font-semibold text-white mb-2">
                    We'll Respond Via{' '}
                    {formData.preferredContact === 'phone' ? 'Phone' : 'Email'}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Based on your preference, we'll reach out to you{' '}
                    {formData.preferredContact === 'phone'
                      ? 'by phone'
                      : 'via email'}{' '}
                    to discuss your inquiry.
                  </p>
                </div>
                <div>
                  <div className="text-yellow-400 text-2xl mb-2">⏰</div>
                  <h3 className="font-semibold text-white mb-2">
                    {formData.urgency === 'high'
                      ? 'Within 4 Hours'
                      : formData.urgency === 'medium'
                      ? 'Within 24 Hours'
                      : 'Within 48 Hours'}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    We'll respond according to your indicated priority level and
                    get you the information you need.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-600">
                <p className="text-gray-300">
                  <strong className="text-white">Subject:</strong>{' '}
                  {formData.subject}
                </p>
                <p className="text-gray-300 mt-2">
                  <strong className="text-white">Urgent?</strong> Call us
                  directly at{' '}
                  <a
                    href={`tel:${brandConfig.contact.phone.replace(/\D/g, '')}`}
                    className="text-yellow-400 hover:text-yellow-300 font-semibold"
                  >
                    {brandUtils.formatPhone()}
                  </a>
                </p>
              </div>
            </div>

            <div className="space-x-4">
              <Link
                href="/equipment"
                className="inline-block bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Browse Equipment
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
    <PageLayout activeSection="contact" breadcrumbs={BREADCRUMBS.contact}>
      {/* Hero Section */}
      <HeroSection
        title="Get in Touch"
        subtitle="Ready to discuss your event? Have questions about our equipment? Our team is here to help you create an unforgettable experience."
        primaryButton={{
          text: 'Quick Quote Request',
          href: '/quote',
        }}
        secondaryButton={{
          text: `Call ${brandUtils.formatPhone()}`,
          href: `tel:${brandConfig.contact.phone.replace(/\D/g, '')}`,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">
              Contact Information
            </h2>

            {/* Primary Contact */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start space-x-4">
                <div className="text-yellow-400 text-2xl">📍</div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Location</h3>
                  <p className="text-gray-300">
                    {brandConfig.contact.address.street}
                    <br />
                    {brandConfig.contact.address.city},{' '}
                    {brandConfig.contact.address.state}{' '}
                    {brandConfig.contact.address.zip}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    *By appointment only - we're often out on site setups
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-yellow-400 text-2xl">📞</div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Phone</h3>
                  <a
                    href={`tel:${brandConfig.contact.phone.replace(/\D/g, '')}`}
                    className="text-blue-400 hover:text-blue-300 text-lg font-medium"
                  >
                    {brandUtils.formatPhone()}
                  </a>
                  <p className="text-gray-400 text-sm mt-1">
                    Available 8 AM - 8 PM, 7 days a week
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="text-yellow-400 text-2xl">📧</div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Email</h3>
                  <a
                    href={`mailto:${brandConfig.contact.email}`}
                    className="text-blue-400 hover:text-blue-300 text-lg font-medium"
                  >
                    {brandConfig.contact.email}
                  </a>
                  <p className="text-gray-400 text-sm mt-1">
                    Quotes and general inquiries
                  </p>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">
                Business Hours
              </h3>
              <div className="space-y-2 text-gray-300">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span>8:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-600">
                <p className="text-gray-400 text-sm">
                  <strong>Emergency Support:</strong> Available 24/7 during
                  event rental periods
                </p>
              </div>
            </div>

            {/* Service Areas */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-4">
                Service Areas
              </h3>
              <p className="text-gray-300 mb-4">
                We proudly serve the Denver metropolitan area and surrounding
                Colorado communities:
              </p>
              <div className="grid grid-cols-2 gap-2 text-gray-300 text-sm">
                <div>• Denver</div>
                <div>• Boulder</div>
                <div>• Aurora</div>
                <div>• Westminster</div>
                <div>• Thornton</div>
                <div>• Lakewood</div>
                <div>• Arvada</div>
                <div>• Wheat Ridge</div>
                <div>• Broomfield</div>
                <div>• Golden</div>
                <div>• Englewood</div>
                <div>• Littleton</div>
              </div>
              <p className="text-gray-400 text-sm mt-4">
                Other locations available with travel fees. Contact us for
                details.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-white font-medium mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-white font-medium mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Phone and Subject */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-white font-medium mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-white font-medium mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select a subject</option>
                    <option value="Equipment Rental Quote">
                      Equipment Rental Quote
                    </option>
                    <option value="Equipment Availability">
                      Equipment Availability
                    </option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Partnership Inquiry">
                      Partnership Inquiry
                    </option>
                    <option value="General Question">General Question</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-white font-medium mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-vertical"
                  placeholder="Tell us about your event, equipment needs, timeline, or any questions you have..."
                />
              </div>

              {/* Contact Preferences */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="preferredContact"
                    className="block text-white font-medium mb-2"
                  >
                    Preferred Contact Method
                  </label>
                  <select
                    id="preferredContact"
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone Call</option>
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="urgency"
                    className="block text-white font-medium mb-2"
                  >
                    Priority Level
                  </label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Quote needed</option>
                    <option value="high">High - Urgent/Event soon</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-yellow-500 text-gray-900 py-4 px-6 rounded-lg font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending Message...' : 'Send Message'}
                </button>
                <p className="text-gray-400 text-sm mt-2 text-center">
                  We'll respond within 24 hours (or sooner for urgent requests)
                </p>
              </div>
            </form>

            {/* Quick Contact Options */}
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-4">
                Need immediate assistance?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={`tel:${brandConfig.contact.phone.replace(/\D/g, '')}`}
                  className="flex items-center justify-center space-x-2 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span>📞</span>
                  <span>Call Now</span>
                </a>
                <Link
                  href="/quote"
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>⚡</span>
                  <span>Quick Quote</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-300">
              Quick answers to common questions about our services
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="font-semibold text-white mb-3">
                  How far in advance should I book equipment?
                </h3>
                <p className="text-gray-300 text-sm">
                  For best availability, we recommend booking 2-4 weeks in
                  advance. However, we often have equipment available for
                  last-minute bookings. Contact us to check availability for
                  your dates.
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="font-semibold text-white mb-3">
                  Do you provide setup and operation services?
                </h3>
                <p className="text-gray-300 text-sm">
                  Yes! We offer equipment delivery, setup, operation, and
                  breakdown services. Our technicians can run your lighting and
                  sound throughout your event. Setup services are quoted
                  separately from equipment rental.
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="font-semibold text-white mb-3">
                  What's included in the rental price?
                </h3>
                <p className="text-gray-300 text-sm">
                  Rental prices include the equipment, all necessary cables and
                  accessories, and basic technical support. Delivery, setup, and
                  operator services are available for additional fees.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="font-semibold text-white mb-3">
                  Do you offer discounts?
                </h3>
                <p className="text-gray-300 text-sm">
                  Yes! We offer special pricing for educational institutions,
                  non-profit organizations, repeat customers, and multi-day
                  rentals. Contact us for a custom quote based on your specific
                  needs.
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="font-semibold text-white mb-3">
                  What if equipment fails during my event?
                </h3>
                <p className="text-gray-300 text-sm">
                  We maintain backup equipment and provide 24/7 emergency
                  support during rental periods. If any equipment fails, we'll
                  quickly provide a replacement or technician support to resolve
                  the issue.
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-6 border border-gray-600">
                <h3 className="font-semibold text-white mb-3">
                  Can I pick up equipment myself?
                </h3>
                <p className="text-gray-300 text-sm">
                  Absolutely! Pickup and drop-off can save on delivery fees.
                  We'll schedule a convenient time for you to collect your
                  equipment and provide a brief orientation on its operation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <ContactCTA />
    </PageLayout>
  );
}
