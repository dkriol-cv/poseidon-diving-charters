
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import WhatsAppButton from '@/components/WhatsAppButton';
import CookieConsent from '@/components/CookieConsent';
import BookingContactModal from '@/components/BookingContactModal';
import { CookieConsentProvider } from '@/contexts/CookieConsentContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { BlogProvider } from '@/contexts/BlogContext';
import { BookingModalProvider } from '@/contexts/BookingModalContext';
import ProtectedRoute from '@/components/ProtectedRoute';

import { Toaster } from '@/components/ui/toaster';

// Lazy load all pages for better performance
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const ExperiencesPage = React.lazy(() => import('@/pages/ExperiencesPage'));
const TailorMadePage = React.lazy(() => import('@/pages/TailorMadePage'));
const PreDesignedPage = React.lazy(() => import('@/pages/PreDesignedPage'));
const ExclusiveCharterPage = React.lazy(() => import('@/pages/ExclusiveCharterPage'));
const AboutPage = React.lazy(() => import('@/pages/AboutPage'));
const SustainabilityPage = React.lazy(() => import('@/pages/SustainabilityPage'));
const ContactPage = React.lazy(() => import('@/pages/ContactPage'));
const TermsOfService = React.lazy(() => import('@/pages/TermsOfService'));
const PrivacyPolicy = React.lazy(() => import('@/pages/PrivacyPolicy'));
const RefundPolicy = React.lazy(() => import('@/pages/RefundPolicy'));
const CookiePolicy = React.lazy(() => import('@/pages/CookiePolicy'));
const FAQ = React.lazy(() => import('@/pages/FAQ'));

const BlogArchivePage = React.lazy(() => import('@/pages/blog/BlogArchivePage'));
const BlogPostPage = React.lazy(() => import('@/pages/blog/BlogPostPage'));

const AdminLogin = React.lazy(() => import('@/pages/admin/Login'));
const AdminLayout = React.lazy(() => import('@/components/admin/AdminLayout'));
const AdminDashboard = React.lazy(() => import('@/pages/admin/Dashboard'));
const ContactsPage = React.lazy(() => import('@/pages/admin/Contacts'));
const NotificationsPage = React.lazy(() => import('@/pages/admin/Notifications'));
const BlogManagementPage = React.lazy(() => import('@/pages/admin/BlogManagementPage'));
const BlogEditorPage = React.lazy(() => import('@/pages/admin/BlogEditorPage'));
const AvailabilityManagement = React.lazy(() => import('@/pages/admin/AvailabilityManagement'));
const ServicesManagement = React.lazy(() => import('@/pages/admin/ServicesManagement'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-8 h-8 border-4 border-[#03c4c9] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const PublicLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

const AppShell = () => {
  const location = useLocation();
  const hideWhatsApp = location.pathname.startsWith('/admin');

  return (
    <>
      <ScrollToTop />
      {!hideWhatsApp && <WhatsAppButton />}
      <BookingContactModal />
      <React.Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin-access" element={<Navigate to="/admin/login" replace />} />
          
          <Route
            path="/admin"
            element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="availability" element={<AvailabilityManagement />} />
            <Route path="services" element={<ServicesManagement />} />
            <Route path="contacts" element={<ContactsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="settings" element={<Navigate to="/admin/availability" replace />} />
            
            <Route path="blog" element={<BlogManagementPage />} />
            <Route path="blog/new" element={<BlogEditorPage />} />
            <Route path="blog/:id/edit" element={<BlogEditorPage />} />
          </Route>

          <Route
            path="*"
            element={
              <PublicLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/experiences" element={<ExperiencesPage />} />
                  <Route path="/tailor-made" element={<TailorMadePage />} />
                  <Route path="/pre-designed" element={<PreDesignedPage />} />
                  <Route path="/exclusive-charter" element={<ExclusiveCharterPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/sustainability" element={<SustainabilityPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/cookies" element={<CookiePolicy />} />
                  <Route path="/cookie-policy" element={<Navigate to="/cookies" replace />} />
                  
                  <Route path="/blog" element={<BlogArchivePage />} />
                  <Route path="/blog/:slug" element={<BlogPostPage />} />
                </Routes>
              </PublicLayout>
            }
          />
        </Routes>
      </React.Suspense>
      <CookieConsent />
      <Toaster />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BlogProvider>
        <CookieConsentProvider>
          <BookingModalProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppShell />
            </Router>
          </BookingModalProvider>
        </CookieConsentProvider>
      </BlogProvider>
    </AuthProvider>
  );
}

export default App;
