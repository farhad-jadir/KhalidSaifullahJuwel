// khalid/src/app/admin/activities/creative/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Calendar, Sparkles, ChevronDown } from 'lucide-react';

// ========== টাইপ ডিফিনেশন ==========
interface CreativeActivity {
  id?: number;
  title: string;
  description: string;
  participants: string;
  status: string;
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

interface CreativeEvent {
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

// ========== কনস্ট্যান্ট ডিফিনেশন ==========
const ACTIVITY_TYPES = [
  { value: 'art', label: 'চিত্রাঙ্কন', icon: '🎨' },
  { value: 'cultural', label: 'সাংস্কৃতিক', icon: '🎭' },
  { value: 'music', label: 'সংগীত', icon: '🎵' },
  { value: 'poetry', label: 'কবিতা', icon: '📝' },
  { value: 'drama', label: 'নাট্য', icon: '🎪' },
  { value: 'craft', label: 'হস্তশিল্প', icon: '🏺' },
  { value: 'others', label: 'অন্যান্য', icon: '✨' }
];

const ACTIVITY_STATUSES = [
  { value: 'চলমান', label: 'চলমান', color: 'green' },
  { value: 'আসন্ন', label: 'আসন্ন', color: 'blue' },
  { value: 'সমাপ্ত', label: 'সমাপ্ত', color: 'gray' },
  { value: 'বার্ষিক', label: 'বার্ষিক', color: 'purple' }
];

const EVENT_STATUSES = [
  { value: 'upcoming', label: 'আসন্ন', color: 'blue' },
  { value: 'ongoing', label: 'চলমান', color: 'green' },
  { value: 'completed', label: 'সমাপ্ত', color: 'gray' },
  { value: 'cancelled', label: 'বাতিল', color: 'red' }
];

const EVENT_TYPES = [
  { value: 'cultural_night', label: 'সাংস্কৃতিক সন্ধ্যা', icon: '🎭' },
  { value: 'award_ceremony', label: 'সম্মাননা অনুষ্ঠান', icon: '🏆' },
  { value: 'book_fair', label: 'বইমেলা', icon: '📚' },
  { value: 'dance_performance', label: 'নৃত্যানুষ্ঠান', icon: '💃' },
  { value: 'workshop', label: 'কর্মশালা', icon: '🔨' },
  { value: 'exhibition', label: 'প্রদর্শনী', icon: '🖼️' },
  { value: 'competition', label: 'প্রতিযোগিতা', icon: '🏅' },
  { value: 'others', label: 'অন্যান্য', icon: '✨' }
];

// Supabase ক্লায়েন্ট
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminCreativeActivities() {
  const router = useRouter();
  const [activities, setActivities] = useState<CreativeActivity[]>([]);
  const [events, setEvents] = useState<CreativeEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<CreativeActivity | null>(null);
  const [editingEvent, setEditingEvent] = useState<CreativeEvent | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'activities' | 'events'>('activities');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ফর্ম স্টেট - Activities
  const [activityFormData, setActivityFormData] = useState<Partial<CreativeActivity>>({
    title: '',
    description: '',
    participants: '',
    status: 'চলমান',
    icon: '🎨',
    activity_type: 'art',
    location: '',
    event_date: '',
    sort_order: 0,
    is_featured: false,
    image_url: null,
    image_path: null
  });

  // ফর্ম স্টেট - Events
  const [eventFormData, setEventFormData] = useState<Partial<CreativeEvent>>({
    title: '',
    description: '',
    event_date: '',
    event_type: 'cultural_night',
    icon: '📅',
    location: '',
    registration_link: '',
    is_featured: false,
    sort_order: 0,
    status: 'upcoming',
    image_url: null,
    image_path: null
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        toast.error('দয়া করে লগইন করুন');
        return;
      }

      setIsAuthenticated(true);
      loadData();
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/login');
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('creative_activities')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;

      // Load events
      const { data: eventsData, error: eventsError } = await supabase
        .from('creative_events')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      setActivities(activitiesData || []);
      setEvents(eventsData || []);
    } catch (error) {
      console.error('Load error:', error);
      toast.error('ডাটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // ইমেজ আপলোড (Activities)
  const handleActivityImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('ছবির সাইজ 5MB এর কম হতে হবে');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('শুধুমাত্র ইমেজ ফাইল আপলোড করুন');
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `creative/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('creative')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('creative')
        .getPublicUrl(filePath);

      setActivityFormData(prev => ({
        ...prev,
        image_url: publicUrl,
        image_path: filePath
      }));

      toast.success('ছবি আপলোড সফল হয়েছে');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('ছবি আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploadingImage(false);
    }
  };

  // ইমেজ আপলোড (Events)
  const handleEventImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('ছবির সাইজ 5MB এর কম হতে হবে');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('শুধুমাত্র ইমেজ ফাইল আপলোড করুন');
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `creative/events/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('creative')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('creative')
        .getPublicUrl(filePath);

      setEventFormData(prev => ({
        ...prev,
        image_url: publicUrl,
        image_path: filePath
      }));

      toast.success('ছবি আপলোড সফল হয়েছে');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('ছবি আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploadingImage(false);
    }
  };

  // Activity Submit
  const handleActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast.error('আপনি লগইন করেননি');
        return;
      }

      if (!activityFormData.title?.trim()) {
        toast.error('শিরোনাম দিন');
        return;
      }
      if (!activityFormData.description?.trim()) {
        toast.error('বিবরণ দিন');
        return;
      }
      if (!activityFormData.participants?.trim()) {
        toast.error('অংশগ্রহণকারীর সংখ্যা দিন');
        return;
      }

      const activityData = {
        ...activityFormData,
        title: activityFormData.title.trim(),
        description: activityFormData.description.trim(),
        participants: activityFormData.participants.trim(),
        updated_at: new Date().toISOString()
      };

      if (editingActivity) {
        const { error } = await supabase
          .from('creative_activities')
          .update(activityData)
          .eq('id', editingActivity.id);

        if (error) throw error;
        toast.success('তথ্য আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('creative_activities')
          .insert([{
            ...activityData,
            created_by: userData.user.id,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('নতুন কার্যক্রম যোগ হয়েছে');
      }

      setShowActivityModal(false);
      setEditingActivity(null);
      resetActivityForm();
      loadData();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  // Event Submit
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast.error('আপনি লগইন করেননি');
        return;
      }

      if (!eventFormData.title?.trim()) {
        toast.error('শিরোনাম দিন');
        return;
      }
      if (!eventFormData.description?.trim()) {
        toast.error('বিবরণ দিন');
        return;
      }
      if (!eventFormData.event_date?.trim()) {
        toast.error('তারিখ দিন');
        return;
      }

      const eventData = {
        ...eventFormData,
        title: eventFormData.title.trim(),
        description: eventFormData.description.trim(),
        event_date: eventFormData.event_date.trim(),
        updated_at: new Date().toISOString()
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('creative_events')
          .update(eventData)
          .eq('id', editingEvent.id);

        if (error) throw error;
        toast.success('ইভেন্ট আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('creative_events')
          .insert([{
            ...eventData,
            created_by: userData.user.id,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('নতুন ইভেন্ট যোগ হয়েছে');
      }

      setShowEventModal(false);
      setEditingEvent(null);
      resetEventForm();
      loadData();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Activity
  const handleActivityDelete = async (id: number, imagePath?: string | null) => {
    if (!confirm('আপনি কি এই কার্যক্রমটি মুছে ফেলতে চান?')) return;

    try {
      if (imagePath) {
        await supabase.storage
          .from('creative')
          .remove([imagePath]);
      }

      const { error } = await supabase
        .from('creative_activities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('কার্যক্রম মুছে ফেলা হয়েছে');
      loadData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // Delete Event
  const handleEventDelete = async (id: number, imagePath?: string | null) => {
    if (!confirm('আপনি কি এই ইভেন্টটি মুছে ফেলতে চান?')) return;

    try {
      if (imagePath) {
        await supabase.storage
          .from('creative')
          .remove([imagePath]);
      }

      const { error } = await supabase
        .from('creative_events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('ইভেন্ট মুছে ফেলা হয়েছে');
      loadData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const resetActivityForm = () => {
    setActivityFormData({
      title: '',
      description: '',
      participants: '',
      status: 'চলমান',
      icon: '🎨',
      activity_type: 'art',
      location: '',
      event_date: '',
      sort_order: 0,
      is_featured: false,
      image_url: null,
      image_path: null
    });
  };

  const resetEventForm = () => {
    setEventFormData({
      title: '',
      description: '',
      event_date: '',
      event_type: 'cultural_night',
      icon: '📅',
      location: '',
      registration_link: '',
      is_featured: false,
      sort_order: 0,
      status: 'upcoming',
      image_url: null,
      image_path: null
    });
  };

  const handleActivityEdit = (activity: CreativeActivity) => {
    setEditingActivity(activity);
    setActivityFormData({
      ...activity,
      event_date: activity.event_date || ''
    });
    setShowActivityModal(true);
  };

  const handleEventEdit = (event: CreativeEvent) => {
    setEditingEvent(event);
    setEventFormData(event);
    setShowEventModal(true);
  };

  // মোবাইলের জন্য অ্যাক্টিভিটি কার্ড ভিউ
  const renderActivityMobileCards = () => {
    return (
      <div className="space-y-4 sm:hidden">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              {/* ছবি/আইকন */}
              <div className="flex-shrink-0">
                {activity.image_url ? (
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                    <Image
                      src={activity.image_url}
                      alt={activity.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                    {activity.icon}
                  </div>
                )}
              </div>

              {/* কন্টেন্ট */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-medium text-gray-900 font-bangla truncate">
                    {activity.title}
                  </h3>
                  {activity.is_featured && (
                    <span className="text-yellow-500 ml-2">★</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-bangla line-clamp-2 mt-1">
                  {activity.description}
                </p>
                
                {/* ট্যাগ ও তথ্য */}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {ACTIVITY_TYPES.find(t => t.value === activity.activity_type)?.icon}{' '}
                    {ACTIVITY_TYPES.find(t => t.value === activity.activity_type)?.label}
                  </span>
                  <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full
                    ${activity.status === 'চলমান' ? 'bg-green-100 text-green-800' : 
                      activity.status === 'আসন্ন' ? 'bg-blue-100 text-blue-800' :
                      activity.status === 'বার্ষিক' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'}`}>
                    {activity.status}
                  </span>
                </div>

                {/* অংশগ্রহণকারী ও অবস্থান */}
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600 font-bangla">
                    👥 অংশগ্রহণকারী: {activity.participants}
                  </p>
                  {activity.location && (
                    <p className="text-xs text-gray-600 font-bangla">
                      📍 {activity.location}
                    </p>
                  )}
                  {activity.event_date && (
                    <p className="text-xs text-gray-600 font-bangla">
                      📅 {activity.event_date}
                    </p>
                  )}
                </div>
              </div>

              {/* অ্যাকশন বাটন */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleActivityEdit(activity)}
                  className="text-green-600 hover:text-green-900 text-sm font-bangla"
                >
                  এডিট
                </button>
                <button
                  onClick={() => handleActivityDelete(activity.id!, activity.image_path)}
                  className="text-red-600 hover:text-red-900 text-sm font-bangla"
                >
                  ডিলিট
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // মোবাইলের জন্য ইভেন্ট কার্ড ভিউ
  const renderEventMobileCards = () => {
    return (
      <div className="space-y-4 sm:hidden">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              {/* ছবি/আইকন */}
              <div className="flex-shrink-0">
                {event.image_url ? (
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                    <Image
                      src={event.image_url}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                    {event.icon}
                  </div>
                )}
              </div>

              {/* কন্টেন্ট */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-medium text-gray-900 font-bangla truncate">
                    {event.title}
                  </h3>
                  {event.is_featured && (
                    <span className="text-yellow-500 ml-2">★</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-bangla line-clamp-2 mt-1">
                  {event.description}
                </p>
                
                {/* ট্যাগ ও তথ্য */}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {EVENT_TYPES.find(t => t.value === event.event_type)?.icon}{' '}
                    {EVENT_TYPES.find(t => t.value === event.event_type)?.label}
                  </span>
                  <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full
                    ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                      event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                      event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'}`}>
                    {EVENT_STATUSES.find(s => s.value === event.status)?.label}
                  </span>
                </div>

                {/* তারিখ, অবস্থান ও রেজিস্ট্রেশন */}
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600 font-bangla">
                    📅 {event.event_date}
                  </p>
                  {event.location && (
                    <p className="text-xs text-gray-600 font-bangla">
                      📍 {event.location}
                    </p>
                  )}
                  {event.registration_link && (
                    <p className="text-xs text-blue-600 truncate">
                      🔗 রেজিস্ট্রেশন লিংক
                    </p>
                  )}
                </div>
              </div>

              {/* অ্যাকশন বাটন */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleEventEdit(event)}
                  className="text-green-600 hover:text-green-900 text-sm font-bangla"
                >
                  এডিট
                </button>
                <button
                  onClick={() => handleEventDelete(event.id!, event.image_path)}
                  className="text-red-600 hover:text-red-900 text-sm font-bangla"
                >
                  ডিলিট
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600 font-bangla">অনুমতি পরীক্ষা করা হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-bangla">
                সৃজনশীল কার্যক্রম ব্যবস্থাপনা
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-bangla mt-1">
                মোট {activities.length}টি কার্যক্রম, {events.length}টি ইভেন্ট
              </p>
            </div>
            
            {/* মোবাইলের জন্য মেনু টগল */}
            <div className="w-full sm:w-auto">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-between"
              >
                <span className="font-bangla">নতুন যোগ করুন</span>
                <ChevronDown className={`w-5 h-5 transform transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* মোবাইল মেনু */}
              {mobileMenuOpen && (
                <div className="mt-2 sm:hidden space-y-2">
                  <button
                    onClick={() => {
                      resetEventForm();
                      setEditingEvent(null);
                      setShowEventModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bangla flex items-center justify-center gap-2"
                  >
                    <Calendar size={18} />
                    <span>নতুন ইভেন্ট</span>
                  </button>
                  <button
                    onClick={() => {
                      resetActivityForm();
                      setEditingActivity(null);
                      setShowActivityModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bangla flex items-center justify-center gap-2"
                  >
                    <Sparkles size={18} />
                    <span>নতুন কার্যক্রম</span>
                  </button>
                </div>
              )}

              {/* ডেস্কটপ বাটন */}
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => {
                    resetEventForm();
                    setEditingEvent(null);
                    setShowEventModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bangla flex items-center gap-2 text-sm"
                >
                  <Calendar size={18} />
                  <span>নতুন ইভেন্ট</span>
                </button>
                <button
                  onClick={() => {
                    resetActivityForm();
                    setEditingActivity(null);
                    setShowActivityModal(true);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bangla flex items-center gap-2 text-sm"
                >
                  <Sparkles size={18} />
                  <span>নতুন কার্যক্রম</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs - Responsive */}
          <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-6 border-b overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('activities')}
              className={`px-3 sm:px-4 py-2 font-bangla text-sm sm:text-base transition-colors relative whitespace-nowrap ${
                activeTab === 'activities'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              কার্যক্রম সমূহ ({activities.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-3 sm:px-4 py-2 font-bangla text-sm sm:text-base transition-colors relative whitespace-nowrap ${
                activeTab === 'events'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ইভেন্ট সমূহ ({events.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            <p className="text-gray-500 font-bangla mt-2">ডাটা লোড হচ্ছে...</p>
          </div>
        ) : activeTab === 'activities' ? (
          <>
            {/* Activities Mobile Cards */}
            {renderActivityMobileCards()}

            {/* Activities Desktop Table */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
              {activities.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <p className="text-3xl sm:text-4xl mb-4">🎨</p>
                  <p className="text-gray-500 font-bangla text-base sm:text-lg mb-4">কোনো কার্যক্রম পাওয়া যায়নি</p>
                  <button
                    onClick={() => {
                      resetActivityForm();
                      setEditingActivity(null);
                      setShowActivityModal(true);
                    }}
                    className="text-green-600 hover:text-green-700 font-bangla text-sm sm:text-base"
                  >
                    + প্রথম কার্যক্রম যোগ করুন
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          ছবি
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          শিরোনাম
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          ধরন
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          অংশগ্রহণকারী
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          অবস্থা
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          ফিচার্ড
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          অ্যাকশন
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activities.map((activity) => (
                        <tr key={activity.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            {activity.image_url ? (
                              <div className="relative h-10 w-10 rounded-lg overflow-hidden">
                                <Image
                                  src={activity.image_url}
                                  alt={activity.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                                {activity.icon}
                              </div>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 font-bangla">
                              {activity.title.length > 30 ? activity.title.substring(0, 30) + '...' : activity.title}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 font-bangla line-clamp-1">
                              {activity.description.length > 50 ? activity.description.substring(0, 50) + '...' : activity.description}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className="text-xs sm:text-sm text-gray-900 font-bangla">
                              {ACTIVITY_TYPES.find(t => t.value === activity.activity_type)?.label || activity.activity_type}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-bangla">
                            {activity.participants}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${activity.status === 'চলমান' ? 'bg-green-100 text-green-800' : 
                                activity.status === 'আসন্ন' ? 'bg-blue-100 text-blue-800' :
                                activity.status === 'বার্ষিক' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'}`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            {activity.is_featured ? (
                              <span className="text-yellow-500 text-lg">★</span>
                            ) : (
                              <span className="text-gray-300 text-lg">☆</span>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                            <button
                              onClick={() => handleActivityEdit(activity)}
                              className="text-green-600 hover:text-green-900 mr-2 sm:mr-3 font-bangla"
                            >
                              এডিট
                            </button>
                            <button
                              onClick={() => handleActivityDelete(activity.id!, activity.image_path)}
                              className="text-red-600 hover:text-red-900 font-bangla"
                            >
                              ডিলিট
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Events Mobile Cards */}
            {renderEventMobileCards()}

            {/* Events Desktop Table */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
              {events.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <p className="text-3xl sm:text-4xl mb-4">📅</p>
                  <p className="text-gray-500 font-bangla text-base sm:text-lg mb-4">কোনো ইভেন্ট পাওয়া যায়নি</p>
                  <button
                    onClick={() => {
                      resetEventForm();
                      setEditingEvent(null);
                      setShowEventModal(true);
                    }}
                    className="text-green-600 hover:text-green-700 font-bangla text-sm sm:text-base"
                  >
                    + প্রথম ইভেন্ট যোগ করুন
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          ছবি
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          শিরোনাম
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          ধরন
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          তারিখ
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          অবস্থা
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          অবস্থান
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          অ্যাকশন
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {events.map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            {event.image_url ? (
                              <div className="relative h-10 w-10 rounded-lg overflow-hidden">
                                <Image
                                  src={event.image_url}
                                  alt={event.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                                {event.icon}
                              </div>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 font-bangla">
                              {event.title.length > 30 ? event.title.substring(0, 30) + '...' : event.title}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 font-bangla line-clamp-1">
                              {event.description.length > 50 ? event.description.substring(0, 50) + '...' : event.description}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className="text-xs sm:text-sm text-gray-900 font-bangla">
                              {EVENT_TYPES.find(t => t.value === event.event_type)?.label || event.event_type}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-bangla">
                            {event.event_date}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                                event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                event.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                'bg-red-100 text-red-800'}`}>
                              {EVENT_STATUSES.find(s => s.value === event.status)?.label || event.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500 font-bangla">
                            {event.location ? (event.location.length > 15 ? event.location.substring(0, 15) + '...' : event.location) : '-'}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                            <button
                              onClick={() => handleEventEdit(event)}
                              className="text-green-600 hover:text-green-900 mr-2 sm:mr-3 font-bangla"
                            >
                              এডিট
                            </button>
                            <button
                              onClick={() => handleEventDelete(event.id!, event.image_path)}
                              className="text-red-600 hover:text-red-900 font-bangla"
                            >
                              ডিলিট
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Activity Modal - সম্পূর্ণ রেস্পন্সিভ */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold font-bangla">
                  {editingActivity ? 'কার্যক্রম সম্পাদনা' : 'নতুন কার্যক্রম'}
                </h2>
                <button
                  onClick={() => {
                    setShowActivityModal(false);
                    setEditingActivity(null);
                    resetActivityForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleActivitySubmit} className="space-y-4">
                {/* Image Upload - Responsive */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-bangla">
                    ছবি
                  </label>
                  <div className="space-y-3">
                    {activityFormData.image_url && (
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={activityFormData.image_url}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (activityFormData.image_path) {
                              await supabase.storage
                                .from('creative')
                                .remove([activityFormData.image_path]);
                            }
                            setActivityFormData(prev => ({
                              ...prev,
                              image_url: null,
                              image_path: null
                            }));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs sm:text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleActivityImageUpload}
                      disabled={uploadingImage}
                      className="block w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {uploadingImage && (
                      <p className="text-xs sm:text-sm text-green-600 font-bangla">আপলোড হচ্ছে...</p>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    শিরোনাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={activityFormData.title}
                    onChange={(e) => setActivityFormData({...activityFormData, title: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="যেমন: চিত্রাঙ্কন প্রতিযোগিতা"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    বিবরণ *
                  </label>
                  <textarea
                    required
                    value={activityFormData.description}
                    onChange={(e) => setActivityFormData({...activityFormData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="কার্যক্রমের বিবরণ লিখুন..."
                  />
                </div>

                {/* Participants and Icon - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      অংশগ্রহণকারী *
                    </label>
                    <input
                      type="text"
                      required
                      value={activityFormData.participants}
                      onChange={(e) => setActivityFormData({...activityFormData, participants: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                      placeholder="যেমন: ৫০০+"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      আইকন
                    </label>
                    <input
                      type="text"
                      value={activityFormData.icon}
                      onChange={(e) => setActivityFormData({...activityFormData, icon: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="যেমন: 🎨"
                      maxLength={2}
                    />
                  </div>
                </div>

                {/* Activity Type and Status - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      কার্যক্রমের ধরন *
                    </label>
                    <select
                      required
                      value={activityFormData.activity_type}
                      onChange={(e) => setActivityFormData({...activityFormData, activity_type: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    >
                      {ACTIVITY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      অবস্থা *
                    </label>
                    <select
                      required
                      value={activityFormData.status}
                      onChange={(e) => setActivityFormData({...activityFormData, status: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    >
                      {ACTIVITY_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location and Event Date - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      অবস্থান
                    </label>
                    <input
                      type="text"
                      value={activityFormData.location || ''}
                      onChange={(e) => setActivityFormData({...activityFormData, location: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                      placeholder="যেমন: ঢাকা"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      ইভেন্টের তারিখ
                    </label>
                    <input
                      type="date"
                      value={activityFormData.event_date || ''}
                      onChange={(e) => setActivityFormData({...activityFormData, event_date: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>
                </div>

                {/* Sort Order and Featured - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      সাজানোর ক্রম
                    </label>
                    <input
                      type="number"
                      value={activityFormData.sort_order || 0}
                      onChange={(e) => setActivityFormData({...activityFormData, sort_order: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      ফিচার্ড
                    </label>
                    <div className="flex items-center h-10">
                      <input
                        type="checkbox"
                        checked={activityFormData.is_featured || false}
                        onChange={(e) => setActivityFormData({...activityFormData, is_featured: e.target.checked})}
                        className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-2 text-xs sm:text-sm text-gray-600 font-bangla">হোম পেইজে দেখাবে</span>
                    </div>
                  </div>
                </div>

                {/* Buttons - Responsive */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowActivityModal(false);
                      setEditingActivity(null);
                      resetActivityForm();
                    }}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-bangla text-sm sm:text-base"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploadingImage}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-bangla flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>সেভ হচ্ছে...</span>
                      </>
                    ) : (
                      <span>সেভ করুন</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Event Modal - সম্পূর্ণ রেস্পন্সিভ */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold font-bangla">
                  {editingEvent ? 'ইভেন্ট সম্পাদনা' : 'নতুন ইভেন্ট'}
                </h2>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                    resetEventForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleEventSubmit} className="space-y-4">
                {/* Image Upload - Responsive */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-bangla">
                    ছবি
                  </label>
                  <div className="space-y-3">
                    {eventFormData.image_url && (
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={eventFormData.image_url}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (eventFormData.image_path) {
                              await supabase.storage
                                .from('creative')
                                .remove([eventFormData.image_path]);
                            }
                            setEventFormData(prev => ({
                              ...prev,
                              image_url: null,
                              image_path: null
                            }));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs sm:text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEventImageUpload}
                      disabled={uploadingImage}
                      className="block w-full text-xs sm:text-sm text-gray-500 file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-full file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                    />
                    {uploadingImage && (
                      <p className="text-xs sm:text-sm text-green-600 font-bangla">আপলোড হচ্ছে...</p>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    শিরোনাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData({...eventFormData, title: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="যেমন: বার্ষিক সাংস্কৃতিক সন্ধ্যা"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    বিবরণ *
                  </label>
                  <textarea
                    required
                    value={eventFormData.description}
                    onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="ইভেন্টের বিবরণ লিখুন..."
                  />
                </div>

                {/* Event Type and Status - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      ইভেন্টের ধরন *
                    </label>
                    <select
                      required
                      value={eventFormData.event_type}
                      onChange={(e) => setEventFormData({...eventFormData, event_type: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    >
                      {EVENT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      অবস্থা *
                    </label>
                    <select
                      required
                      value={eventFormData.status}
                      onChange={(e) => setEventFormData({...eventFormData, status: e.target.value as any})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    >
                      {EVENT_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date and Icon - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      তারিখ *
                    </label>
                    <input
                      type="text"
                      required
                      value={eventFormData.event_date}
                      onChange={(e) => setEventFormData({...eventFormData, event_date: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                      placeholder="যেমন: ১৫ ডিসেম্বর, ২০২৪"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      আইকন
                    </label>
                    <input
                      type="text"
                      value={eventFormData.icon}
                      onChange={(e) => setEventFormData({...eventFormData, icon: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="যেমন: 📅"
                      maxLength={2}
                    />
                  </div>
                </div>

                {/* Location and Registration Link - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      অবস্থান
                    </label>
                    <input
                      type="text"
                      value={eventFormData.location || ''}
                      onChange={(e) => setEventFormData({...eventFormData, location: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                      placeholder="যেমন: ঢাকা"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      রেজিস্ট্রেশন লিংক
                    </label>
                    <input
                      type="url"
                      value={eventFormData.registration_link || ''}
                      onChange={(e) => setEventFormData({...eventFormData, registration_link: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="https://example.com/register"
                    />
                  </div>
                </div>

                {/* Sort Order and Featured - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      সাজানোর ক্রম
                    </label>
                    <input
                      type="number"
                      value={eventFormData.sort_order || 0}
                      onChange={(e) => setEventFormData({...eventFormData, sort_order: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      ফিচার্ড
                    </label>
                    <div className="flex items-center h-10">
                      <input
                        type="checkbox"
                        checked={eventFormData.is_featured || false}
                        onChange={(e) => setEventFormData({...eventFormData, is_featured: e.target.checked})}
                        className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                      />
                      <span className="ml-2 text-xs sm:text-sm text-gray-600 font-bangla">হোম পেইজে দেখাবে</span>
                    </div>
                  </div>
                </div>

                {/* Buttons - Responsive */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventModal(false);
                      setEditingEvent(null);
                      resetEventForm();
                    }}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-bangla text-sm sm:text-base"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploadingImage}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-bangla flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>সেভ হচ্ছে...</span>
                      </>
                    ) : (
                      <span>সেভ করুন</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}