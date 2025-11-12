import React, { useState, useCallback } from 'react';
import AdminLayout from './components/AdminLayout';
import ContentTable from './components/ContentTable';
import ContentForm from './components/ContentForm';

type AdminView = 'dashboard' | 'akademik' | 'pengumuman' | 'artikel' | 'prestasi' | 'galeri' | 'events' | 'pages';

const AdminPage = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = useCallback(() => {
    setRefreshKey(oldKey => oldKey + 1);
  }, []);

  const viewTitles: Record<AdminView, string> = {
    dashboard: 'Dashboard',
    akademik: 'Manage Akademik',
    pengumuman: 'Manage Pengumuman',
    artikel: 'Manage Artikel',
    prestasi: 'Manage Prestasi',

    galeri: 'Manage Galeri',
    events: 'Manage Events',
    pages: 'Manage Pages',
  };

  const getTitle = () => {
    if (editingItem) {
      const singularView = currentView.endsWith('s') ? currentView.slice(0, -1) : currentView;
      return `Editing ${singularView.charAt(0).toUpperCase() + singularView.slice(1)}`;
    }
    return viewTitles[currentView];
  };

  const renderContent = () => {
    if (editingItem) {
      return <ContentForm item={editingItem} view={currentView} setEditingItem={setEditingItem} refreshData={refreshData} />;
    }

    if (currentView === 'dashboard') {
      return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Welcome to the Admin Panel.
          </p>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            You can manage the website content from the sidebar. Select a category to begin.
          </p>
        </div>
      );
    }
    
    return <ContentTable view={currentView} setEditingItem={setEditingItem} refreshKey={refreshKey} refreshData={refreshData} />;
  };

  return (
    <AdminLayout currentView={currentView} setCurrentView={setCurrentView} title={getTitle()}>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminPage;