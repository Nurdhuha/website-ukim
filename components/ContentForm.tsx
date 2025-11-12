import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';

interface ContentFormProps {
  item: any;
  view: 'akademik' | 'achievements' | 'gallery' | 'events' | 'pages' | 'pengumuman' | 'artikel' | 'prestasi';
  setEditingItem: (item: any | null) => void;
  refreshData: () => void;
}

const ContentForm: React.FC<ContentFormProps> = ({ item, view, setEditingItem, refreshData, category }) => {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedContentFile, setSelectedContentFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const isEditMode = item && item.id;

  useEffect(() => {
    if (item) {
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
  }, [item, view, isEditMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleContentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedContentFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = formData.body?.imageUrl || '';
      let contentFileUrl = formData.body?.contentFileUrl || '';

      if (selectedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedFile);

        const uploadResponse = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image.');
        }

        const uploadResult = await uploadResponse.json();
        imageUrl = uploadResult.filePath;
      }
      
      if (selectedContentFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', selectedContentFile);

        const uploadResponse = await fetch('http://localhost:5000/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload content file.');
        }

        const uploadResult = await uploadResponse.json();
        contentFileUrl = uploadResult.filePath;
      }

      const isEvent = view === 'events';
      let url = isEvent ? '/api/events' : 'http://localhost:5000/api/content';
      if (isEditMode) {
        url = `${url}/${item.id}`;
      }

      const dataToSend = { ...formData };
      if (!isEvent) {
        dataToSend.type = view;
        dataToSend.body = { ...dataToSend.body, imageUrl, contentFileUrl };
      }

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
      setEditingItem(null);

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

      case 'pengumuman':
        return (
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Image (max 2MB)</label>
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
      case 'akademik':
        return (
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">File Akademik (PDF, max 10MB)</label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleContentFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            />
            {formData.body?.contentFileUrl && <p className="text-xs mt-1">Current file: <a href={`http://localhost:5000${formData.body.contentFileUrl}`} target="_blank" rel="noopener noreferrer" className="text-brand-blue">{formData.body.contentFileUrl}</a></p>}
          </div>
        );
      case 'artikel':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Image (max 2MB)</label>
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
            <div className="mb-4">
              <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Isi Artikel</label>
              <textarea
                name="body.content"
                value={formData.body?.content || ''}
                onChange={(e) => setFormData({ ...formData, body: { ...formData.body, content: e.target.value } })}
                rows={10}
                className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
              />
            </div>
          </>
        );
      case 'achievements':
      case 'gallery':
      case 'prestasi':
      case 'galeri':
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
                {/* Event fields... */}
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