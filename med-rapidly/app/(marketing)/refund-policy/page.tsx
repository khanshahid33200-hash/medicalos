export const metadata = {
  title: "Refund Policy | Med Rapidly",
  description: "Learn about Med Rapidly's refund and cancellation policy",
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Refund Policy
          </h1>
          <p className="text-lg text-gray-600">
            Effective Date: January 1, 2026
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Overview</h2>
            <p>
              At Med Rapidly, we want you to be completely satisfied with our services. This Refund Policy outlines the terms and conditions under which refunds are available. Please read this policy carefully.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 30-Day Money-Back Guarantee</h2>
            <p>
              We offer a 30-day money-back guarantee for new customers. If you're not completely satisfied with Med Rapidly within the first 30 days of your subscription, you can request a full refund of your subscription fees.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="font-semibold text-gray-900 mb-2">Eligibility Requirements:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Refund must be requested within 30 days of initial purchase</li>
                <li>Only applicable to full subscription fees, not setup or configuration charges</li>
                <li>Subscriber must be a first-time customer</li>
                <li>Maximum of one refund per organization</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How to Request a Refund</h2>
            <p>To request a refund, follow these steps:</p>
            <ol className="list-decimal pl-6 space-y-3 mt-4">
              <li>Email our support team at support@medrapidly.com with your request</li>
              <li>Include your account email and subscription details</li>
              <li>Provide a brief explanation of your reason for requesting a refund</li>
              <li>Our team will review your request and respond within 5 business days</li>
            </ol>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Refund Processing</h2>
            <p>
              Once your refund is approved, we will process it back to your original payment method within 5-10 business days. Please note that your bank or credit card company may take an additional 1-3 business days to reflect the refund in your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Account Cancellation</h2>
            <p>
              If you wish to cancel your subscription without requesting a refund, you can do so at any time through your account settings. Your service will remain active until the end of your current billing period.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="font-semibold text-gray-900 mb-2">Cancellation Policy:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>No refund for the current billing period after cancellation</li>
                <li>Service continues until the end of the billing period</li>
                <li>Automatic renewal will be disabled immediately</li>
                <li>All data will be retained for 30 days after cancellation</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Partial Refunds</h2>
            <p>
              Partial refunds are not available except in cases of service disruption or technical failures on our part. In such cases, we will issue a pro-rata refund for the service downtime.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Non-Refundable Items</h2>
            <p>The following items are non-refundable:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Custom development or implementation services</li>
              <li>Professional consultation fees</li>
              <li>Setup and migration services</li>
              <li>Training and onboarding services</li>
              <li>Refunds requested after the 30-day guarantee period</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Enterprise Subscriptions</h2>
            <p>
              Enterprise customers with custom pricing agreements may have different refund terms as outlined in their specific service agreement. Please refer to your contract for details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Fraud and Abuse</h2>
            <p>
              We reserve the right to deny refunds in cases of fraud, abuse, or violation of our Terms & Conditions. This includes repeated refund requests, fraudulent account creation, or unauthorized transactions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
            <p>
              Med Rapidly reserves the right to modify this Refund Policy at any time. Changes will be effective immediately upon posting to our website. Your continued use of our services constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact Us</h2>
            <p>For questions about our Refund Policy:</p>
            <div className="bg-gray-50 p-6 rounded-lg mt-4">
              <p className="font-semibold text-gray-900">Med Rapidly Support Team</p>
              <p className="text-gray-600">Email: support@medrapidly.com</p>
              <p className="text-gray-600">Phone: +91-XXXX-XXXXXX</p>
              <p className="text-gray-600">Hours: Monday - Friday, 9 AM - 6 PM IST</p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Last Updated: January 1, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
