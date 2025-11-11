import React, { useState, useEffect, useMemo } from 'react';
import { Event } from './types';
import SectionTitle from './components/SectionTitle';
import { Card } from './components/Card';
import { CalendarIcon } from './components/icons';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Event[] = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Gagal memuat kegiatan.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllEvents();
  }, []);

  const eventsByMonth = useMemo(() => {
    const grouped: { [key: string]: Event[] } = {};
    const sortedEvents = [...events].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    sortedEvents.forEach(event => {
      const month = new Date(event.start_date).toLocaleString('id-ID', { month: 'long', year: 'numeric' });
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(event);
    });
    return grouped;
  }, [events]);

  if (loading) return <div className="container mx-auto px-6 py-16 text-center dark:text-white">Memuat kegiatan...</div>;
  if (error) return <div className="container mx-auto px-6 py-16 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-16">
      <SectionTitle
        icon={<CalendarIcon className="w-10 h-10" />}
        title="Kalender Kegiatan"
        subtitle="Semua kegiatan yang telah dan akan dilaksanakan selama satu tahun."
      />
      <div className="space-y-12">
        {Object.keys(eventsByMonth).map(month => (
          <div key={month}>
            <h2 className="text-2xl font-bold text-brand-charcoal dark:text-white mb-6 border-b-2 border-brand-blue dark:border-brand-yellow pb-2">
              {month}
            </h2>
            <div className="space-y-6">
              {eventsByMonth[month].map(event => {
                const eventDate = new Date(event.start_date);
                return (
                  <Card key={event.id} className="!bg-white dark:!bg-gray-800 p-6 flex flex-col md:flex-row items-start gap-6">
                    <div className="bg-brand-light-gray dark:bg-gray-700 text-brand-charcoal dark:text-white rounded-lg p-4 text-center w-full md:w-32 flex-shrink-0">
                      <span className="block font-bold text-4xl">{eventDate.getDate()}</span>
                      <span className="block text-lg">{eventDate.toLocaleString('id-ID', { month: 'short' }).toUpperCase()}</span>
                      <span className="block text-sm text-gray-500">{eventDate.getFullYear()}</span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold dark:text-white">{event.title}</h3>
                      <p className="text-md text-gray-600 dark:text-gray-400 mt-2">{event.description || 'Tidak ada deskripsi.'}</p>
                      <div className="mt-4 text-sm text-gray-500 dark:text-gray-300 space-y-1">
                        <p><strong>Waktu:</strong> {event.is_all_day ? 'Seharian Penuh' : `${event.start_time.slice(0, 5)} - ${event.end_time ? event.end_time.slice(0, 5) : 'Selesai'}`}</p>
                        <p><strong>Lokasi:</strong> {event.location || 'Akan diinformasikan'}</p>
                        {event.end_date && event.end_date !== event.start_date && (
                           <p><strong>Tanggal Selesai:</strong> {new Date(event.end_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
