// khalid/src/app/admin/activities/social/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { SocialActivity, SocialStatistic, ACTIVITY_TYPES, STATUS_OPTIONS } from '@/types/social.types';

// Supabase ক্লায়েন্ট
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminSocialActivities() {
  const router = useRouter();
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [statistics, setStatistics] = useState<SocialStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showStatModal, setShowStatModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<SocialActivity | null>(null);
  const [editingStat, setEditingStat] = useState<SocialStatistic | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'activities' | 'statistics'>('activities');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ফর্ম স্টেট - Activities
  const [formData, setFormData] = useState<Partial<SocialActivity>>({
    title: '',
    description: '',
    beneficiaries: '',
    icon: '🤝',
    activity_type: 'medical',
    status: 'active',
    location: '',
    event_date: '',
    sort_order: 0,
    image_url: null,
    image_path: null
  });

  // ফর্ম স্টেট - Statistics
  const [statFormData, setStatFormData] = useState<Partial<SocialStatistic>>({
    label: '',
    number: '',
    icon: '📊',
    status: 'active',
    sort_order: 0
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
        .from('social_activities')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;

      // Load statistics
      const { data: statisticsData, error: statisticsError } = await supabase
        .from('social_statistics')
        .select('*')
        .order('sort_order', { ascending: true });

      if (statisticsError) throw statisticsError;

      setActivities(activitiesData || []);
      setStatistics(statisticsData || []);
    } catch (error) {
      console.error('Load error:', error);
      toast.error('ডাটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // ইমেজ আপলোড
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const filePath = `social/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('social')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('social')
        .getPublicUrl(filePath);

      setFormData(prev => ({
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

  const handleImageRemove = async () => {
    if (formData.image_path) {
      try {
        await supabase.storage
          .from('social')
          .remove([formData.image_path]);
      } catch (error) {
        console.error('Image delete error:', error);
      }
    }

    setFormData(prev => ({
      ...prev,
      image_url: null,
      image_path: null
    }));
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

      if (!formData.title?.trim()) {
        toast.error('শিরোনাম দিন');
        return;
      }
      if (!formData.description?.trim()) {
        toast.error('বিবরণ দিন');
        return;
      }
      if (!formData.beneficiaries?.trim()) {
        toast.error('উপকৃত মানুষের সংখ্যা দিন');
        return;
      }

      const activityData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        beneficiaries: formData.beneficiaries.trim(),
        updated_at: new Date().toISOString()
      };

      if (editingActivity) {
        const { error } = await supabase
          .from('social_activities')
          .update(activityData)
          .eq('id', editingActivity.id);

        if (error) throw error;
        toast.success('তথ্য আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('social_activities')
          .insert([{
            ...activityData,
            created_by: userData.user.id,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('নতুন কার্যক্রম যোগ হয়েছে');
      }

      setShowModal(false);
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

  // Statistic Submit
  const handleStatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!statFormData.label?.trim()) {
        toast.error('লেবেল দিন');
        return;
      }
      if (!statFormData.number?.trim()) {
        toast.error('সংখ্যা দিন');
        return;
      }

      if (editingStat) {
        const { error } = await supabase
          .from('social_statistics')
          .update({
            ...statFormData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingStat.id);

        if (error) throw error;
        toast.success('পরিসংখ্যান আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('social_statistics')
          .insert([{
            ...statFormData,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('নতুন পরিসংখ্যান যোগ হয়েছে');
      }

      setShowStatModal(false);
      setEditingStat(null);
      resetStatForm();
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
          .from('social')
          .remove([imagePath]);
      }

      const { error } = await supabase
        .from('social_activities')
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

  // Delete Statistic
  const handleStatDelete = async (id: number) => {
    if (!confirm('আপনি কি এই পরিসংখ্যানটি মুছে ফেলতে চান?')) return;

    try {
      const { error } = await supabase
        .from('social_statistics')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('পরিসংখ্যান মুছে ফেলা হয়েছে');
      loadData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const resetActivityForm = () => {
    setFormData({
      title: '',
      description: '',
      beneficiaries: '',
      icon: '🤝',
      activity_type: 'medical',
      status: 'active',
      location: '',
      event_date: '',
      sort_order: 0,
      image_url: null,
      image_path: null
    });
  };

  const resetStatForm = () => {
    setStatFormData({
      label: '',
      number: '',
      icon: '📊',
      status: 'active',
      sort_order: 0
    });
  };

  const handleActivityEdit = (activity: SocialActivity) => {
    setEditingActivity(activity);
    setFormData({
      ...activity,
      event_date: activity.event_date ? activity.event_date.split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleStatEdit = (stat: SocialStatistic) => {
    setEditingStat(stat);
    setStatFormData(stat);
    setShowStatModal(true);
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
                <h3 className="text-base font-medium text-gray-900 font-bangla truncate">
                  {activity.title}
                </h3>
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
                    ${activity.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {STATUS_OPTIONS.find(s => s.value === activity.status)?.label}
                  </span>
                </div>

                {/* উপকৃত ও অবস্থান */}
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-600 font-bangla">
                    👥 উপকৃত: {activity.beneficiaries}
                  </p>
                  {activity.location && (
                    <p className="text-xs text-gray-600 font-bangla">
                      📍 {activity.location}
                    </p>
                  )}
                  {activity.event_date && (
                    <p className="text-xs text-gray-600 font-bangla">
                      📅 {new Date(activity.event_date).toLocaleDateString('bn-BD')}
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

  // মোবাইলের জন্য পরিসংখ্যান কার্ড ভিউ
  const renderStatMobileCards = () => {
    return (
      <div className="space-y-4 sm:hidden">
        {statistics.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{stat.icon}</div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 font-bangla">
                    {stat.label}
                  </h3>
                  <p className="text-xl font-bold text-green-600 font-bangla mt-1">
                    {stat.number}
                  </p>
                  <div className="mt-2">
                    <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full
                      ${stat.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {STATUS_OPTIONS.find(s => s.value === stat.status)?.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">ক্রম: {stat.sort_order || 0}</p>
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleStatEdit(stat)}
                  className="text-green-600 hover:text-green-900 text-sm font-bangla"
                >
                  এডিট
                </button>
                <button
                  onClick={() => handleStatDelete(stat.id!)}
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
                সামাজিক কার্যক্রম ব্যবস্থাপনা
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-bangla mt-1">
                মোট {activities.length}টি কার্যক্রম, {statistics.length}টি পরিসংখ্যান
              </p>
            </div>
            
            {/* মোবাইলের জন্য মেনু টগল */}
            <div className="w-full sm:w-auto">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center justify-between"
              >
                <span className="font-bangla">নতুন যোগ করুন</span>
                <svg className={`w-5 h-5 transform transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* মোবাইল মেনু */}
              {mobileMenuOpen && (
                <div className="mt-2 sm:hidden space-y-2">
                  <button
                    onClick={() => {
                      resetStatForm();
                      setEditingStat(null);
                      setShowStatModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bangla flex items-center justify-center gap-2"
                  >
                    <span>+</span>
                    <span>নতুন পরিসংখ্যান</span>
                  </button>
                  <button
                    onClick={() => {
                      resetActivityForm();
                      setEditingActivity(null);
                      setShowModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bangla flex items-center justify-center gap-2"
                  >
                    <span>+</span>
                    <span>নতুন কার্যক্রম</span>
                  </button>
                </div>
              )}

              {/* ডেস্কটপ বাটন */}
              <div className="hidden sm:flex gap-2">
                <button
                  onClick={() => {
                    resetStatForm();
                    setEditingStat(null);
                    setShowStatModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bangla flex items-center gap-2 text-sm"
                >
                  <span>+</span>
                  <span>নতুন পরিসংখ্যান</span>
                </button>
                <button
                  onClick={() => {
                    resetActivityForm();
                    setEditingActivity(null);
                    setShowModal(true);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bangla flex items-center gap-2 text-sm"
                >
                  <span>+</span>
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
              onClick={() => setActiveTab('statistics')}
              className={`px-3 sm:px-4 py-2 font-bangla text-sm sm:text-base transition-colors relative whitespace-nowrap ${
                activeTab === 'statistics'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              পরিসংখ্যান ({statistics.length})
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
                  <p className="text-3xl sm:text-4xl mb-4">📭</p>
                  <p className="text-gray-500 font-bangla text-base sm:text-lg mb-4">কোনো কার্যক্রম পাওয়া যায়নি</p>
                  <button
                    onClick={() => {
                      resetActivityForm();
                      setEditingActivity(null);
                      setShowModal(true);
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
                          উপকৃত
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          অবস্থা
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
                            {activity.beneficiaries}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${activity.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {STATUS_OPTIONS.find(s => s.value === activity.status)?.label || activity.status}
                            </span>
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
            {/* Statistics Mobile Cards */}
            {renderStatMobileCards()}

            {/* Statistics Desktop Table */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
              {statistics.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <p className="text-3xl sm:text-4xl mb-4">📊</p>
                  <p className="text-gray-500 font-bangla text-base sm:text-lg mb-4">কোনো পরিসংখ্যান পাওয়া যায়নি</p>
                  <button
                    onClick={() => {
                      resetStatForm();
                      setEditingStat(null);
                      setShowStatModal(true);
                    }}
                    className="text-green-600 hover:text-green-700 font-bangla text-sm sm:text-base"
                  >
                    + প্রথম পরিসংখ্যান যোগ করুন
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          আইকন
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          লেবেল
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          সংখ্যা
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          অবস্থা
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          ক্রম
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          অ্যাকশন
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {statistics.map((stat) => (
                        <tr key={stat.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xl sm:text-2xl">
                            {stat.icon}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 font-bangla">
                              {stat.label}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bangla">
                            {stat.number}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${stat.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {STATUS_OPTIONS.find(s => s.value === stat.status)?.label || stat.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {stat.sort_order || 0}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                            <button
                              onClick={() => handleStatEdit(stat)}
                              className="text-green-600 hover:text-green-900 mr-2 sm:mr-3 font-bangla"
                            >
                              এডিট
                            </button>
                            <button
                              onClick={() => handleStatDelete(stat.id!)}
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
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold font-bangla">
                  {editingActivity ? 'কার্যক্রম সম্পাদনা' : 'নতুন কার্যক্রম'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
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
                    {formData.image_url && (
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={formData.image_url}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleImageRemove}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs sm:text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
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
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="যেমন: চিকিৎসা সেবা"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    বিবরণ *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="কার্যক্রমের বিবরণ লিখুন..."
                  />
                </div>

                {/* Beneficiaries */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    উপকৃত মানুষের সংখ্যা *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.beneficiaries}
                    onChange={(e) => setFormData({...formData, beneficiaries: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="যেমন: ২৫০০+"
                  />
                </div>

                {/* Icon and Type - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      আইকন
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="যেমন: 🏥"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      কার্যক্রমের ধরন *
                    </label>
                    <select
                      required
                      value={formData.activity_type}
                      onChange={(e) => setFormData({...formData, activity_type: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    >
                      {ACTIVITY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Status and Location - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      অবস্থা *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      অবস্থান
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                      placeholder="যেমন: ঢাকা"
                    />
                  </div>
                </div>

                {/* Event Date and Sort Order - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      ইভেন্টের তারিখ
                    </label>
                    <input
                      type="date"
                      value={formData.event_date || ''}
                      onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      সাজানোর ক্রম
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order || 0}
                      onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Buttons - Responsive */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
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

      {/* Statistics Modal - সম্পূর্ণ রেস্পন্সিভ */}
      {showStatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold font-bangla">
                  {editingStat ? 'পরিসংখ্যান সম্পাদনা' : 'নতুন পরিসংখ্যান'}
                </h2>
                <button
                  onClick={() => {
                    setShowStatModal(false);
                    setEditingStat(null);
                    resetStatForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleStatSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    লেবেল *
                  </label>
                  <input
                    type="text"
                    required
                    value={statFormData.label}
                    onChange={(e) => setStatFormData({...statFormData, label: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="যেমন: উপকৃত পরিবার"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    সংখ্যা *
                  </label>
                  <input
                    type="text"
                    required
                    value={statFormData.number}
                    onChange={(e) => setStatFormData({...statFormData, number: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="যেমন: ৫০০০+"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    আইকন
                  </label>
                  <input
                    type="text"
                    value={statFormData.icon}
                    onChange={(e) => setStatFormData({...statFormData, icon: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="যেমন: 📊"
                    maxLength={2}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      অবস্থা *
                    </label>
                    <select
                      required
                      value={statFormData.status}
                      onChange={(e) => setStatFormData({...statFormData, status: e.target.value as any})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      ক্রম
                    </label>
                    <input
                      type="number"
                      value={statFormData.sort_order || 0}
                      onChange={(e) => setStatFormData({...statFormData, sort_order: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Buttons - Responsive */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowStatModal(false);
                      setEditingStat(null);
                      resetStatForm();
                    }}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-bangla text-sm sm:text-base"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-bangla text-sm sm:text-base"
                  >
                    {submitting ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
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