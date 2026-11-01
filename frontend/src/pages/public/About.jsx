import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';
import { Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <span className="text-xs uppercase font-extrabold tracking-widest text-teal-600">
          SAGARIKA ODICARE SERVICES
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Redefining Home Cleaning Excellence in Odisha
        </h1>
        <p className="text-slate-500 text-base leading-relaxed">
          Founded with a passion for household hygiene and convenience, SAGARIKA ODICARE SERVICES connects homeowners across Bhubaneswar, Cuttack, Puri, and Khorda with expert, background-verified home cleaning specialists.
        </p>
      </motion.div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          whileHover={{ y: -6 }}
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Background Checked</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every home cleaning specialist undergoes mandatory criminal background verification and intense hygiene protocol training.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -6 }}
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Eco-Friendly Solutions</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We use non-toxic, hospital-grade eco-friendly cleaning solutions completely safe for children and pets.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -6 }}
          className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-center"
        >
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">100% Satisfaction</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            If you are dissatisfied with any home area, notify us within 24 hours for a complimentary touch-up.
          </p>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="bg-slate-900 text-white rounded-3xl p-10 text-center space-y-4 shadow-xl">
        <h2 className="text-2xl font-bold">Ready for a Spotless, Fresh Home?</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Book online in under 2 minutes or call 7681045009. Transparent pricing with zero hidden fees.
        </p>
        <Link to="/book" className="inline-block pt-2">
          <Button variant="primary" size="lg">
            Book Your Home Cleaning Today →
          </Button>
        </Link>
      </div>
    </div>
  );
};
