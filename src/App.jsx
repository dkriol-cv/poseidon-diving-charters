
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

import HomePage from '@/pages/HomePage';
import ExperiencesPage from '@/pages/ExperiencesPage';
import TailorMadePage from '@/pages/TailorMadePage';
import PreDesignedPage from '@/pages/PreDesignedPage';
import ExclusiveCharterPage from '@/pages/ExclusiveCharterPage';
import AboutPage from '@/pages/AboutPage';
import SustainabilityPage from '@/pages/SustainabilityPage';
import ContactPage from '@/pages/ContactPage';
import TermsOfService from '@/pages/TermsOfService';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import RefundPolicy from '@/pages/RefundPolicy';
import CookiePolicy from '@/pages/CookiePolicy';
import FAQ from '@/pages/FAQ';

import BlogArchivePage from '@/pages/blog/BlogArchivePage';
import BlogPostPage from '@/pages/blog/BlogPostPage';

import AdminLogin from '@/pages/admin/Login';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/Dashboard';
import ContactsPage from '@/pages/admin/Contacts';
import NotificationsPage from '@/pages/admin/Notifications';
import BlogManagementPage from '@/pages/admin/BlogManagementPage';
import BlogEditorPage from '@/pages/admin/BlogEditorPage';
import AvailabilityManagement from '@/pages/admin/AvailabilityManagement';
import ServicesManagement from '@/pages/admin/ServicesManagement';

import { Toaster } from '@/components/ui/toaster';

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
