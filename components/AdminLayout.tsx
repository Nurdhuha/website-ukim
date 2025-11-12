import React, { useState } from 'react';
import { Dashboard, News, Achievements, Gallery, Events, Pages, MenuIcon } from './icons';

type AdminView = 'dashboard' | 'akademik' | 'pengumuman' | 'artikel' | 'prestasi' | 'galeri' | 'events' | 'pages';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView: AdminView;
  setCurrentView: (view: AdminView) => void;
  title: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentView, setCurrentView, title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems: { id: AdminView; label: string; icon: JSX.Element }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Dashboard /> },
    { id: 'akademik', label: 'Akademik', icon: <News /> },
    { id: 'pengumuman', label: 'Pengumuman', icon: <News /> },
    { id: 'artikel', label: 'Artikel', icon: <News /> },
    { id: 'prestasi', label: 'Prestasi', icon: <Achievements /> },

    { id: 'galeri', label: 'Galeri', icon: <Gallery /> },
    { id: 'events', label: 'Events', icon: <Events /> },
    { id: 'pages', label: 'Pages', icon: <Pages /> },
  ];

  const handleSetView = (view: AdminView) => {
    setCurrentView(view);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const NavLink: React.FC<{ id: AdminView; label: string; icon: JSX.Element }> = ({ id, label, icon }) => {
    const isActive = currentView === id;
    const activeClasses = 'bg-brand-blue text-white';
    const inactiveClasses = 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700';
    
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleSetView(id);
        }}
        className={`flex items-center px-4 py-3 rounded-lg font-medium transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
      >
        <span className="mr-3">{icon}</span>
        {label}
      </a>
    );
  };

  return (
    <div className="relative min-h-screen md:flex bg-gray-100 dark:bg-brand-charcoal">
      {/* Mobile sidebar overlay */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-white dark:bg-gray-800 shadow-md w-64 px-4 py-6 z-30
                   transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                   md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="px-4 mb-6">
          <h2 className="text-2xl font-bold text-brand-blue dark:text-white">Admin Panel</h2>
        </div>
        <nav className="space-y-2">
          {navItems.map(item => <NavLink key={item.id} {...item} />)}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {/* Mobile header */}
        <div className="md:hidden flex justify-between items-center mb-6">
          <button onClick={() => setIsSidebarOpen(true)} className="text-gray-800 dark:text-white">
            <MenuIcon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
        </div>

        <div className="max-w-7xl mx-auto">
          <h1 className="hidden md:block text-3xl font-bold text-gray-900 dark:text-white mb-6">{title}</h1>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
