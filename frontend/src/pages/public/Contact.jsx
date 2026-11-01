import { useState } from 'react';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { MapPreviewCard } from '../../components/common/MapPreviewCard';
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const googleMapsUrl = 'https://maps.app.goo.gl/A4yFufhvPtiUb4WXA';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-extrabold tracking-widest text-teal-600">
          SAGARIKA ODICARE SERVICES • ODISHA
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contact Support & Location</h1>
        <p className="text-slate-500 text-base">Serving Bhubaneswar, Cuttack, Puri, and Khorda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Head Office Info & Prominent Large Map Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-6 space-y-6"
        >
          {/* Head Office Details Card */}
          <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl space-y-5 shadow-xl border border-slate-800">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-teal-400">Head Office Contact Details</h2>
              <span className="text-xs font-bold text-teal-300 bg-teal-500/20 border border-teal-500/30 px-3 py-1 rounded-full">
                Bhubaneswar HQ
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-3 group hover:text-teal-300 transition-colors sm:col-span-2"
              >
                <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="underline decoration-slate-600 group-hover:decoration-teal-400 font-semibold text-sm">
                  Plot No. 302/3022, Sisupalgarh, Bhubaneswar, Odisha 751002.
                </span>
              </a>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-teal-400 shrink-0" />
                <a href="tel:7681045009" className="text-sm font-extrabold text-white hover:text-teal-300">
                  Call: 7681045009
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-teal-400 shrink-0" />
                <span>info@sagarikaodicare.com</span>
              </div>

              <div className="flex items-center gap-3 sm:col-span-2">
                <Clock className="w-5 h-5 text-teal-400 shrink-0" />
                <span>Working Hours: Monday – Sunday (7:00 AM – 9:00 PM IST)</span>
              </div>
            </div>
          </div>

          {/* Prominent Large Interactive Map Preview Card (Left Side) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-600" />
                <span>Interactive Location Map</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Click map to open Google Maps</span>
            </div>
            <MapPreviewCard
              googleMapsUrl={googleMapsUrl}
              heightClassName="h-72 sm:h-96"
            />
          </div>
        </motion.div>

        {/* Right Side: Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs"
        >
          {submitted ? (
            <div className="text-center py-16 space-y-4">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h3 className="text-2xl font-bold text-slate-900">Message Received!</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Thank you for contacting SAGARIKA ODICARE SERVICES. Our customer team will call you back at 7681045009 within 2 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Send Us an Inquiry</h3>
                <p className="text-xs text-slate-500">Fill out the form below to request custom home cleaning quotes or assistance.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Your Full Name" required placeholder="Subhashree Patnaik" />
                <Input label="Email Address" required placeholder="subhashree@example.com" />
              </div>
              <Input label="Phone Number" required placeholder="10-digit mobile number" />
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700">Your Message / Requirement</label>
                <textarea
                  rows={5}
                  required
                  placeholder="How can we assist you with your home cleaning service?"
                  className="w-full rounded-xl border border-slate-300 p-3.5 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none placeholder-slate-400"
                />
              </div>
              <Button variant="primary" size="lg" type="submit" className="w-full shadow-lg shadow-teal-600/20 py-4 text-base">
                Submit Inquiry →
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};
