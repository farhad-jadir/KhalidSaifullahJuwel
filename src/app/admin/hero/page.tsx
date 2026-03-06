// app/admin/hero/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  X, 
  Upload, 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  EyeOff,
  MoveUp,
  MoveDown,
  Image as ImageIcon
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ========== টাইপ ডিফিনেশন ==========
interface HeroSection {
  id: number;
  name: string;
  title: string;
  description: string;
  image_url: string | null;
  image_path: string | null;
  button_one_text: string | null;
  button_one_link: string | null;
  button_two_text: string | null;
  button_two_link: string | null;
  button_three_text: string | null;
  button_three_link: string | null;
  button_one_color: string | null;
  button_two_color: string | null;
  button_three_color: string | null;
  is_active: boolean;
  updated_at: string;
}

interface HeroStat {
  id: number;
  hero_id: number;
  label: string;
  value: string;
  icon: string | null;
  sort_order: number;
}

// ========== মডাল প্রপস ==========
interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => Promise<void>;
  submitting?: boolean;
}

export default function AdminHeroPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'stats'>('content');
  
  // Data states
  const [hero, setHero] = useState<HeroSection | null>(null);
  const [stats, setStats] = useState<HeroStat[]>([]);
  
  // Modal states
  const [showStatModal, setShowStatModal] = useState(false);
  const [editingStat, setEditingStat] = useState<HeroStat | null>(null);
  
  // Form states
  const [heroForm, setHeroForm] = useState<Partial<HeroSection>>({
    name: '',
    title: '',
    description: '',
    image_url: null,
    image_path: null,
    button_one_text: '',
    button_one_link: '',
    button_two_text: '',
    button_two_link: '',
    button_three_text: '',
    button_three_link: '',
    button_one_color: 'bg-green-600',
    button_two_color: 'border-green-600 text-green-600',
    button_three_color: 'bg-red-600',
    is_active: true
  });

  const [statForm, setStatForm] = useState<Partial<HeroStat>>({
    label: '',
    value: '',
    icon: '📊',
    sort_order: 0
  });

  // Preview mode
  const [previewMode, setPreviewMode] = useState(false);

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

      // Load hero section
      const { data: heroData } = await supabase
        .from('hero_section')
        .select('*')
        .eq('id', 1)
        .single();

      if (heroData) {
        setHero(heroData);
        setHeroForm(heroData);
      }

      // Load stats
      const { data: statsData } = await supabase
        .from('hero_stats')
        .select('*')
        .eq('hero_id', 1)
        .order('sort_order');

      setStats(statsData || []);

    } catch (error) {
      console.error('Load error:', error);
      toast.error('ডাটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // ========== Image Upload ==========
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('ছবির সাইজ 2MB এর কম হতে হবে');
      return;
    }

    setUploadingImage(true);
    try {
      const fileName = `hero_${Date.now()}_${file.name}`;
      const filePath = `hero/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hero')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('hero')
        .getPublicUrl(filePath);

      setHeroForm(prev => ({ ...prev, image_url: publicUrl, image_path: filePath }));
      toast.success('ছবি আপলোড সফল হয়েছে');
    } catch (error) {
      toast.error('ছবি আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploadingImage(false);
    }
  };

  // ========== Hero Content Submit ==========
  const handleHeroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('hero_section')
        .upsert({
          id: 1,
          ...heroForm,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('হিরো সেকশন আপডেট হয়েছে');
      loadData();
    } catch (error) {
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  // ========== Stat Actions ==========
  const handleStatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingStat) {
        const { error } = await supabase
          .from('hero_stats')
          .update({
            ...statForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingStat.id);
        if (error) throw error;
        toast.success('পরিসংখ্যান আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('hero_stats')
          .insert([{
            ...statForm,
            hero_id: 1,
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
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStat = async (id: number) => {
    if (!confirm('এই পরিসংখ্যানটি মুছে ফেলতে চান?')) return;

    try {
      const { error } = await supabase
        .from('hero_stats')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('পরিসংখ্যান মুছে ফেলা হয়েছে');
      loadData();
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const moveStatUp = async (index: number) => {
    if (index === 0) return;
    
    const newStats = [...stats];
    [newStats[index - 1], newStats[index]] = [newStats[index], newStats[index - 1]];
    
    // Update sort_order in database
    for (let i = 0; i < newStats.length; i++) {
      await supabase
        .from('hero_stats')
        .update({ sort_order: i })
        .eq('id', newStats[i].id);
    }
    
    setStats(newStats);
    toast.success('ক্রম পরিবর্তন করা হয়েছে');
  };

  const moveStatDown = async (index: number) => {
    if (index === stats.length - 1) return;
    
    const newStats = [...stats];
    [newStats[index], newStats[index + 1]] = [newStats[index + 1], newStats[index]];
    
    // Update sort_order in database
    for (let i = 0; i < newStats.length; i++) {
      await supabase
        .from('hero_stats')
        .update({ sort_order: i })
        .eq('id', newStats[i].id);
    }
    
    setStats(newStats);
    toast.success('ক্রম পরিবর্তন করা হয়েছে');
  };

  const resetStatForm = () => {
    setStatForm({
      label: '',
      value: '',
      icon: '📊',
      sort_order: stats.length
    });
  };

  // Preview Component
  const HeroPreview = () => (
    <div className="bg-gray-100 rounded-xl p-6 border-2 border-dashed border-gray-300">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10">
        {/* Left Div */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {heroForm.name}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {heroForm.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {heroForm.button_one_text && (
              <button className={`${heroForm.button_one_color} text-white px-6 py-3 rounded-lg hover:opacity-90`}>
                {heroForm.button_one_text}
              </button>
            )}
            {heroForm.button_two_text && (
              <button className={`${heroForm.button_two_color} px-6 py-3 rounded-lg hover:bg-green-50`}>
                {heroForm.button_two_text}
              </button>
            )}
            {heroForm.button_three_text && (
              <button className={`${heroForm.button_three_color} text-white px-6 py-3 rounded-lg hover:opacity-90`}>
                {heroForm.button_three_text}
              </button>
            )}
          </div>

          {/* Stats Preview */}
          {stats.length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div key={stat.id} className="text-center">
                  <div className="text-2xl">{stat.icon}</div>
                  <div className="text-xl font-bold text-blue-600">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Div */}
        <div className="flex justify-center">
          {heroForm.image_url ? (
            <div className="relative w-[400px] h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={heroForm.image_url}
                alt={heroForm.name || 'Hero Image'}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-[400px] h-[400px] bg-gray-200 rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-20 h-20 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              হিরো সেকশন ব্যবস্থাপনা
            </h1>
            <div className="flex gap-3">
              <button
                onClick={() => setPreviewMode(!previewMode)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  previewMode 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {previewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {previewMode ? 'এডিট মোড' : 'প্রিভিউ মোড'}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mt-6 border-b">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === 'content'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              মূল কন্টেন্ট
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === 'stats'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              পরিসংখ্যান
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {previewMode ? (
          <HeroPreview />
        ) : (
          <>
            {/* Content Tab */}
            {activeTab === 'content' && (
              <form onSubmit={handleHeroSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">প্রোফাইল ছবি</h2>
                  <div className="flex items-start gap-6">
                    {heroForm.image_url ? (
                      <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                        <Image
                          src={heroForm.image_url}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (heroForm.image_path) {
                              await supabase.storage
                                .from('hero')
                                .remove([heroForm.image_path]);
                            }
                            setHeroForm(prev => ({ ...prev, image_url: null, image_path: null }));
                          }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="w-full"
                      />
                      {uploadingImage && (
                        <p className="text-sm text-green-600 mt-2">আপলোড হচ্ছে...</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        সর্বোচ্চ সাইজ: 2MB। প্রস্তাবিত সাইজ: 400x400 পিক্সেল।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Text Content */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                  <h2 className="text-lg font-semibold mb-4">মূল কন্টেন্ট</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      নাম *
                    </label>
                    <input
                      type="text"
                      value={heroForm.name}
                      onChange={(e) => setHeroForm({...heroForm, name: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      শিরোনাম *
                    </label>
                    <input
                      type="text"
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({...heroForm, title: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      বিবরণ *
                    </label>
                    <textarea
                      value={heroForm.description}
                      onChange={(e) => setHeroForm({...heroForm, description: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="bg-white rounded-lg shadow p-6 space-y-4">
                  <h2 className="text-lg font-semibold mb-4">বাটন সমূহ</h2>
                  
                  {/* Button 1 */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="col-span-2 font-medium text-gray-700">বাটন ১ (সবুজ)</h3>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">টেক্সট</label>
                      <input
                        type="text"
                        value={heroForm.button_one_text || ''}
                        onChange={(e) => setHeroForm({...heroForm, button_one_text: e.target.value})}
                        placeholder="যেমন: আমার সম্পর্কে"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">লিংক</label>
                      <input
                        type="text"
                        value={heroForm.button_one_link || ''}
                        onChange={(e) => setHeroForm({...heroForm, button_one_link: e.target.value})}
                        placeholder="যেমন: /about"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Button 2 */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="col-span-2 font-medium text-gray-700">বাটন ২ (আউটলাইন)</h3>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">টেক্সট</label>
                      <input
                        type="text"
                        value={heroForm.button_two_text || ''}
                        onChange={(e) => setHeroForm({...heroForm, button_two_text: e.target.value})}
                        placeholder="যেমন: যোগাযোগ করুন"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">লিংক</label>
                      <input
                        type="text"
                        value={heroForm.button_two_link || ''}
                        onChange={(e) => setHeroForm({...heroForm, button_two_link: e.target.value})}
                        placeholder="যেমন: /contact"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Button 3 */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <h3 className="col-span-2 font-medium text-gray-700">বাটন ৩ (লাল)</h3>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">টেক্সট</label>
                      <input
                        type="text"
                        value={heroForm.button_three_text || ''}
                        onChange={(e) => setHeroForm({...heroForm, button_three_text: e.target.value})}
                        placeholder="যেমন: সহযোগী হোন"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">লিংক</label>
                      <input
                        type="text"
                        value={heroForm.button_three_link || ''}
                        onChange={(e) => setHeroForm({...heroForm, button_three_link: e.target.value})}
                        placeholder="যেমন: /volunteer"
                        className="w-full px-3 py-2 border rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={heroForm.is_active}
                        onChange={(e) => setHeroForm({...heroForm, is_active: e.target.checked})}
                        className="w-4 h-4 text-green-600 rounded"
                      />
                      <span className="text-sm text-gray-700">সক্রিয়</span>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>সেভ হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>সেভ করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b flex justify-between items-center">
                  <h2 className="text-xl font-bold">পরিসংখ্যান</h2>
                  <button
                    onClick={() => {
                      resetStatForm();
                      setEditingStat(null);
                      setShowStatModal(true);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    নতুন পরিসংখ্যান
                  </button>
                </div>
                <div className="p-6">
                  {stats.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">কোনো পরিসংখ্যান নেই</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {stats.map((stat, index) => (
                        <div
                          key={stat.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-2xl">{stat.icon}</span>
                            <div>
                              <div className="font-semibold">{stat.label}</div>
                              <div className="text-sm text-gray-500">{stat.value}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => moveStatUp(index)}
                              disabled={index === 0}
                              className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                            >
                              <MoveUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveStatDown(index)}
                              disabled={index === stats.length - 1}
                              className="p-1 text-gray-600 hover:bg-gray-200 rounded disabled:opacity-30"
                            >
                              <MoveDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingStat(stat);
                                setStatForm(stat);
                                setShowStatModal(true);
                              }}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteStat(stat.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Stat Modal */}
      {showStatModal && (
        <Modal
          title={editingStat ? 'পরিসংখ্যান সম্পাদনা' : 'নতুন পরিসংখ্যান'}
          onClose={() => {
            setShowStatModal(false);
            setEditingStat(null);
            resetStatForm();
          }}
          onSubmit={handleStatSubmit}
          submitting={submitting}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                আইকন
              </label>
              <input
                type="text"
                value={statForm.icon || ''}
                onChange={(e) => setStatForm({...statForm, icon: e.target.value})}
                placeholder="যেমন: 📅"
                className="w-full px-3 py-2 border rounded-lg"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                লেবেল *
              </label>
              <input
                type="text"
                required
                value={statForm.label}
                onChange={(e) => setStatForm({...statForm, label: e.target.value})}
                placeholder="যেমন: রাজনৈতিক জীবনের বছর"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                মান *
              </label>
              <input
                type="text"
                required
                value={statForm.value}
                onChange={(e) => setStatForm({...statForm, value: e.target.value})}
                placeholder="যেমন: ১৫+"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Reusable Modal Component
function Modal({ title, children, onClose, onSubmit, submitting }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          {onSubmit ? (
            <form onSubmit={onSubmit} className="space-y-4">
              {children}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>সেভ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>সেভ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {children}
              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}