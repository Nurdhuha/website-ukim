import React, { useState, useMemo, createContext, useContext, useEffect } from 'react';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { Article, Achievement, Event, GalleryItem } from './types';
import AdminPage from './AdminPage';
import EventsPage from './EventsPage'; // Import the new EventsPage component
import SectionTitle from './components/SectionTitle';
import { CalendarIcon, TrophyIcon, BookOpenIcon, CameraIcon, SearchIcon, MenuIcon, XIcon, SunIcon, MoonIcon, FlaskIcon, UsersIcon, BriefcaseIcon, LightbulbIcon } from './components/icons';

type Page = 'home' | 'repository' | 'gallery' | 'events' | 'admin';
type Theme = 'light' | 'dark';

// --- Theme Context and Provider ---

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


// --- Reusable Components ---

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
  <Card className="flex flex-col">
    <img className="h-48 w-full object-cover" src={article.imageUrl} alt={article.title} />
    <div className="p-6 flex flex-col flex-grow">
      <p className="text-sm text-brand-blue dark:text-brand-yellow font-semibold">{article.category.toUpperCase()}</p>
      <h3 className="mt-2 text-xl font-bold font-sans text-brand-charcoal dark:text-white">{article.title}</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400 font-serif flex-grow">{article.summary}</p>
      <div className="mt-4">
        <Button variant="secondary">Read More &rarr;</Button>
      </div>
    </div>
  </Card>
);

const AchievementCard: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
  <Card className="flex flex-col items-center text-center p-6">
    <img className="h-40 w-40 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-lg" src={achievement.imageUrl} alt={achievement.title} />
    <h3 className="mt-4 text-xl font-bold font-sans dark:text-white">{achievement.title}</h3>
    <p className="mt-2 text-gray-600 dark:text-gray-400 font-serif">{achievement.description}</p>
    <p className="mt-4 text-sm text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
  </Card>
);


// --- Page Sections ---

const HeroSection: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => (
  <div className="relative bg-brand-charcoal text-white">
    <div className="absolute inset-0">
      <img src="https://picsum.photos/seed/hero/1920/1080" alt="Organizational activities" className="w-full h-full object-cover opacity-30" />
    </div>
    <div className="relative container mx-auto px-6 py-32 md:py-48 text-center">
      <h1 className="text-4xl md:text-6xl font-bold font-sans tracking-tight">Aspirasi Menjadi Prestasi, Bertumbuh bersama UKIM UNESA</h1>
      <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto font-serif">
        Kami adalah kumpulan pemikir, pembangun, dan pemimpin yang berdedikasi untuk memajukan pengetahuan dan membuat dampak nyata.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="primary" onClick={() => setPage('events')}>Lihat Program Kami</Button>
        <Button variant="outline" className="text-white border-white hover:bg-white hover:text-brand-charcoal" onClick={() => setPage('repository')}>Baca Artikel Terbaru</Button>
      </div>
    </div>
  </div>
);

const KEY_AREAS = [
    {
        icon: <FlaskIcon className="w-8 h-8"/>,
        title: 'Aktivis',
        description: 'Merintis ide-ide baru dan mendorong batas-batas teknologi melalui proyek kolaboratif.'
    },
    {
        icon: <UsersIcon className="w-8 h-8"/>,
        title: 'Peneliti',
        description: 'Membangun jaringan rekan kerja yang dinamis melalui lokakarya, seminar, dan pertemuan sosial.'
    },
    {
        icon: <BriefcaseIcon className="w-8 h-8"/>,
        title: 'Penulis',
        description: 'Menghubungkan anggota dengan para pemimpin industri dan menyediakan sumber daya untuk pengembangan profesional.'
    },
    {
        icon: <LightbulbIcon className="w-8 h-8"/>,
        title: 'Wirausaha',
        description: 'Menciptakan platform untuk diskusi terbuka, bimbingan, dan pertukaran ide-ide inovatif.'
    }
]

