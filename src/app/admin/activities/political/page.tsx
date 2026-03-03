// app/admin/activities/political/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { PoliticalActivity } from '@/types/political.types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// অ্যাক্টিভিটি টাইপ ডিফাইন
const ACTIVITY_TYPES = [
  { value: 'public_meeting', label: 'জনসভা', icon: '🎤' },
  { value: 'party_meeting', label: 'দলীয় সভা', icon: '👥' },
  { value: 'human_chain', label: 'মানববন্ধন', icon: '🤝' },
  { value: 'procession', label: 'মিছিল', icon: '🚩' },
  { value: 'advisory_meeting', label: 'উপদেষ্টা সভা', icon: '📋' },
  { value: 'grassroots_visit', label: 'তৃণমূল সফর', icon: '🌾' },
  { value: 'others', label: 'অন্যান্য', icon: '📌' }
];

// স্ট্যাটাস ডিফাইন
const ACTIVITY_STATUS = [
  { value: 'active', label: 'সক্রিয়', color: 'green' },
  { value: 'inactive', label: 'নিষ্ক্রিয়', color: 'red' },
  { value: 'completed', label: 'সম্পন্ন', color: 'blue' }
];

export default function AdminPoliticalActivities() {
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ফর্ম স্টেট
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: 'চলমান',
    activity_type: 'public_meeting',
    status: 'active',
    image_url: null as string | null,
    image_path: null as string | null,
    event_date: '',
    location: '',
    sort_order: 0
  });

  // শুধু লগইন চেক করুন
  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Current user:', user);
      
      if (!user) {
        toast.error('অনুগ্রহ করে লগইন করুন');
        router.push('/login');
        return;
      }

      setUser(user);
      setAuthChecked(true);
      loadActivities();
      
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('অথেনটিকেশন এ সমস্যা হয়েছে');
      router.push('/login');
    }
  };

  // অ্যাক্টিভিটিস লোড
  const loadActivities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('political_activities')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('event_date', { ascending: false });

      if (error) throw error;
      setActivities(data || []);
    } catch (error: any) {
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
      const filePath = `political/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('activities')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('activities')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        image_url: publicUrl,
        image_path: filePath
      }));

      toast.success('ছবি আপলোড সফল হয়েছে');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('ছবি আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploadingImage(false);
    }
  };

  // ইমেজ রিমুভ
  const handleImageRemove = async () => {
    if (formData.image_path) {
      try {
        const { error } = await supabase.storage
          .from('activities')
          .remove([formData.image_path]);

        if (error) throw error;
      } catch (error: any) {
        console.error('Image delete error:', error);
      }
    }

    setFormData(prev => ({
      ...prev,
      image_url: null,
      image_path: null
    }));
  };

  // সেভ/আপডেট
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!user) {
        toast.error('আপনি লগইন করেননি');
        router.push('/login');
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

      const activityData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: formData.date || 'চলমান',
        activity_type: formData.activity_type,
        status: formData.status,
        image_url: formData.image_url,
        image_path: formData.image_path,
        event_date: formData.event_date || null,
        location: formData.location || null,
        sort_order: formData.sort_order || 0,
        updated_at: new Date().toISOString()
      };

      if (editingActivity) {
        const { error } = await supabase
          .from('political_activities')
          .update(activityData)
          .eq('id', editingActivity.id);

        if (error) throw error;
        toast.success('তথ্য আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('political_activities')
          .insert([{
            ...activityData,
            created_by: user.id,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('নতুন কার্যক্রম যোগ হয়েছে');
      }

      setShowModal(false);
      setEditingActivity(null);
      resetForm();
      loadActivities();
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  // ডিলিট
  const handleDelete = async (id: number, imagePath?: string | null) => {
    if (!confirm('আপনি কি এই কার্যক্রমটি মুছে ফেলতে চান?')) return;

    try {
      if (imagePath) {
        const { error: storageError } = await supabase.storage
          .from('activities')
          .remove([imagePath]);
        
        if (storageError) {
          console.error('Storage delete error:', storageError);
        }
      }

      const { error } = await supabase
        .from('political_activities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('কার্যক্রম মুছে ফেলা হয়েছে');
      loadActivities();
    } catch (error: any) {
      console.error('Delete error:', error);
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: 'চলমান',
      activity_type: 'public_meeting',
      status: 'active',
      image_url: null,
      image_path: null,
      event_date: '',
      location: '',
      sort_order: 0
    });
  };

  const handleEdit = (activity: any) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      date: activity.date,
      activity_type: activity.activity_type,
      status: activity.status,
      image_url: activity.image_url,
      image_path: activity.image_path,
      event_date: activity.event_date || '',
      location: activity.location || '',
      sort_order: activity.sort_order || 0
    });
    setShowModal(true);
  };

  // স্ট্যাটাস ব্যাজ
  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      active: { color: 'green', label: 'সক্রিয়' },
      inactive: { color: 'red', label: 'নিষ্ক্রিয়' },
      completed: { color: 'blue', label: 'সম্পন্ন' }
    };
    
    const config = statusConfig[status] || { color: 'gray', label: status };
    
    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-${config.color}-100 text-${config.color}-800`}>
        {config.label}
      </span>
    );
  };

  // মোবাইলের জন্য কার্ড ভিউ
  const renderMobileCards = () => {
    return (
      <div className="space-y-4 sm:hidden">
        {activities.map((activity) => (
          <div key={activity.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              {/* ছবি */}
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
                  <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-xs">ছবি</span>
                  </div>
                )}
              </div>

              {/* কন্টেন্ট */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {activity.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                  {activity.description}
                </p>
                
                {/* ট্যাগ ও তথ্য */}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {ACTIVITY_TYPES.find(t => t.value === activity.activity_type)?.icon}{' '}
                    {ACTIVITY_TYPES.find(t => t.value === activity.activity_type)?.label}
                  </span>
                  {getStatusBadge(activity.status)}
                </div>

                {/* তারিখ ও অবস্থান */}
                <div className="mt-2 text-xs text-gray-500">
                  {activity.event_date ? (
                    <p>📅 {new Date(activity.event_date).toLocaleDateString('bn-BD')}</p>
                  ) : (
                    <p>📅 {activity.date}</p>
                  )}
                  {activity.location && <p>📍 {activity.location}</p>}
                </div>
              </div>

              {/* অ্যাকশন বাটন */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleEdit(activity)}
                  className="text-green-600 hover:text-green-900 text-sm"
                >
                  এডিট
                </button>
                <button
                  onClick={() => handleDelete(activity.id, activity.image_path)}
                  className="text-red-600 hover:text-red-900 text-sm"
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

  // অথেনটিকেশন চেক না হওয়া পর্যন্ত লোডিং
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="text-gray-600 font-bangla mt-2">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Responsive */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 font-bangla">
                রাজনৈতিক কার্যক্রম
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-bangla mt-1">
                মোট {activities.length}টি কার্যক্রম
              </p>
            </div>
            
            {/* নিউ বাটন - রেস্পন্সিভ */}
            <button
              onClick={() => {
                resetForm();
                setEditingActivity(null);
                setShowModal(true);
              }}
              className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bangla flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <span className="text-lg">+</span>
              <span>নতুন কার্যক্রম</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {loading ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-gray-500 font-bangla mt-2">ডাটা লোড হচ্ছে...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 sm:p-12 text-center">
            <p className="text-3xl sm:text-4xl mb-4">📭</p>
            <p className="text-gray-500 font-bangla text-base sm:text-lg mb-4">কোনো কার্যক্রম নেই</p>
            <button
              onClick={() => setShowModal(true)}
              className="text-green-600 hover:text-green-700 font-bangla text-sm sm:text-base"
            >
              + প্রথম কার্যক্রম যোগ করুন
            </button>
          </div>
        ) : (
          <>
            {/* মোবাইল ভিউ - কার্ড */}
            {renderMobileCards()}

            {/* ডেস্কটপ ভিউ - টেবিল */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ছবি</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">শিরোনাম</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ধরন</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অবস্থা</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অবস্থান</th>
                      <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
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
                            <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center">
                              <span className="text-gray-400 text-xs">ছবি</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {activity.title.length > 30 ? activity.title.substring(0, 30) + '...' : activity.title}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 line-clamp-1">
                            {activity.description.length > 50 ? activity.description.substring(0, 50) + '...' : activity.description}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className="text-xs sm:text-sm text-gray-900">
                            {ACTIVITY_TYPES.find(t => t.value === activity.activity_type)?.label || activity.activity_type}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(activity.status)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {activity.event_date ? new Date(activity.event_date).toLocaleDateString('bn-BD') : activity.date}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                          {activity.location ? (activity.location.length > 15 ? activity.location.substring(0, 15) + '...' : activity.location) : '-'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                          <button
                            onClick={() => handleEdit(activity)}
                            className="text-green-600 hover:text-green-900 mr-2 sm:mr-3"
                          >
                            এডিট
                          </button>
                          <button
                            onClick={() => handleDelete(activity.id, activity.image_path)}
                            className="text-red-600 hover:text-red-900"
                          >
                            ডিলিট
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal - Add/Edit - সম্পূর্ণ রেস্পন্সিভ */}
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
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload - Responsive */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ছবি
                  </label>
                  <div className="space-y-3">
                    {formData.image_url && (
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-lg overflow-hidden border">
                        <Image
                          src={formData.image_url}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleImageRemove}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
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
                      <p className="text-xs sm:text-sm text-green-600">আপলোড হচ্ছে...</p>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    শিরোনাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="যেমন: জনসভা ও সমাবেশ"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    বিবরণ *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="কার্যক্রমের বিবরণ লিখুন..."
                  />
                </div>

                {/* Activity Type and Status - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      কার্যক্রমের ধরন *
                    </label>
                    <select
                      required
                      value={formData.activity_type}
                      onChange={(e) => setFormData({...formData, activity_type: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      {ACTIVITY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      অবস্থা *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    >
                      {ACTIVITY_STATUS.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Event Date and Location - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ইভেন্টের তারিখ
                    </label>
                    <input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      অবস্থান
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="যেমন: ঢাকা"
                    />
                  </div>
                </div>

                {/* Display Date and Sort Order - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      প্রদর্শনের তারিখ
                    </label>
                    <input
                      type="text"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="যেমন: চলমান"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      সাজানোর ক্রম
                    </label>
                    <input
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
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
                      resetForm();
                    }}
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || uploadingImage}
                    className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
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