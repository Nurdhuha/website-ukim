import React, { useEffect, useState } from 'react';
import { Button } from './Button';
import { Card } from './Card';
import ConfirmationModal from './ConfirmationModal';

interface ContentTableProps {
  view: 'akademik' | 'pengumuman' | 'artikel' | 'prestasi' | 'galeri' | 'events' | 'pages';
  setEditingItem: (item: any) => void;
  refreshKey: number;
  refreshData: () => void;
}

const ContentTable: React.FC<ContentTableProps> = ({ view, setEditingItem, refreshKey, refreshData }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      let url = '';
      if (view === 'events') {
        url = '/api/events';
      } else {
        url = `/api/content/admin/all?type=${view}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${view}. Status: ${response.status}`);
        }
        const data = await response.json();
        setItems(data);
      } catch (err: any) {
        setError(err.message);
        console.error(`Error fetching ${view}:`, err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view, refreshKey]);

  const openConfirmationModal = (id: number) => {
    setItemToDelete(id);
    setIsModalOpen(true);
  };

  const closeConfirmationModal = () => {
    setItemToDelete(null);
    setIsModalOpen(false);
  };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;

    let url = view === 'events' ? `/api/events/${itemToDelete}` : `/api/content/${itemToDelete}`;

    try {
      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete item.');
      }
      refreshData(); // Refresh list after deletion
    } catch (err: any) {
      console.error('Error deleting item:', err);
      alert(`Error: ${err.message}`);
    } finally {
      closeConfirmationModal();
    }
  };

  if (loading) return <div className="text-center dark:text-white">Loading content...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <>
      <Card className="!bg-white dark:!bg-gray-800">
        <div className="flex justify-end items-center mb-6">
          <Button 
            variant="primary" 
            onClick={() => setEditingItem({})}
          >
            Create New {view.charAt(0).toUpperCase() + view.slice(1)}
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Title</th>
                {view === 'events' ? (
                  <>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Start Date</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Location</th>
                    <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">All Day</th>
                  </>
                ) : (
                  <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Status</th>
                )}
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Last Updated</th>
                <th className="p-4 font-semibold text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map(item => (
                <tr key={item.id}>
                  <td className="p-4 text-gray-800 dark:text-gray-200">{item.title}</td>
                  {view === 'events' ? (
                    <>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{item.start_date}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{item.location || 'N/A'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          item.is_all_day 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {item.is_all_day ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </>
                  ) : (
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'published' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {item.status || 'N/A'}
                      </span>
                    </td>
                  )}
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {new Date(item.updated_at || item.created_at || item.start_date).toLocaleDateString()}
                  </td>
                  <td className="p-4 space-x-2">
                    <Button variant="secondary" size="sm" onClick={() => setEditingItem(item)}>Edit</Button>
                    <Button variant="danger" size="sm" onClick={() => openConfirmationModal(item.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No {view} found.
            </div>
          )}
        </div>
      </Card>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeConfirmationModal}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
      >
        Are you sure you want to delete this item? This action cannot be undone.
      </ConfirmationModal>
    </>
  );
};

export default ContentTable;