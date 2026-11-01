import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '../../components/common/Input';

export const FAQ = () => {
  const [openIdx, setOpenIdx] = useState(0);
  const [search, setSearch] = useState('');

  const faqs = [
    {
      q: 'Do I need to supply any cleaning equipment or materials?',
      a: 'No, our professional cleaning team brings all specialized equipment (heavy-duty vacuum cleaners, steam scrubbers, ladders, microfiber cloths) and non-toxic cleaning solutions.',
    },
    {
      q: 'How does the payment process work?',
      a: 'You select your service, specify property details, and choose your arrival slot. At checkout, you review your breakdown and authorize payment online via UPI, Cards, Net Banking, or Wallet. Your booking is instantly confirmed.',
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
      q: 'How long does a deep home cleaning session take?',
      a: 'Depending on the property size (e.g. 2BHK vs 4BHK), deep cleaning takes between 4 to 6 hours with a crew of 2 to 4 specialists.',
    },
  ];

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <span className="text-xs uppercase font-extrabold tracking-widest text-teal-600">
          Got Questions?
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-slate-500 text-sm">
          Everything you need to know about our services, booking process, and satisfaction guarantee.
        </p>
      </div>

      <Input
        icon={Search}
        placeholder="Search questions (e.g., payment, equipment, rescheduling)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-4">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50"
              >
                <span className="text-base">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-teal-600 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
