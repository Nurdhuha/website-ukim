import React, { useState, useCallback } from 'react';
import AdminLayout from './components/AdminLayout';
import ContentTable from './components/ContentTable';
import ContentForm from './components/ContentForm';

type AdminView = 'dashboard' | 'news' | 'achievements' | 'gallery' | 'events' | 'pages';

const AdminPage = () => {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = useCallback(() => {
    setRefreshKey(oldKey => oldKey + 1);
  }, []);

  const renderContent = () => {
    if (editingItem) {
      return <ContentForm item={editingItem} view={currentView} setEditingItem={setEditingItem} refreshData={refreshData} />;
    }

    if (currentView === 'dashboard') {
      return (
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome to the admin panel. Select a category from the sidebar to manage content.</p>
        </div>
      );
    }
    
    return <ContentTable view={currentView} setEditingItem={setEditingItem} refreshKey={refreshKey} refreshData={refreshData} />;
  };

  return (
    <AdminLayout currentView={currentView} setCurrentView={setCurrentView}>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminPage;