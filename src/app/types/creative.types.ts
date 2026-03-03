// khalid/src/types/creative.types.ts

export interface CreativeActivity {
  id?: number;
  title: string;
  description: string;
  participants: string;
  status: string; // চলমান, আসন্ন, সমাপ্ত, বার্ষিক
  icon: string;
  activity_type: string;
  image_url?: string | null;
  image_path?: string | null;
  event_date?: string | null;
  location?: string | null;
  sort_order?: number;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface CreativeEvent {
  id?: number;
  title: string;
  description: string;
  event_date: string;
  event_type: string;
  icon: string;
  image_url?: string | null;
  image_path?: string | null;
  location?: string | null;
  registration_link?: string | null;
  is_featured?: boolean;
  sort_order?: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export const ACTIVITY_TYPES = [
  { value: 'art', label: 'চিত্রাঙ্কন', icon: '🎨' },
  { value: 'cultural', label: 'সাংস্কৃতিক', icon: '🎭' },
  { value: 'music', label: 'সংগীত', icon: '🎵' },
  { value: 'poetry', label: 'কবিতা', icon: '📝' },
  { value: 'drama', label: 'নাট্য', icon: '🎪' },
  { value: 'craft', label: 'হস্তশিল্প', icon: '🏺' },
  { value: 'others', label: 'অন্যান্য', icon: '✨' }
];

export const ACTIVITY_STATUSES = [
  { value: 'চলমান', label: 'চলমান', color: 'green' },
  { value: 'আসন্ন', label: 'আসন্ন', color: 'blue' },
  { value: 'সমাপ্ত', label: 'সমাপ্ত', color: 'gray' },
  { value: 'বার্ষিক', label: 'বার্ষিক', color: 'purple' }
];

export const EVENT_STATUSES = [
  { value: 'upcoming', label: 'আসন্ন', color: 'blue' },
  { value: 'ongoing', label: 'চলমান', color: 'green' },
  { value: 'completed', label: 'সমাপ্ত', color: 'gray' },
  { value: 'cancelled', label: 'বাতিল', color: 'red' }
];

export const EVENT_TYPES = [
  { value: 'cultural_night', label: 'সাংস্কৃতিক সন্ধ্যা', icon: '🎭' },
  { value: 'award_ceremony', label: 'সম্মাননা অনুষ্ঠান', icon: '🏆' },
  { value: 'book_fair', label: 'বইমেলা', icon: '📚' },
  { value: 'dance_performance', label: 'নৃত্যানুষ্ঠান', icon: '💃' },
  { value: 'workshop', label: 'কর্মশালা', icon: '🔨' },
  { value: 'exhibition', label: 'প্রদর্শনী', icon: '🖼️' },
  { value: 'competition', label: 'প্রতিযোগিতা', icon: '🏅' },
  { value: 'others', label: 'অন্যান্য', icon: '✨' }
];