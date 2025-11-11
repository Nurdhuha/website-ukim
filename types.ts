
export interface Article {
  id: number;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  date: string;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  is_all_day: boolean;
  created_by: number;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  imageUrl: string;
  department: string;
  year: number;
}
