import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Menu, X, CalendarCheck, PhoneCall } from 'lucide-react';
import { Button } from '../common/Button';
import { useBookingStore } from '../../store/bookingStore';
import { motion } from 'framer-motion';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { setStep } = useBookingStore();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'FAQ', path: '/#faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' && !location.hash;
    if (path.includes('#')) {
      const targetHash = '#' + path.split('#')[1];
      return location.pathname === '/' && location.hash === targetHash;
    }
    return location.pathname.startsWith(path);
  };

  const handleBookClick = () => {
    setStep(1);
  };

  const handleNavClick = (e, path) => {
    if (path.includes('#')) {
      e.preventDefault();
      const targetId = path.split('#')[1];
      if (location.pathname !== '/') {
        navigate('/#' + targetId);
      } else {
        window.history.pushState(null, '', '/#' + targetId);
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              whileHover={{ scale: 1.08, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/30"
            >
              <Sparkles className="w-5 h-5 fill-current" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 font-display uppercase">
                Sagarika <span className="text-teal-600">Odicare</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest font-extrabold text-slate-400">
                Services • Odisha
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className={`text-sm font-semibold transition-colors duration-150 hover:text-teal-600 relative py-1 ${
                  isActive(link.path) ? 'text-teal-600 font-bold' : 'text-slate-600'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* CTA & Phone Only - No Admin Buttons on Home/Navbar */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:7681045009"
              className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-teal-600 bg-slate-100 px-3.5 py-2 rounded-xl transition-all hover:bg-slate-200"
            >
              <PhoneCall className="w-3.5 h-3.5 text-teal-600" />
              <span>7681045009</span>
            </a>
            <Link to="/book" onClick={handleBookClick}>
              <Button variant="primary" size="md" icon={CalendarCheck} className="shadow-md shadow-teal-600/20">
                Book a Cleaning
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/book" onClick={handleBookClick}>
              <Button variant="primary" size="sm">
                Book
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={(e) => {
                handleNavClick(e, link.path);
                setMobileMenuOpen(false);
              }}
              className={`block px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                isActive(link.path)
                  ? 'bg-teal-50 text-teal-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <a
              href="tel:7681045009"
              className="flex items-center gap-2 text-sm font-semibold text-slate-800 px-3 py-2"
            >
              <PhoneCall className="w-4 h-4 text-teal-600" />
              <span>7681045009</span>
            </a>
          </div>
        </motion.div>
      )}
    </header>
  );
};
