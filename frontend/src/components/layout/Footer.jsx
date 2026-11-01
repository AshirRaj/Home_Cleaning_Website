import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin, ShieldCheck, Lock, ExternalLink } from 'lucide-react';

export const Footer = () => {
  const googleMapsUrl = 'https://maps.app.goo.gl/A4yFufhvPtiUb4WXA';

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
                <Sparkles className="w-5 h-5 fill-current text-slate-950" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight uppercase">
                Sagarika <span className="text-teal-400">Odicare</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              SAGARIKA ODICARE SERVICES — Odisha's premier cleaning specialists operating across Bhubaneswar, Cuttack, Puri, and Khorda.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-teal-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>100% Verified Odisha Cleaners</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase font-extrabold text-white tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-teal-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-teal-400 transition-colors">
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-teal-400 transition-colors">
                  FAQ & Support
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-teal-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Cleaning Services */}
          <div>
            <h4 className="text-xs uppercase font-extrabold text-white tracking-wider mb-4">
              Our Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services/deep-cleaning" className="hover:text-teal-400 transition-colors">
                  Deep Home Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services/standard-cleaning" className="hover:text-teal-400 transition-colors">
                  Standard Home Clean
                </Link>
              </li>
              <li>
                <Link to="/services/bathroom-cleaning" className="hover:text-teal-400 transition-colors">
                  Bathroom Sanitization
                </Link>
              </li>
              <li>
                <Link to="/services/kitchen-cleaning" className="hover:text-teal-400 transition-colors">
                  Kitchen Degreasing
                </Link>
              </li>
              <li>
                <Link to="/services/sofa-carpet-cleaning" className="hover:text-teal-400 transition-colors">
                  Sofa Shampooing
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold text-white tracking-wider mb-2">
              Service Locations
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5 text-slate-400">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-teal-300 transition-colors flex items-center gap-1 group"
                >
                  <span>Plot No. 302/3022, Sisupalgarh, Bhubaneswar, Odisha 751002.</span>
                  <ExternalLink className="w-3 h-3 text-teal-400 opacity-70 group-hover:opacity-100" />
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="tel:7681045009" className="hover:text-teal-400 font-bold text-white text-sm">7681045009</a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>info@sagarikaodicare.com</span>
              </li>
              <li className="pt-2">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-teal-400 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg border border-slate-700 font-semibold transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>View Google Maps 📍</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SAGARIKA ODICARE SERVICES. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-400 transition-colors">
              Terms & Conditions
            </Link>

            {/* Discreet Admin Login Link */}
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-slate-500 hover:text-teal-400 transition-colors pl-4 border-l border-slate-800"
              title="Admin Staff Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
