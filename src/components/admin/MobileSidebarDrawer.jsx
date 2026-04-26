
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, X, LogOut, Globe, BookOpen, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';

const MobileSidebarDrawer = () => {
  const { sidebarOpen, closeSidebar } = useAdmin();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/availability', icon: CalendarCheck, label: 'Availability' },
    { path: '/admin/services', icon: DollarSign, label: 'Services' },
    { path: '/admin/blog', icon: BookOpen, label: 'Blog' },
  ];

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSidebar}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl md:hidden flex flex-col"
          >
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
              <div className="flex items-center">
                 <img 
                   src="https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Poseidon%20Diving%20Charters%20-%20Logo%20Blue/poseidon_diving_charters_black_favicon-01.png" 
                   alt="Poseidon Logo" 
                   className="w-10 h-10 mr-3 object-contain"
                 />
                 <span className="font-bold text-xl text-[#2d353b]">POSEIDON</span>
              </div>
              <Button variant="ghost" size="icon" onClick={closeSidebar}>
                <X size={20} className="text-gray-400 hover:text-gray-600" />
              </Button>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={({ isActive }) => cn(
                    "flex items-center px-4 py-3 rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-[#03c4c9]/10 text-[#03c4c9] font-bold"
                      : "text-[#2d353b] hover:bg-gray-50 font-medium"
                  )}
                >
                  <item.icon size={20} className="mr-3 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 space-y-2 bg-gray-50/50">
              <Link 
                to="/" 
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg transition-colors"
                onClick={closeSidebar}
              >
                <Globe size={18} className="mr-3 text-gray-400" />
                Back to Website
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={18} className="mr-3" />
                Logout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileSidebarDrawer;
