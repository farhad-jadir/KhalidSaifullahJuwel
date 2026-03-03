// types/political.types.ts
export interface PoliticalActivity {
  id?: number;
  title: string;
  description: string;
  date: string;
  activity_type: string;
  status: 'active' | 'inactive' | 'completed';
  image_url?: string | null;
  image_path?: string | null;
  event_date?: string | null;
  location?: string | null;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  sort_order?: number;
}

export const ACTIVITY_TYPES = [
  { value: 'public_meeting', label: 'জনসভা ও সমাবেশ', icon: '🎤' },
  { value: 'party_meeting', label: 'দলীয় সভা', icon: '👥' },
  { value: 'human_chain', label: 'মানববন্ধন', icon: '🤝' },
  { value: 'procession', label: 'শোভাযাত্রা', icon: '🚩' },
  { value: 'advisory_meeting', label: 'উপদেষ্টা সভা', icon: '📋' },
  { value: 'grassroots_visit', label: 'তৃণমূল সফর', icon: '🌾' },
  { value: 'others', label: 'অন্যান্য', icon: '📌' }
];

export const ACTIVITY_STATUS = [
  { value: 'active', label: 'চলমান', color: 'green' },
  { value: 'inactive', label: 'স্থগিত', color: 'red' },
  { value: 'completed', label: 'সম্পন্ন', color: 'blue' }
];