const KeyAreasSection = () => (
    <section className="py-20 bg-brand-light-gray dark:bg-gray-900 transition-opacity duration-1000 ease-in-out transform transition-transform duration-1000 ease-in-out opacity-0 translate-y-4 animate-fade-in-up">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                 <h2 className="text-3xl font-bold font-sans text-brand-charcoal dark:text-white">Apa yang Kami Lakukan</h2>
                 <p className="mt-2 text-lg text-gray-600 dark:text-gray-400 font-serif">Pilar utama kami fokus pada pengembangan dan inovasi holistik.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {KEY_AREAS.map((area, index) => (
                    <Card key={index} className="text-center p-8 !bg-white dark:!bg-gray-800">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-blue-100 dark:bg-gray-700 text-brand-blue dark:text-brand-yellow">
                            {area.icon}
                        </div>
                        <h3 className="text-xl font-bold font-sans dark:text-white">{area.title}</h3>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 font-serif text-sm">{area.description}</p>
                    </Card>
                ))}
            </div>
        </div>
    </section>
);


const ArticlesSection = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        const contentTypes = ['akademik', 'pengumuman', 'artikel'];
        const promises = contentTypes.map(type =>
          fetch(`/api/content/${type}`).then(res => {
            if (!res.ok) {
              console.error(`HTTP error! status: ${res.status} for type ${type}`);
              return []; // Return empty array on error for this type
            }
            return res.json();
          })
        );
        const results = await Promise.all(promises);
        const allContent = results.flat();
        
        const formattedContent = allContent.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          imageUrl: item.body?.imageUrl || 'https://picsum.photos/seed/1/400/300', // Placeholder
          category: item.content_type_name, // This is from the backend
          date: item.published_at,
        }));

        // Sort by date descending
        formattedContent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setArticles(formattedContent);
      } catch (err) {
        setError('Gagal memuat konten.');
        console.error('Error fetching content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllContent();
  }, []);

  if (loading) return <section className="py-20 text-center dark:text-white">Memuat informasi...</section>;
  if (error) return <section className="py-20 text-center text-red-500">{error}</section>;

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <SectionTitle
          icon={<BookOpenIcon className="w-8 h-8" />}
          title="Informasi Terbaru"
          subtitle="Jelajahi pengumuman, publikasi, dan analisis terbaru kami."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.slice(0, 3).map(article => <ArticleCard key={article.id} article={article} />)}
        </div>
      </div>
    </section>
  );
};

const CalendarWidget = ({ events }: { events: Event[] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [hoveredDay, setHoveredDay] = useState<number | null>(null);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const eventsByDate = useMemo(() => {
        const map = new Map<string, Event[]>();
        events.forEach(event => {
            const dateStr = event.start_date.split('T')[0]; // Get YYYY-MM-DD part
            if (!map.has(dateStr)) {
                map.set(dateStr, []);
            }
            map.get(dateStr)?.push(event);
        });
        return map;
    }, [events]);

    const changeMonth = (offset: number) => {
        setCurrentDate(new Date(year, month + offset, 1));
    }

    const renderDays = () => {
        const days = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="border-r border-b border-gray-200 dark:border-gray-700"></div>);
        }
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayEvents = eventsByDate.get(dateStr) || [];
            const hasEvent = dayEvents.length > 0;

            let dayClasses = "relative flex items-center justify-center h-16 border-r border-b border-gray-200 dark:border-gray-700 text-sm cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-700";
            let dayNumberClasses = "w-8 h-8 flex items-center justify-center rounded-full"; // New inner element for styling
            if (isToday) dayNumberClasses += " bg-brand-blue text-white font-bold";
            if (hasEvent && !isToday) dayClasses += " font-semibold text-brand-blue dark:text-brand-yellow";

            days.push(
                <div 
                    key={day} 
                    className={dayClasses}
                    onMouseEnter={() => hasEvent && setHoveredDay(day)}
                    onMouseLeave={() => hasEvent && setHoveredDay(null)}
                >
                    <span className={dayNumberClasses}>{day}</span>
                    {hasEvent && <div className="absolute bottom-2 w-1.5 h-1.5 bg-brand-blue dark:bg-brand-yellow rounded-full"></div>}
                    {hoveredDay === day && hasEvent && (
                        <div className="absolute bottom-full mb-2 w-max max-w-xs bg-brand-charcoal text-white text-xs rounded-lg py-2 px-3 z-10 shadow-lg">
                            {dayEvents.map(event => (
                                <div key={event.id}>{event.title}</div>
                            ))}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-brand-charcoal"></div>
                        </div>
                    )}
                </div>
            );
        }
        return days;
    }

    return (
        <Card className="!bg-white dark:!bg-gray-800 p-6">
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Previous month">&lt;</button>
                <h3 className="font-bold text-lg dark:text-white">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Next month">&gt;</button>
            </div>
            <div className="grid grid-cols-7 text-center font-semibold text-xs text-gray-500">
                {daysOfWeek.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7">
                {renderDays()}
            </div>
        </Card>
    );
};


