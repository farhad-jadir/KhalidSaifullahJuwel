// app/admin/activities/political.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  PoliticalCategory,
  PoliticalActivity,
  CurrentProject,
  PoliticalPrinciple,
  PoliticalAchievement,
  UpcomingPoliticalEvent,
  PageBanner,
  TabType,
  EditingItem,
  TableType,
  TabConfig
} from '@/app/types/political';
import { tableMap, tabConfigs } from '@/app/types/political';

export default function AdminPoliticalActivities() {
  const [activeTab, setActiveTab] = useState<TabType>('banner');
  const [categories, setCategories] = useState<PoliticalCategory[]>([]);
  const [activities, setActivities] = useState<PoliticalActivity[]>([]);
  const [projects, setProjects] = useState<CurrentProject[]>([]);
  const [principles, setPrinciples] = useState<PoliticalPrinciple[]>([]);
  const [achievements, setAchievements] = useState<PoliticalAchievement[]>([]);
  const [events, setEvents] = useState<UpcomingPoliticalEvent[]>([]);
  const [banner, setBanner] = useState<PageBanner>({
    id: '',
    page_name: 'political-activities',
    title_bn: '',
    title_en: '',
    description_bn: '',
    description_en: '',
    image_url: '',
    display_order: 0,
    is_active: true,
    created_at: '',
    updated_at: ''
  });
  
  const [editingItem, setEditingItem] = useState<EditingItem>({ item: null, type: 'banner' });
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      
      // Fetch data based on active tab
      if (activeTab !== 'banner') {
        const tableName = tableMap[activeTab as TableType];
        
        if (!tableName) {
          console.error('Invalid table name for active tab:', activeTab);
          return;
        }

        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('display_order');

        if (error) {
          throw new Error(`Database error: ${error.message}`);
        }

        // Type-safe data assignment
        switch (activeTab) {
          case 'categories': 
            setCategories(data as PoliticalCategory[]); 
            break;
          case 'activities': 
            setActivities(data as PoliticalActivity[]); 
            break;
          case 'projects': 
            setProjects(data as CurrentProject[]); 
            break;
          case 'principles': 
            setPrinciples(data as PoliticalPrinciple[]); 
            break;
          case 'achievements': 
            setAchievements(data as PoliticalAchievement[]); 
            break;
          case 'events': 
            setEvents(data as UpcomingPoliticalEvent[]); 
            break;
        }
      }

      // Always fetch banner
      const { data: bannerData, error: bannerError } = await supabase
        .from('page_banners')
        .select('*')
        .eq('page_name', 'political-activities')
        .single();

      if (!bannerError && bannerData) {
        setBanner(bannerData as PageBanner);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      alert('ডেটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        throw new Error('শুধুমাত্র JPG, PNG, GIF বা WebP ফরম্যাটের ছবি আপলোড করতে পারবেন');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('ছবির সাইজ ৫ এমবির বেশি হতে পারবে না');
      }

      setUploadingImage(true);
      setUploadProgress(0);

      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `banners/${fileName}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from('political-activities-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('political-activities-images')
        .getPublicUrl(filePath);

      // Update banner state
      const updatedBanner = { ...banner, image_url: publicUrl };
      setBanner(updatedBanner);

      // Save to database
      await saveBanner(updatedBanner);

      alert('ছবি সফলভাবে আপলোড হয়েছে!');

    } catch (error) {
      console.error('Error uploading image:', error);
      alert(error instanceof Error ? error.message : 'ছবি আপলোড ব্যর্থ হয়েছে');
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
      // Clear file input
      if (event.target) event.target.value = '';
    }
  };

  const saveBanner = async (bannerData: PageBanner): Promise<void> => {
    try {
      const { error } = await supabase
        .from('page_banners')
        .upsert({
          ...bannerData,
          page_name: 'political-activities',
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      console.log('Banner saved successfully');
    } catch (error) {
      console.error('Error saving banner:', error);
      throw error;
    }
  };

  const handleSaveBanner = async (): Promise<void> => {
    try {
      await saveBanner(banner);
      alert('ব্যানার সংরক্ষণ সফল হয়েছে');
      fetchAllData();
    } catch (error) {
      alert('সংরক্ষণ ব্যর্থ হয়েছে');
    }
  };

  const handleSaveItem = async <T extends { id?: string }>(
    table: string,
    item: T
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from(table)
        .upsert({
          ...item,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      alert('সংরক্ষণ সফল হয়েছে');
      fetchAllData();
      setEditingItem({ item: null, type: activeTab });
    } catch (error) {
      console.error('Error saving item:', error);
      alert('সংরক্ষণ ব্যর্থ হয়েছে');
    }
  };

  const handleDelete = async (table: string, id: string): Promise<void> => {
    if (!confirm('আপনি কি নিশ্চিত? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।')) return;

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;

      alert('সফলভাবে ডিলিট হয়েছে');
      fetchAllData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('ডিলিট ব্যর্থ হয়েছে');
    }
  };

  const tabs: TabConfig[] = tabConfigs;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">রাজনৈতিক কার্যক্রম এডমিন প্যানেল</h1>
        
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.key 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Banner Editor */}
        {activeTab === 'banner' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-gray-900">পেইজ ব্যানার এডিট</h2>
            
            <div className="space-y-6">
              {/* Current Banner Preview */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">বর্তমান ব্যানার</label>
                {banner.image_url ? (
                  <div className="relative rounded-lg overflow-hidden border">
                    <img 
                      src={banner.image_url} 
                      alt="Banner Preview" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                      ছবি লিংক: {banner.image_url.substring(0, 50)}...
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">কোনো ছবি আপলোড করা হয়নি</p>
                  </div>
                )}
              </div>

              {/* Upload Section */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">নতুন ছবি আপলোড</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="banner-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                  <label 
                    htmlFor="banner-upload"
                    className={`cursor-pointer inline-flex flex-col items-center justify-center ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <div className="text-4xl mb-2">📸</div>
                    <p className="mb-2 text-gray-700">ছবি নির্বাচন করুন</p>
                    <p className="text-sm text-gray-500 mb-4">JPG, PNG, GIF বা WebP (সর্বোচ্চ ৫ এমবি)</p>
                    
                    {uploadingImage && (
                      <div className="w-full max-w-xs mx-auto">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-red-600 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">{uploadProgress}% সম্পন্ন</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Title and Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">শিরোনাম (বাংলা)</label>
                  <input
                    type="text"
                    value={banner.title_bn || ''}
                    onChange={(e) => setBanner({...banner, title_bn: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="বাংলা শিরোনাম লিখুন"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">শিরোনাম (ইংরেজি)</label>
                  <input
                    type="text"
                    value={banner.title_en || ''}
                    onChange={(e) => setBanner({...banner, title_en: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="ইংরেজি শিরোনাম লিখুন"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">বর্ণনা (বাংলা)</label>
                  <textarea
                    value={banner.description_bn || ''}
                    onChange={(e) => setBanner({...banner, description_bn: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    placeholder="বাংলা বর্ণনা লিখুন"
                  />
                </div>
                <div>
                  <label className="block mb-2 font-medium text-gray-700">বর্ণনা (ইংরেজি)</label>
                  <textarea
                    value={banner.description_en || ''}
                    onChange={(e) => setBanner({...banner, description_en: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    placeholder="ইংরেজি বর্ণনা লিখুন"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">ডিসপ্লে অর্ডার</label>
                <input
                  type="number"
                  value={banner.display_order}
                  onChange={(e) => setBanner({...banner, display_order: parseInt(e.target.value) || 0})}
                  className="w-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  min="0"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveBanner}
                  disabled={uploadingImage}
                  className={`px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors ${
                    uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploadingImage ? 'আপলোড হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
                <button
                  onClick={() => {
                    setBanner({
                      ...banner,
                      title_bn: '',
                      title_en: '',
                      description_bn: '',
                      description_en: '',
                      image_url: ''
                    });
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  রিসেট করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Categories Editor */}
        {activeTab === 'categories' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">ক্যাটাগরি ম্যানেজমেন্ট</h2>
              <button
                onClick={() => setEditingItem({ 
                  item: { 
                    category_name_bn: '',
                    category_name_en: '',
                    display_order: 0 
                  }, 
                  type: 'categories' 
                })}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + নতুন ক্যাটাগরি
              </button>
            </div>

            {/* Edit Form */}
            {editingItem.type === 'categories' && editingItem.item && (
              <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-bold mb-4 text-lg text-gray-900">
                  {editingItem.item.id ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি তৈরি করুন'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block mb-2 text-gray-700">ক্যাটাগরি নাম (বাংলা)</label>
                    <input
                      type="text"
                      value={editingItem.item.category_name_bn || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, category_name_bn: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-700">ক্যাটাগরি নাম (ইংরেজি)</label>
                    <input
                      type="text"
                      value={editingItem.item.category_name_en || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, category_name_en: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-700">ডিসপ্লে অর্ডার</label>
                  <input
                    type="number"
                    value={editingItem.item.display_order || 0}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, display_order: parseInt(e.target.value) || 0 }
                    })}
                    className="w-32 p-3 border border-gray-300 rounded-lg"
                    min="0"
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => handleSaveItem('political_activities_categories', editingItem.item)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    সংরক্ষণ
                  </button>
                  <button
                    onClick={() => setEditingItem({ item: null, type: 'categories' })}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    বাতিল
                  </button>
                </div>
              </div>
            )}

            {/* Categories List */}
            <div className="space-y-4">
              {categories.map(category => (
                <div key={category.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="mb-2 md:mb-0">
                    <div className="font-bold text-gray-900">{category.category_name_bn}</div>
                    <div className="text-sm text-gray-600 mt-1">{category.category_name_en}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      অর্ডার: {category.display_order}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingItem({ item: category, type: 'categories' })}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                    >
                      এডিট
                    </button>
                    <button
                      onClick={() => handleDelete('political_activities_categories', category.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      ডিলিট
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activities Editor */}
        {activeTab === 'activities' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">কার্যক্রম ম্যানেজমেন্ট</h2>
              <button
                onClick={() => setEditingItem({ 
                  item: { 
                    title_bn: '',
                    title_en: '',
                    description_bn: '',
                    description_en: '',
                    category_id: '',
                    icon: '',
                    frequency_bn: '',
                    frequency_en: '',
                    impact_bn: '',
                    impact_en: '',
                    display_order: 0,
                    is_active: true
                  }, 
                  type: 'activities' 
                })}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + নতুন কার্যক্রম
              </button>
            </div>

            {/* Category Selector for Activities */}
            {editingItem.type === 'activities' && editingItem.item && (
              <div className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="font-bold mb-4 text-lg text-gray-900">
                  {editingItem.item.id ? 'কার্যক্রম এডিট করুন' : 'নতুন কার্যক্রম তৈরি করুন'}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 text-gray-700">ক্যাটাগরি</label>
                    <select
                      value={editingItem.item.category_id || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, category_id: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                      <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.category_name_bn}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-700">আইকন</label>
                    <input
                      type="text"
                      value={editingItem.item.icon || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, icon: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="উদাহরণ: 🗣️"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 text-gray-700">শিরোনাম (বাংলা)</label>
                    <input
                      type="text"
                      value={editingItem.item.title_bn || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, title_bn: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-700">শিরোনাম (ইংরেজি)</label>
                    <input
                      type="text"
                      value={editingItem.item.title_en || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, title_en: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 text-gray-700">বর্ণনা (বাংলা)</label>
                    <textarea
                      value={editingItem.item.description_bn || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, description_bn: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      rows={3}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-700">বর্ণনা (ইংরেজি)</label>
                    <textarea
                      value={editingItem.item.description_en || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, description_en: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block mb-2 text-gray-700">পুনরাবৃত্তি (বাংলা)</label>
                    <input
                      type="text"
                      value={editingItem.item.frequency_bn || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, frequency_bn: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="উদাহরণ: সাপ্তাহিক"
                    />
                  </div>
                  
                  <div>
                    <label className="block mb-2 text-gray-700">প্রভাব (বাংলা)</label>
                    <input
                      type="text"
                      value={editingItem.item.impact_bn || ''}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        item: { ...editingItem.item, impact_bn: e.target.value }
                      })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      placeholder="উদাহরণ: ৫০,০০০+ মানুষ"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-2 text-gray-700">ডিসপ্লে অর্ডার</label>
                  <input
                    type="number"
                    value={editingItem.item.display_order || 0}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, display_order: parseInt(e.target.value) || 0 }
                    })}
                    className="w-32 p-3 border border-gray-300 rounded-lg"
                    min="0"
                  />
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={editingItem.item.is_active}
                    onChange={(e) => setEditingItem({
                      ...editingItem,
                      item: { ...editingItem.item, is_active: e.target.checked }
                    })}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded"
                  />
                  <label htmlFor="is_active" className="ml-2 text-gray-700">
                    সক্রিয়
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleSaveItem('political_activities', editingItem.item)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    সংরক্ষণ
                  </button>
                  <button
                    onClick={() => setEditingItem({ item: null, type: 'activities' })}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    বাতিল
                  </button>
                </div>
              </div>
            )}

            {/* Activities List */}
            <div className="space-y-4">
              {activities.map(activity => (
                <div key={activity.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <div>
                      <div className="font-bold text-gray-900">{activity.title_bn}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {activity.description_bn.substring(0, 100)}...
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {activity.icon && (
                          <span className="text-lg">{activity.icon}</span>
                        )}
                        {activity.frequency_bn && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {activity.frequency_bn}
                          </span>
                        )}
                        {activity.impact_bn && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {activity.impact_bn}
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          activity.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {activity.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button
                        onClick={() => setEditingItem({ item: activity, type: 'activities' })}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                      >
                        এডিট
                      </button>
                      <button
                        onClick={() => handleDelete('political_activities', activity.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        ডিলিট
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects Editor */}
        {activeTab === 'projects' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">প্রকল্প ম্যানেজমেন্ট</h2>
              <button
                onClick={() => setEditingItem({ 
                  item: { 
                    title_bn: '',
                    title_en: '',
                    description_bn: '',
                    description_en: '',
                    progress: 0,
                    timeline_bn: '',
                    timeline_en: '',
                    budget_bn: '',
                    budget_en: '',
                    display_order: 0,
                    is_active: true
                  }, 
                  type: 'projects' 
                })}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + নতুন প্রকল্প
              </button>
            </div>

            {/* Projects List */}
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                    <div>
                      <div className="font-bold text-gray-900">{project.title_bn}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {project.description_bn.substring(0, 100)}...
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {project.progress}% সম্পন্ন
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          project.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {project.is_active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2 md:mt-0">
                      <button
                        onClick={() => setEditingItem({ item: project, type: 'projects' })}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                      >
                        এডিট
                      </button>
                      <button
                        onClick={() => handleDelete('current_projects', project.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        ডিলিট
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Message */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-xl">ℹ️</div>
            <div>
              <h4 className="font-bold text-blue-800 mb-1">এডমিন নির্দেশনা</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• ছবি আপলোডের জন্য "ব্যানার" ট্যাব ব্যবহার করুন</li>
                <li>• ছবির সর্বোচ্চ সাইজ: ৫ এমবি</li>
                <li>• সমর্থিত ফরম্যাট: JPG, PNG, GIF, WebP</li>
                <li>• নতুন আইটেম যোগ করতে সংশ্লিষ্ট ট্যাবে "+ নতুন" বাটন ব্যবহার করুন</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}