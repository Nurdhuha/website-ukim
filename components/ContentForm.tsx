import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';

interface ContentFormProps {
  item: any;
  view: 'news' | 'achievements' | 'gallery' | 'events' | 'pages';
  setEditingItem: (item: any | null) => void;
  refreshData: () => void;
}

const ContentForm: React.FC<ContentFormProps> = ({ item, view, setEditingItem, refreshData }) => {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const isEditMode = item && item.id;

  useEffect(() => {
    // When the item to edit changes, reset the form data
    // For new items, parse the body if it's a string; otherwise, use the object
    if (item) {
        // Create a mutable copy to avoid direct prop mutation
        const newItem = { ...item };

        if (newItem.body && typeof newItem.body === 'string') {
            try {
                newItem.body = JSON.parse(newItem.body);
            } catch (e) {
                console.error("Failed to parse body JSON", e);
                newItem.body = {};
            }
        }
        setFormData(newItem);
        if (newItem.body?.imageUrl) {
          setPreview(`http://localhost:5000${newItem.body.imageUrl}`);
        }
    }
  }, [item]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      body: {
        ...formData.body,
        [name]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = formData.body?.imageUrl || '';

      // 1. If a new file is selected, upload it first
      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('image', selectedFile);

        const uploadResponse = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image.');
        }

        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.filePath; // Get the path from the backend
      }

      // 2. Prepare the data for the final submission
      const isEvent = view === 'events';
      let url = isEvent ? '/api/events' : 'http://localhost:5000/api/content';
      if (isEditMode) {
        url = `${url}/${item.id}`;
      }

      const dataToSend = { ...formData };
      if (!isEvent) {
        dataToSend.type = view;
        // Make sure body exists and update imageUrl
        dataToSend.body = { ...dataToSend.body, imageUrl };
      }

      // 3. Submit the form data (with the new image URL if applicable)
      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'Failed to save item.');
      }
      
      refreshData();
      setEditingItem(null); // Close form on success

    } catch (err: any) {
      setError(err.message);
      console.error('Failed to save item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCommonFields = () => (
    <>
      <div className="mb-4">
        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title || ''}
          onChange={handleInputChange}
          className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
          required
        />
      </div>
      {view !== 'events' && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug || ''}
              onChange={handleInputChange}
              className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Summary</label>
            <textarea
              name="summary"
              value={formData.summary || ''}
              onChange={handleInputChange}
              className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
            />
          </div>
           <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Status</label>
            <select
                name="status"
                value={formData.status || 'draft'}
                onChange={handleInputChange}
                className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
            >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
            </select>
          </div>
        </>
      )}
    </>
  );

  const renderDynamicFields = () => {
    switch (view) {
      case 'news':
      case 'achievements':
      case 'gallery':
        return (
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            {preview && (
              <div className="mt-4">
                <img src={preview} alt="Image Preview" className="w-48 h-auto rounded-lg shadow-md" />
                <p className="text-xs text-gray-500 mt-1">Image Preview</p>
              </div>
            )}
          </div>
        );
      case 'events':
        return (
            <>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Description</label>
                    <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
                    placeholder="Enter event description"
                    title="Event description"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Location</label>
                    <input
                        type="text"
                        name="location"
                        aria-label="Event location"
                        title="Event location"
                        placeholder="Enter event location"
                        value={formData.location || ''}
                        onChange={handleInputChange}
                        className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">
                        <input
                            type="checkbox"
                            name="is_all_day"
                            checked={formData.is_all_day || false}
                            onChange={(e) => setFormData({ ...formData, is_all_day: e.target.checked })}
                            className="w-4 h-4 text-brand-blue bg-gray-100 border-gray-300 rounded focus:ring-brand-blue dark:focus:ring-brand-blue dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">All Day Event</span>
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Start Date</label>
                        <input type="date" name="start_date" aria-label="Event start date" title="Event start date" placeholder="YYYY-MM-DD" value={formData.start_date || ''} onChange={handleInputChange} className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue" required />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">End Date</label>
                        <input type="date" name="end_date" aria-label="Event end date" title="Event end date" placeholder="YYYY-MM-DD" value={formData.end_date || ''} onChange={handleInputChange} className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue" />
                    </div>
                </div>
                {!formData.is_all_day && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Start Time</label>
                            <input type="time" name="start_time" aria-label="Event start time" title="Event start time" placeholder="HH:MM" value={formData.start_time || ''} onChange={handleInputChange} className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">End Time</label>
                            <input type="time" name="end_time" aria-label="Event end time" title="Event end time" placeholder="HH:MM" value={formData.end_time || ''} onChange={handleInputChange} className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue" />
                        </div>
                    </div>
                )}
            </>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="!bg-white dark:!bg-gray-800">
      <form onSubmit={handleSubmit} className="p-6">
        {renderCommonFields()}
        {renderDynamicFields()}
        
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="secondary" onClick={() => setEditingItem(null)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ContentForm;