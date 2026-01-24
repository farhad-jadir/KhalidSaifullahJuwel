export interface PoliticalCategory {
  id: string;
  category_name_bn: string;
  category_name_en: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PoliticalActivity {
  id: string;
  category_id: string;
  title_bn: string;
  title_en: string;
  description_bn: string;
  description_en: string;
  frequency_bn?: string;
  frequency_en?: string;
  impact_bn?: string;
  impact_en?: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: PoliticalCategory;
}

export interface CurrentProject {
  id: string;
  title_bn: string;
  title_en: string;
  description_bn: string;
  description_en: string;
  progress: number;
  timeline_bn?: string;
  timeline_en?: string;
  budget_bn?: string;
  budget_en?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PoliticalPrinciple {
  id: string;
  principle_bn: string;
  principle_en: string;
  description_bn: string;
  description_en: string;
  icon?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PoliticalAchievement {
  id: string;
  achievement_bn: string;
  achievement_en: string;
  count_bn: string;
  count_en: string;
  description_bn: string;
  description_en: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpcomingPoliticalEvent {
  id: string;
  event_bn: string;
  event_en: string;
  date_bn: string;
  date_en: string;
  location_bn: string;
  location_en: string;
  description_bn: string;
  description_en: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PageBanner {
  id: string;
  page_name: string;
  title_bn?: string;
  title_en?: string;
  description_bn?: string;
  description_en?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface OrganizedActivity {
  id: string;
  category_name: string;
  activities: Array<{
    id: string;
    title: string;
    description: string;
    frequency?: string;
    impact?: string;
    icon?: string;
  }>;
}

// Tab types
export type TabType = 'banner' | 'categories' | 'activities' | 'projects' | 'principles' | 'achievements' | 'events';

// Table name mapping
export type TableType = Exclude<TabType, 'banner'>;

export const tableMap: Record<TableType, string> = {
  categories: 'political_activities_categories',
  activities: 'political_activities',
  projects: 'current_projects',
  principles: 'political_principles',
  achievements: 'political_achievements',
  events: 'upcoming_political_events'
};

// Editing item type
export interface EditingItem<T = any> {
  item: T | null;
  type: TabType;
}

// Tab configuration
export interface TabConfig {
  key: TabType;
  label: string;
}

export const tabConfigs: TabConfig[] = [
  { key: 'banner', label: 'ব্যানার' },
  { key: 'categories', label: 'ক্যাটাগরি' },
  { key: 'activities', label: 'কার্যক্রম' },
  { key: 'projects', label: 'প্রকল্প' },
  { key: 'principles', label: 'মূলনীতি' },
  { key: 'achievements', label: 'অর্জন' },
  { key: 'events', label: 'ইভেন্ট' }
];