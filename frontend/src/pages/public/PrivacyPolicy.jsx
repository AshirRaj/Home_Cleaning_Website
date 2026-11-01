export const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-slate-800">
      <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
      <p className="text-xs text-slate-400">Last updated: August 25, 2026</p>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs leading-relaxed text-slate-600">
        <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us when booking cleaning services, including your name, contact phone number, email address, property service location, and preferred arrival schedule.
        </p>

        <h2 className="text-base font-bold text-slate-900">2. How We Use Your Information</h2>
        <p>
          Your information is strictly used to dispatch verified cleaning teams to your venue, process payment orders, send automated booking confirmations via email and WhatsApp, and handle customer service requests.
        </p>

        <h2 className="text-base font-bold text-slate-900">3. Data Security & Storage</h2>
        <p>
          We employ industry-standard 256-bit encryption for data in transit and at rest. Payment card numbers and banking credentials are processed directly through PCI-DSS compliant payment gateways and are never stored on our frontend servers.
        </p>

        <h2 className="text-base font-bold text-slate-900">4. Third-Party Services</h2>
        <p>
          We do not sell, rent, or lease your personal information to third parties. Data is shared solely with payment providers and messaging platforms for sending confirmation notifications.
        </p>
      </div>
    </div>
  );
};
