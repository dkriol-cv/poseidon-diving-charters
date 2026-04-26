import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileSidebarDrawer from './MobileSidebarDrawer';
import Topbar from './Topbar';
import { AdminProvider } from '@/contexts/AdminContext';

const AdminLayoutContent = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar (Fixed) */}
      <Sidebar />

      {/* Mobile Drawer (Overlay) */}
      <MobileSidebarDrawer />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <Topbar />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  return (
    <AdminProvider>
      <AdminLayoutContent />
    </AdminProvider>
  );
};

export default AdminLayout;