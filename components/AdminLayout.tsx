import React from 'react';

type AdminView = 'dashboard' | 'news' | 'achievements' | 'gallery' | 'events' | 'pages';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentView: AdminView;
  setCurrentView: (view: AdminView) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, currentView, setCurrentView }) => {
  
  const navItems: { id: AdminView; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'news', label: 'News' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'events', label: 'Events' },
    { id: 'pages', label: 'Pages' },
  ];

  const NavLink: React.FC<{ id: AdminView; label: string }> = ({ id, label }) => {
    const isActive = currentView === id;
    const activeClasses = 'bg-brand-blue text-white';
    const inactiveClasses = 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700';
    
    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          setCurrentView(id);
        }}
        className={`block px-6 py-3 rounded-lg font-medium transition-colors duration-200 ${isActive ? activeClasses : inactiveClasses}`}
      >
        {label}
      </a>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-brand-charcoal">
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-brand-blue dark:text-white">Admin Panel</h2>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {navItems.map(item => <NavLink key={item.id} {...item} />)}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
