import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

// Public Pages
import { Home } from '../pages/public/Home';
import { Services } from '../pages/public/Services';
import { ServiceDetails } from '../pages/public/ServiceDetails';
import { Booking } from '../pages/public/Booking';
import { BookingReview } from '../pages/public/BookingReview';
import { Payment } from '../pages/public/Payment';
import { BookingSuccess } from '../pages/public/BookingSuccess';
import { About } from '../pages/public/About';
import { Contact } from '../pages/public/Contact';
import { FAQ } from '../pages/public/FAQ';
import { PrivacyPolicy } from '../pages/public/PrivacyPolicy';
import { Terms } from '../pages/public/Terms';

// Admin Pages
import { AdminLogin } from '../pages/admin/AdminLogin';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminServices } from '../pages/admin/AdminServices';
import { AdminBookings } from '../pages/admin/AdminBookings';
import { AdminBookingDetails } from '../pages/admin/AdminBookingDetails';
import { AdminSettings } from '../pages/admin/AdminSettings';

// Layouts & Guard
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { LocationMapBanner } from '../components/common/LocationMapBanner';
import { AdminSidebar } from '../components/layout/AdminSidebar';
import { AdminHeader } from '../components/layout/AdminHeader';
import { ProtectedAdminRoute } from './ProtectedAdminRoute';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

// Scroll To Top / Scroll To Hash on route change
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

// Layout Wrappers
const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen relative">
    <Navbar />
    <main className="flex-1">{children}</main>
    <LocationMapBanner />
    <Footer />
    <WhatsAppButton />
  </div>
);

const AdminLayout = ({ title, children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100 relative">
      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader title={title} onToggleMobileSidebar={() => setMobileOpen(!mobileOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export const AppRoutes = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/services/:serviceId" element={<PublicLayout><ServiceDetails /></PublicLayout>} />
        <Route path="/book" element={<PublicLayout><Booking /></PublicLayout>} />
        <Route path="/book/review" element={<PublicLayout><BookingReview /></PublicLayout>} />
        <Route path="/book/payment" element={<PublicLayout><Payment /></PublicLayout>} />
        <Route path="/book/success" element={<PublicLayout><BookingSuccess /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
        <Route path="/privacy-policy" element={<PublicLayout><PrivacyPolicy /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />

        {/* ADMIN LOGIN */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* PROTECTED ADMIN ROUTES */}
        <Route element={<ProtectedAdminRoute />}>
          <Route path="/admin/dashboard" element={<AdminLayout title="Admin Operations Dashboard"><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/services" element={<AdminLayout title="Service Catalog Management"><AdminServices /></AdminLayout>} />
          <Route path="/admin/bookings" element={<AdminLayout title="All Customer Bookings"><AdminBookings /></AdminLayout>} />
          <Route path="/admin/bookings/:bookingId" element={<AdminLayout title="Booking Specification"><AdminBookingDetails /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout title="Control Panel Settings"><AdminSettings /></AdminLayout>} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<PublicLayout><Home /></PublicLayout>} />
      </Routes>
    </>
  );
};