const EventsAndAchievementsSection = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingAchievements, setLoadingAchievements] = useState(true);
  const [errorEvents, setErrorEvents] = useState<string | null>(null);
  const [errorAchievements, setErrorAchievements] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Event[] = await response.json();
        console.log('Fetched events:', data); // Debug log
        setEvents(data);
      } catch (err) {
        setErrorEvents('Gagal memuat kegiatan mendatang.');
        console.error('Error fetching events:', err);
      } finally {
        setLoadingEvents(false);
      }
    };

    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/content/achievement');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data: Achievement[] = await response.json();
        setAchievements(data);
      } catch (err) {
        setErrorAchievements('Gagal memuat prestasi.');
        console.error('Error fetching achievements:', err);
      } finally {
        setLoadingAchievements(false);
      }
    };

    fetchEvents();
    fetchAchievements();
  }, []);

  const upcomingEvents = useMemo(() => {
    if (!events) return [];
    return events
      .map(event => ({
        ...event,
        fullStartDate: new Date(event.start_date)
      }))
      .filter(event => event.fullStartDate >= new Date())
      .sort((a, b) => a.fullStartDate.getTime() - b.fullStartDate.getTime())
      .slice(0, 3);
  }, [events]);

  const currentYear = new Date().getFullYear();
  const achievementsCurrentYear = achievements.filter(
    (ach) => new Date(ach.date).getFullYear() === currentYear
  ).length;
  const achievementsPreviousYear = achievements.filter(
    (ach) => new Date(ach.date).getFullYear() === currentYear - 1
  ).length;

  return (
    <section className="py-20 bg-brand-light-gray dark:bg-gray-900">
      <div className="container mx-auto px-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <SectionTitle
              icon={<CalendarIcon className="w-8 h-8" />}
              title="Kegiatan Mendatang"
              subtitle="Ikuti kuliah, lokakarya, atau pertemuan kami berikutnya."
            />
            {loadingEvents ? (
              <div className="text-center dark:text-white">Memuat kegiatan...</div>
            ) : errorEvents ? (
              <div className="text-center text-red-500">{errorEvents}</div>
            ) : (
              <div className="space-y-4 max-w-lg mx-auto">
                {upcomingEvents.length === 0 ? (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-8">Tidak ada kegiatan mendatang.</div>
                ) : (
                  <>
                    {upcomingEvents.map(event => (
                      <Card key={event.id} className="!bg-white dark:!bg-gray-800 p-4 flex items-start">
                        <div className="bg-brand-blue text-white rounded-lg p-3 text-center w-20 flex-shrink-0">
                          <span className="block font-bold text-2xl">{event.fullStartDate.getDate()}</span>
                          <span className="block text-xs">
                            {event.fullStartDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4 flex-grow">
                          <h4 className="font-bold dark:text-white">{event.title}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">📍 {event.location || 'TBA'}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {event.is_all_day
                              ? 'Seharian Penuh'
                              : event.start_time
                                ? `${event.fullStartDate.toLocaleDateString(undefined, { weekday: 'long' })} pukul ${event.start_time.slice(0, 5)}`
                                : 'Waktu akan diumumkan'}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </>
                )}
                <CalendarWidget events={events} />
              </div>
            )}
          </div>
          <div>
            <SectionTitle
              icon={<TrophyIcon className="w-8 h-8" />}
              title="Prestasi Kita"
              subtitle="Merayakan pencapaian dan kesuksesan anggota kami."
            />
            {loadingAchievements ? (
              <div className="text-center dark:text-white">Memuat prestasi...</div>
            ) : errorAchievements ? (
              <div className="text-center text-red-500">{errorAchievements}</div>
            ) : (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-semibold text-lg text-brand-charcoal dark:text-white">
                        Prestasi Tahun Ini ({currentYear})
                      </h4>
                      <span className="text-3xl font-bold text-brand-blue dark:text-brand-yellow">
                        {achievementsCurrentYear}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-semibold text-lg text-brand-charcoal dark:text-white">
                        Prestasi Tahun Lalu ({currentYear - 1})
                      </h4>
                      <span className="text-3xl font-bold text-brand-blue dark:text-brand-yellow">
                        {achievementsPreviousYear}
                      </span>
                    </div>
                    <div className="mt-6 text-center">
                      <Button variant="primary" onClick={() => alert('Navigasi ke halaman detail prestasi')}>
                        Lihat Detail Prestasi &rarr;
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  {achievements.slice(0, 1).map(achievement => <AchievementCard key={achievement.id} achievement={achievement} />)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// --- Full Pages ---

const HomePage: React.FC<{ setPage: (page: Page) => void }> = ({ setPage }) => (
  <>
    <HeroSection setPage={setPage} />
    <KeyAreasSection />
    <ArticlesSection />
    <EventsAndAchievementsSection />
  </>
);

const RepositoryPage = () => {
  const [allArticles, setAllArticles] = useState<Article[]>([]); // Store all fetched articles
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  useEffect(() => {
    const fetchAllContent = async () => {
      try {
        const contentTypes = ['akademik', 'pengumuman', 'artikel'];
        const promises = contentTypes.map(type =>
          fetch(`/api/content/${type}`).then(res => {
            if (!res.ok) {
              console.error(`HTTP error! status: ${res.status} for type ${type}`);
              return []; // Return empty array on error for this type
            }
            return res.json();
          })
        );
        const results = await Promise.all(promises);
        const allContent = results.flat();
        
        const formattedContent = allContent.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          imageUrl: item.body?.imageUrl || 'https://picsum.photos/seed/1/400/300', // Placeholder
          category: item.content_type_name, // This is from the backend
          date: item.published_at,
        }));

        setAllArticles(formattedContent);
      } catch (err) {
        setError('Gagal memuat konten untuk repositori.');
        console.error('Error fetching repository content:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllContent();
  }, []);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(allArticles.map(a => a.category)));
    return ['Semua', ...uniqueCategories];
  }, [allArticles]);

  const filteredArticles = useMemo(() => {
    return allArticles.filter(article => {
      const matchesCategory = selectedCategory === 'Semua' || article.category === selectedCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || article.summary.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allArticles, searchTerm, selectedCategory]);

  if (loading) return <div className="container mx-auto px-6 py-16 text-center dark:text-white">Memuat repositori...</div>;
  if (error) return <div className="container mx-auto px-6 py-16 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-16">
      <SectionTitle
        icon={<BookOpenIcon className="w-10 h-10" />}
        title="Materi & Artikel"
        subtitle="Database komprehensif dari basis pengetahuan organisasi kami."
      />
      <div className="mb-12 p-6 bg-brand-light-gray dark:bg-gray-800 rounded-xl">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 relative">
            <input
              type="text"
              placeholder="Cari artikel..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"/>
          </div>
          <div>
            <select
              aria-label="Filter artikel berdasarkan kategori"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.length > 0 ? (
          filteredArticles.map(article => <ArticleCard key={article.id} article={article} />)
        ) : (
          <p className="lg:col-span-3 text-center text-gray-500">Tidak ada artikel yang cocok dengan kriteria Anda.</p>
        )}
      </div>
    </div>
  );
};

const GalleryPage = () => {
    const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedDepartment, setSelectedDepartment] = useState('Semua');
    const [selectedYear, setSelectedYear] = useState('Semua');
  
    useEffect(() => {
      const fetchGalleryItems = async () => {
        try {
          const response = await fetch('/api/content/gallery');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data: GalleryItem[] = await response.json();
          setAllGalleryItems(data);
        } catch (err) {
          setError('Gagal memuat item galeri.');
          console.error('Error fetching gallery items:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchGalleryItems();
    }, []);

    const departments = useMemo(() => {
      const uniqueDepartments = Array.from(new Set(allGalleryItems.map(item => item.department)));
      return ['Semua', ...uniqueDepartments];
    }, [allGalleryItems]);

    const years = useMemo(() => {
      const uniqueYears = Array.from(new Set(allGalleryItems.map(item => item.year))).sort((a, b) => b - a).map(String);
      return ['Semua', ...uniqueYears];
    }, [allGalleryItems]);

    const filteredItems = useMemo(() => {
      return allGalleryItems.filter(item => {
        const matchesDepartment = selectedDepartment === 'Semua' || item.department === selectedDepartment;
        const matchesYear = selectedYear === 'Semua' || String(item.year) === selectedYear;
        return matchesDepartment && matchesYear;
      });
    }, [allGalleryItems, selectedDepartment, selectedYear]);

  if (loading) return <div className="container mx-auto px-6 py-16 text-center dark:text-white">Memuat galeri...</div>;
  if (error) return <div className="container mx-auto px-6 py-16 text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-6 py-16">
      <SectionTitle
        icon={<CameraIcon className="w-10 h-10" />}
        title="Dokumentasi Kegiatan"
        subtitle="Perjalanan visual melalui acara, proyek, dan pencapaian kami."
      />
      <div className="mb-12 max-w-md mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter berdasarkan Departemen:</label>
          <select
            id="department-filter"
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {departments.map(department => <option key={department} value={department}>{department}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter berdasarkan Tahun:</label>
          <select
            id="year-filter"
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <Card key={item.id}>
              <img src={item.imageUrl} alt={item.title} className="aspect-[3/2] w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.department} - {item.year}</p>
              </div>
            </Card>
          ))
        ) : (
          <p className="lg:col-span-3 text-center text-gray-500">Tidak ada item galeri yang cocok dengan kriteria Anda.</p>
        )}
      </div>
    </div>
  );
};


// --- App Layout Components ---

const Header: React.FC<{ currentPage: Page; setPage: (page: Page) => void }> = ({ currentPage, setPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const navItems: { page: Page; label: string }[] = [
    { page: 'home', label: 'Beranda' },
    { page: 'repository', label: 'Repositori' },
    { page: 'gallery', label: 'Galeri' },
    { page: 'events', label: 'Kegiatan' },
  ];
  
  const NavLink: React.FC<{ page: Page, label: string }> = ({ page, label }) => (
     <a 
        href="#" 
        onClick={(e) => { e.preventDefault(); setPage(page); setIsMenuOpen(false); }}
        className={`pb-1 border-b-2 transition-colors duration-300 ${currentPage === page ? 'border-brand-blue dark:border-brand-yellow text-brand-blue dark:text-brand-yellow' : 'border-transparent text-gray-600 hover:text-brand-blue dark:text-gray-300 dark:hover:text-brand-yellow'}`}
      >
        {label}
      </a>
  );

  return (
    <>
      <header className="bg-white/80 dark:bg-brand-charcoal/80 backdrop-blur-md sticky top-0 z-50 shadow-sm dark:shadow-none dark:border-b dark:border-gray-800">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <a href="#" onClick={(e) => { e.preventDefault(); setPage('home'); }} className="text-2xl font-bold text-brand-blue dark:text-white">
            UKIM<span className="text-brand-charcoal dark:text-gray-400">Unesa</span>
          </a>
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <NavLink key={item.page} {...item} />
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  {theme === 'light' ? <MoonIcon className="w-5 h-5 text-gray-600"/> : <SunIcon className="w-5 h-5 text-yellow-400"/>}
              </button>
              <Button variant="primary">Gabung</Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                  {isMenuOpen ? <XIcon className="w-6 h-6 dark:text-white" /> : <MenuIcon className="w-6 h-6 dark:text-white" />}
              </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Panel */}
      <div className={`fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMenuOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-full max-w-72 bg-white dark:bg-brand-charcoal shadow-xl z-50 transform transition-transform md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6">
            <div className="flex justify-between items-center mb-8">
                <h2 className="font-bold text-lg dark:text-white">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                    <XIcon className="w-6 h-6 dark:text-white" />
                </button>
            </div>
            <ul className="space-y-6">
                {navItems.map(item => (
                    <li key={item.page}><NavLink {...item}/></li>
                ))}
            </ul>
             <div className="mt-8 border-t dark:border-gray-700 pt-6 flex flex-col gap-4">
                 <button onClick={toggleTheme} className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <span className="dark:text-white">Ganti Tema</span>
                    {theme === 'light' ? <MoonIcon className="w-5 h-5 text-gray-600"/> : <SunIcon className="w-5 h-5 text-yellow-400"/>}
                </button>
                <Button variant="primary" className="w-full">Gabung</Button>
            </div>
        </div>
      </div>
    </>
  );
};

const Footer = () => (
  <footer className="bg-brand-charcoal text-white">
    <div className="container mx-auto px-6 py-12">
      <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
        <div>
          <h3 className="text-xl font-bold">UKIM Unesa</h3>
          <p className="mt-2 text-gray-400">Aspirasi Menjadi Prestasi, Bertumbuh bersama UKIM UNESA.</p>
        </div>
        <div>
          <h4 className="font-semibold">Tautan Cepat</h4>
          <ul className="mt-2 space-y-1 text-gray-400">
            <li><a href="#" className="hover:text-brand-yellow transition-colors">Tentang Kami</a></li>
            <li><a href="#" className="hover:text-brand-yellow transition-colors">Kontak</a></li>
            <li><a href="#" className="hover:text-brand-yellow transition-colors">Kebijakan Privasi</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold">Ikuti Kami</h4>
          <div className="mt-2 flex justify-center md:justify-start space-x-4">
            <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-brand-yellow transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} UKIM Unesa. Hak Cipta Dilindungi.
      </div>
    </div>
  </footer>
);

const AppBody: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentPage('admin');
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage setPage={setCurrentPage} />;
      case 'repository':
        return <RepositoryPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'events':
        return <EventsPage />;
      case 'admin':
        return <AdminPage />;
      default:
        return <HomePage setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="font-serif bg-white dark:bg-brand-charcoal text-brand-charcoal dark:text-gray-300 transition-colors duration-300 overflow-x-hidden">
      {currentPage !== 'admin' && <Header currentPage={currentPage} setPage={setCurrentPage} />}
      <main>
        {renderPage()}
      </main>
      {currentPage !== 'admin' && <Footer />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppBody />
    </ThemeProvider>
  );
}

export default App;
