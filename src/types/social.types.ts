// khalid/src/types/social.types.ts

export interface SocialActivity {
  id?: number;
  title: string;
  description: string;
  beneficiaries: string;
  icon: string;
  activity_type: string;
  status: 'active' | 'inactive';
  image_url?: string | null;
  image_path?: string | null;
  event_date?: string | null;
  location?: string | null;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

export interface SocialStatistic {
  id?: number;
  label: string;
  number: string;
  icon: string;
  sort_order?: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

export const ACTIVITY_TYPES = [
  { value: 'medical', label: 'চিকিৎসা সেবা', icon: '🏥' },
  { value: 'education', label: 'শিক্ষা বৃত্তি', icon: '📚' },
  { value: 'winter', label: 'শীতবস্ত্র বিতরণ', icon: '🧥' },
  { value: 'eid', label: 'ঈদ উপহার', icon: '🎁' },
  { value: 'blood', label: 'রক্তদান কর্মসূচি', icon: '🩸' },
  { value: 'elderly', label: 'বয়স্ক ভাতা', icon: '👴' },
  { value: 'others', label: 'অন্যান্য', icon: '🤝' }
];

export const STATUS_OPTIONS = [
  { value: 'active', label: 'সক্রিয়', color: 'green' },
  { value: 'inactive', label: 'নিষ্ক্রিয়', color: 'red' }
];