
import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CalendarCheck, LogOut, Globe, BookOpen, DollarSign, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { path: '/admin/dashboard',    icon: LayoutDashboard, label: 'Dashboard'    },
    { path: '/admin/availability', icon: CalendarCheck,  label: 'Availability' },
    { path: '/admin/services',     icon: DollarSign,     label: 'Services'     },
    { path: '/admin/blog',         icon: BookOpen,       label: 'Blog'         },
    { path: '/admin/contacts',     icon: MessageSquare,  label: 'Contacts'     },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 h-screen sticky top-0 z-30">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <img 
          src="https://hcypqomjisyqrczwjrgc.supabase.co/storage/v1/object/public/Poseidon%20Diving%20Charters%20-%20Logo%20Blue/poseidon_diving_charters_black_favicon-01.png" 
          alt="Poseidon Logo" 
          className="w-10 h-10 mr-3 object-contain"
        />
        <span className="font-bold text-xl text-[#2d353b]">POSEIDON</span>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center px-4 py-3 rounded-lg transition-all duration-200 group",
              isActive || (item.path === '/admin/blog' && window.location.pathname.startsWith('/admin/blog')) || (item.path === '/admin/availability' && window.location.pathname.startsWith('/admin/availability')) || (item.path === '/admin/services' && window.location.pathname.startsWith('/admin/services'))
                ? "bg-[#03c4c9]/10 text-[#03c4c9]"
                : "text-[#2d353b] hover:bg-gray-50"
            )}
          >
            {({ isActive }) => {
              const active = isActive || (item.path === '/admin/blog' && window.location.pathname.startsWith('/admin/blog')) || (item.path === '/admin/availability' && window.location.pathname.startsWith('/admin/availability')) || (item.path === '/admin/services' && window.location.pathname.startsWith('/admin/services'));
              return (
                <>
                  <item.icon 
                    size={20} 
                    className={cn(
                      "mr-3 transition-colors",
                      active ? "text-[#03c4c9]" : "text-gray-400 group-hover:text-gray-600"
                    )} 
                  />
                  <span className={cn(
                    "text-sm font-sans",
                    active ? "font-bold" : "font-medium"
                  )}>
                    {item.label}
                  </span>
                </>
              )
            }}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <Link 
          to="/" 
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Globe size={18} className="mr-3 text-gray-400" />
          Back to Website
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={18} className="mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
