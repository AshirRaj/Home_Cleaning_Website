import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MOCK_SERVICES } from '../../mock/services';
import { formatCurrency } from '../../utils/formatters';
import { useBookingStore } from '../../store/bookingStore';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { Input } from '../../components/common/Input';
import { motion } from 'framer-motion';
import heroVideo from '../../assets/video.mp4';
import faqBgImage from '../../assets/image.png';
import {
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  Smile,
  ArrowRight,
  Star,
  ChevronRight,
  ChevronDown,
  Zap,
  PhoneCall,
  UserCheck,
} from 'lucide-react';

export const Home = () => {
  const navigate = useNavigate();
  const { setService, updateProperty, updateSchedule, updateAddress, setStep } = useBookingStore();

  // Quick Booking Widget Local State
  const [selectedServiceId, setSelectedServiceId] = useState(MOCK_SERVICES[0].id);
  const [propertyType, setPropertyType] = useState('Apartment');
  const [bedrooms, setBedrooms] = useState(2);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM – 12:00 PM');
  const [locationCode, setLocationCode] = useState('Bhubaneswar');

  // FAQ Local Accordion State
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  const homeFaqs = [
    {
      q: 'Do I need to supply any cleaning equipment or materials?',
      a: 'No, our professional cleaning team brings all specialized equipment (heavy-duty vacuum cleaners, steam scrubbers, ladders, microfiber cloths) and non-toxic cleaning solutions.',
    },
    {
      q: 'How does the payment process work?',
      a: 'You can choose online payment via UPI, Cards, Net Banking, or select "Pay After Service" to pay after the cleaning is completed to your satisfaction.',
    },
    {
      q: 'Can I reschedule or cancel my booking?',
      a: 'Yes! Free rescheduling or cancellation is available up to 4 hours prior to your scheduled time slot directly through support contact.',
    },
    {
      q: 'Are your cleaning team members background-verified?',
      a: 'Absolutely. Every team member undergoes mandatory criminal background checks, government ID verification, and formal hygiene protocol training.',
    },
    {
      q: 'What happens if I am unhappy with the cleaning quality?',
      a: 'We offer a 100% Satisfaction Guarantee. If you notice any missed area, notify us within 24 hours and a lead specialist will be dispatched to touch it up free of charge.',
    },
    {
      q: 'Which locations in Odisha do you serve?',
      a: 'We provide full home cleaning services in Bhubaneswar, Cuttack, Puri, and Khorda.',
    },
  ];

  const handleQuickBookingSubmit = (e) => {
    e.preventDefault();
    const serviceObj = MOCK_SERVICES.find((s) => s.id === selectedServiceId) || MOCK_SERVICES[0];

    setService(serviceObj);
    updateProperty({ propertyType, bedrooms: Number(bedrooms) });
    if (preferredDate) {
      updateSchedule({ date: preferredDate, timeSlot: preferredTime });
    }
    if (locationCode) {
      updateAddress({ city: locationCode });
    }

    setStep(2);
    navigate('/book');
  };

  const trustBadges = [
    { title: '100% Verified Cleaners', desc: 'Background checked staff', icon: UserCheck },
    { title: 'Hospital Grade Eco-Products', desc: 'Safe for family & pets', icon: ShieldCheck },
    { title: 'Zero Upfront Payment Required', desc: 'Pay Cash or UPI after service', icon: CreditCard },
    { title: 'Satisfaction Guarantee', desc: 'Free touch-ups within 24h', icon: Smile },
  ];

  const steps = [
    { num: '01', title: 'Choose Cleaning Package', desc: 'Select home, deep, kitchen, or sofa cleaning.' },
    { num: '02', title: 'Set Date & Location', desc: 'Pick your preferred date in Bhubaneswar, Cuttack, Puri, or Khorda.' },
    { num: '03', title: 'Confirm & Pay After Service', desc: 'Our team arrives & finishes work, then you pay.' },
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section with Video Background */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-24 rounded-b-[2.5rem]">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-40 pointer-events-none"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>

        {/* Dark Gradient Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/65 to-teal-950/85 z-0 pointer-events-none" />

        {/* Subtle Radial Pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-extrabold tracking-wide">
                <Sparkles className="w-4 h-4 text-teal-400 animate-spin" />
                <span>#1 Professional Cleaning in Odisha</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight uppercase">
                Sagarika <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-sky-300 to-emerald-400">
                  Odicare Services
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Premium home, deep, kitchen, bathroom, and office cleaning services across <strong className="text-teal-400 font-bold">Bhubaneswar, Cuttack, Puri & Khorda</strong>. Transparent pricing & verified specialists.
              </p>

              {/* Call Helpline highlight */}
              <div className="bg-slate-800/80 border border-teal-500/30 p-3.5 rounded-2xl inline-flex items-center gap-3 text-xs text-slate-200">
                <div className="p-2 rounded-xl bg-teal-500 text-slate-950 font-bold">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Direct Booking Hotline</span>
                  <a href="tel:7681045009" className="text-base font-extrabold text-teal-300 hover:underline">
                    Call: 7681045009
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link to="/book" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" icon={CalendarCheck} className="w-full sm:w-auto shadow-lg shadow-teal-500/25 transition-transform hover:-translate-y-0.5">
                    Book a Cleaning
                  </Button>
                </Link>
                <Link to="/services" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    icon={ArrowRight}
                    className="w-full sm:w-auto !bg-slate-800 !text-white !border-slate-600 hover:!bg-slate-700 hover:!text-white hover:!border-slate-500 transition-transform hover:-translate-y-0.5"
                  >
                    Explore Services
                  </Button>
                </Link>
              </div>

              {/* Rating pill */}
              <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-slate-300">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="font-semibold">4.9/5 Rating across Bhubaneswar, Cuttack & Puri</span>
              </div>
            </motion.div>

            {/* Right Side: Quick Booking Widget */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <div className="bg-white/95 backdrop-blur-md text-slate-900 rounded-3xl p-6 shadow-2xl border border-white/20">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">Quick Online Booking</h3>
                      <p className="text-xs text-slate-500">Calculate instant Odisha estimate</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full">
                    Odisha
                  </span>
                </div>

                <form onSubmit={handleQuickBookingSubmit} className="space-y-4">
                  {/* Select Service */}
                  <Select
                    label="Cleaning Service"
                    value={selectedServiceId}
                    onChange={(e) => setSelectedServiceId(e.target.value)}
                    options={MOCK_SERVICES.map((s) => ({ value: s.id, label: `${s.name} (${formatCurrency(s.startingPrice)})` }))}
                  />

                  {/* Property Type & Bedrooms */}
                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label="Property Type"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      options={[
                        { value: 'Apartment', label: 'Apartment' },
                        { value: 'House', label: 'House' },
                        { value: 'Villa', label: 'Villa' },
                        { value: 'Office', label: 'Office' },
                      ]}
                    />
                    <Select
                      label="Bedrooms"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      options={[
                        { value: '1', label: '1 BHK' },
                        { value: '2', label: '2 BHK' },
                        { value: '3', label: '3 BHK' },
                        { value: '4', label: '4+ BHK' },
                      ]}
                    />
                  </div>

                  {/* Preferred Date & Time */}
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Preferred Date"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                    />
                    <Select
                      label="Time Slot"
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      options={[
                        { value: '08:00 AM – 10:00 AM', label: '8 AM - 10 AM' },
                        { value: '10:00 AM – 12:00 PM', label: '10 AM - 12 PM' },
                        { value: '12:00 PM – 02:00 PM', label: '12 PM - 2 PM' },
                        { value: '02:00 PM – 04:00 PM', label: '2 PM - 4 PM' },
                      ]}
                    />
                  </div>

                  {/* City Selection dropdown for Odisha */}
                  <Select
                    label="Select Odisha Service City"
                    value={locationCode}
                    onChange={(e) => setLocationCode(e.target.value)}
                    options={[
                      { value: 'Bhubaneswar', label: 'Bhubaneswar' },
                      { value: 'Cuttack', label: 'Cuttack' },
                      { value: 'Puri', label: 'Puri' },
                      { value: 'Khorda', label: 'Khorda' },
                    ]}
                  />

                  <Button variant="primary" size="lg" type="submit" className="w-full mt-2 shadow-lg shadow-teal-600/30">
                    Continue Booking →
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustBadges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg shadow-slate-100 flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-teal-50 text-teal-600 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{badge.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{badge.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-teal-600">
              Popular Home Services
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Odisha's Top Rated Cleaning Services
            </h2>
          </div>
          <Link to="/services">
            <Button variant="outline" size="sm" icon={ChevronRight}>
              View All Services
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_SERVICES.slice(0, 6).map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {service.badge && (
                  <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full">
                    {service.badge}
                  </span>
                )}
              </div>

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold text-teal-600">{service.category}</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" /> {service.rating} ({service.reviewCount})
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-2 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Starting from</span>
                    <span className="text-xl font-extrabold text-slate-900">
                      {formatCurrency(service.startingPrice)}
                    </span>
                  </div>
                  <Link to={`/services/${service.id}`}>
                    <Button variant="primary" size="sm" icon={ChevronRight}>
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-slate-900 text-white py-16 rounded-3xl max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase font-extrabold tracking-widest text-teal-400">
            Hassle Free Booking
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight">
            How SAGARIKA ODICARE Works
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Simple 3-step process to transform your home into a sparkling clean sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              className="bg-slate-800/80 p-8 rounded-2xl border border-slate-700/60 space-y-4 text-center relative z-10"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-500 text-slate-950 font-black text-lg flex items-center justify-center mx-auto shadow-md shadow-teal-500/20">
                {s.num}
              </div>
              <h3 className="text-lg font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </motion.div>

          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-slate-900 text-white rounded-3xl p-10 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready for a Spotless Home?
            </h2>
            <p className="text-slate-200 text-sm leading-relaxed">
              Book professional cleaners in Bhubaneswar, Cuttack, Puri, & Khorda with 100% satisfaction guarantee.
            </p>
            <div className="pt-2">
              <Link to="/book">
                <Button variant="secondary" size="lg" icon={CalendarCheck} className="shadow-xl">
                  Book Your Service Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Section with Background Image */}
      <section
        id="faq"
        className="relative scroll-mt-24 py-16 overflow-hidden rounded-3xl max-w-7xl mx-auto my-8 border border-slate-700/60 shadow-2xl bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${faqBgImage})` }}
      >
        {/* Subtle Semi-Transparent Dark Overlay for contrast */}
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-950/70" />

        {/* FAQ Content Container */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-teal-400 bg-teal-500/10 px-3.5 py-1.5 rounded-full border border-teal-500/20">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Everything you need to know about our cleaning services, pricing, equipment, and satisfaction guarantee.
            </p>
          </div>

          <div className="space-y-4">
            {homeFaqs.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-700/80 overflow-hidden transition-all shadow-lg hover:border-teal-500/50"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    className="w-full p-5 text-left font-bold text-white flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/80 transition-colors"
                  >
                    <span className="text-sm sm:text-base text-slate-100">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-teal-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800 bg-slate-950/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
