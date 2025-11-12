import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Card } from './Card';

interface ContentFormProps {
  item: any;
  view: 'akademik' | 'achievements' | 'gallery' | 'events' | 'pages' | 'pengumuman' | 'artikel' | 'prestasi';
  setEditingItem: (item: any | null) => void;
  refreshData: () => void;
}

const ContentForm: React.FC<ContentFormProps> = ({ item, view, setEditingItem, refreshData }) => {
  const [formData, setFormData] = useState<any>({
    title: '',
    status: 'draft',
    department: '',
    activityDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedContentFile, setSelectedContentFile] = useState<File | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

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
        
        if (view === 'events') {
            const startDate = newItem.start_date ? new Date(newItem.start_date).toISOString().split('T')[0] : '';
            const endDate = newItem.end_date ? new Date(newItem.end_date).toISOString().split('T')[0] : '';
            setFormData({
                ...newItem,
                start_date: startDate,
                end_date: endDate,
            });
        } else {
            const activityDate = newItem.activityDate ? new Date(newItem.activityDate).toISOString().split('T')[0] : '';
            setFormData({
                ...newItem,
                department: newItem.summary, // Map summary to department
                activityDate: activityDate,
            });
        }

        if (view === 'gallery' && newItem.body?.imageUrls) {
            setPreviews(newItem.body.imageUrls.map((url: string) => `http://localhost:5000${url}`));
        } else if (newItem.body?.imageUrl) {
            setPreviews([`http://localhost:5000${newItem.body.imageUrl}`]);
        }
    }
  }, [item, view]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).slice(0, 3); // Max 3 files
      setSelectedFiles(fileArray);
      
      const filePreviews = fileArray.map(file => URL.createObjectURL(file));
      setPreviews(filePreviews);
    }
  };

  const handleContentFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedContentFile(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    // @ts-ignore
    const checked = e.target.checked;

    setFormData({ 
        ...formData, 
        [name]: isCheckbox ? checked : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let imageUrl = formData.body?.imageUrl || '';
      let imageUrls: string[] = formData.body?.imageUrls || [];
      let contentFileUrl = formData.body?.contentFileUrl || '';

      if (selectedFiles.length > 0) {
        const uploadPromises = selectedFiles.map(file => {
            const uploadFormData = new FormData();
            uploadFormData.append('file', file);
            return fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: uploadFormData,
            }).then(res => {
                if (!res.ok) throw new Error('Failed to upload an image.');
                return res.json();
            });
        });

        const uploadResults = await Promise.all(uploadPromises);
        
        if (view === 'gallery') {
            imageUrls = uploadResults.map(result => result.filePath);
        } else {
            imageUrl = uploadResults[0]?.filePath || imageUrl;
        }
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
      const isGallery = view === 'gallery';
      
      let url;
      if (isEvent) {
        url = '/api/events';
      } else if (isGallery) {
        url = 'http://localhost:5000/api/gallery';
      } else {
        url = 'http://localhost:5000/api/content';
      }

      if (isEditMode) {
        url = `${url}/${item.id}`;
      }

      let dataToSend: any;
      if (isGallery) {
        dataToSend = {
          title: formData.title,
          status: formData.status,
          department: formData.department,
          activityDate: formData.activityDate,
          body: { imageUrls },
        }
      } else if (!isEvent) {
        dataToSend = { ...formData };
        dataToSend.type = view;
        dataToSend.body = { ...dataToSend.body, imageUrl, contentFileUrl };
      } else {
        dataToSend = { ...formData };
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
      {view !== 'events' && view !== 'gallery' && (
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
        </>
      )}
      {view !== 'events' && (
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
      )}
    </>
  );

  const renderDynamicFields = () => {
    switch (view) {
      case 'gallery':
        return (
            <>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Department</label>
                    <input
                        type="text"
                        name="department"
                        value={formData.department || ''}
                        onChange={handleInputChange}
                        className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Activity Date</label>
                    <input
                        type="date"
                        name="activityDate"
                        value={formData.activityDate || ''}
                        onChange={handleInputChange}
                        className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Images (up to 3, max 2MB each)</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    />
                    <div className="mt-4 flex flex-wrap gap-4">
                        {previews.map((previewUrl, index) => (
                            <div key={index} className="relative">
                                <img src={previewUrl} alt={`Preview ${index + 1}`} className="w-32 h-32 object-cover rounded-lg shadow-md" />
                            </div>
                        ))}
                    </div>
                </div>
            </>
        );
      // ... other cases
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
            {previews[0] && (
              <div className="mt-4">
                <img src={previews[0]} alt="Image Preview" className="w-48 h-auto rounded-lg shadow-md" />
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
              {previews[0] && (
                <div className="mt-4">
                  <img src={previews[0]} alt="Image Preview" className="w-48 h-auto rounded-lg shadow-md" />
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
            {previews[0] && (
              <div className="mt-4">
                <img src={previews[0]} alt="Image Preview" className="w-48 h-auto rounded-lg shadow-md" />
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
                        rows={4}
                        className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Location</label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location || ''}
                        onChange={handleInputChange}
                        className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Start Date</label>
                        <input
                            type="date"
                            name="start_date"
                            value={formData.start_date || ''}
                            onChange={handleInputChange}
                            className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">End Date</label>
                        <input
                            type="date"
                            name="end_date"
                            value={formData.end_date || ''}
                            onChange={handleInputChange}
                            className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
                        />
                    </div>
                </div>
                <div className="flex items-center mb-4">
                    <input
                        id="is_all_day"
                        type="checkbox"
                        name="is_all_day"
                        checked={formData.is_all_day || false}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-brand-blue bg-gray-100 border-gray-300 rounded focus:ring-brand-blue dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="is_all_day" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">All-day event</label>
                </div>
                {!formData.is_all_day && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Start Time</label>
                            <input
                                type="time"
                                name="start_time"
                                value={formData.start_time || ''}
                                onChange={handleInputChange}
                                className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">End Time</label>
                            <input
                                type="time"
                                name="end_time"
                                value={formData.end_time || ''}
                                onChange={handleInputChange}
                                className="bg-gray-50 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-brand-blue dark:focus:border-brand-blue"
                            />
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
