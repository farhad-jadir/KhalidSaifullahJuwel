// khalid/src/app/admin/achievements/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { 
  Award, 
  Star, 
  TrendingUp, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  Save,
  X,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon
} from 'lucide-react';

// ========== Supabase ক্লায়েন্ট ==========
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ========== টাইপ ডিফিনেশন ==========
interface AchievementCategory {
  id?: number;
  name: string;
  icon: string;
  description?: string | null;
  sort_order?: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

interface Achievement {
  id?: number;
  category_id: number;
  title: string;
  description: string;
  year: string;
  impact: string;
  icon?: string;
  image_url?: string | null;
  image_path?: string | null;
  sort_order?: number;
  is_featured?: boolean;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

interface AchievementStat {
  id?: number;
  label: string;
  value: string;
  icon?: string;
  description?: string | null;
  sort_order?: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}

interface AchievementRecognition {
  id?: number;
  title: string;
  organization: string;
  year: string;
  icon?: string;
  description?: string | null;
  image_url?: string | null;
  image_path?: string | null;
  sort_order?: number;
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

interface PersonalInfo {
  id: number;
  name: string;
  title: string;
  designation: string;
  description: string;
  image_url?: string | null;
  image_path?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  social_links?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  } | null;
  updated_at?: string;
  updated_by?: string;
}

export default function AdminAchievementsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Data states
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [categories, setCategories] = useState<AchievementCategory[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStat[]>([]);
  const [recognitions, setRecognitions] = useState<AchievementRecognition[]>([]);
  
  // Modal states
  const [activeTab, setActiveTab] = useState<'personal' | 'categories' | 'achievements' | 'stats' | 'recognitions'>('personal');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [showStatModal, setShowStatModal] = useState(false);
  const [showRecognitionModal, setShowRecognitionModal] = useState(false);
  const [showPersonalModal, setShowPersonalModal] = useState(false);
  
  // Editing states
  const [editingCategory, setEditingCategory] = useState<AchievementCategory | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [editingStat, setEditingStat] = useState<AchievementStat | null>(null);
  const [editingRecognition, setEditingRecognition] = useState<AchievementRecognition | null>(null);
  
  // Expanded categories for UI
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  // ========== ফর্ম স্টেট ==========
  const [categoryForm, setCategoryForm] = useState<Partial<AchievementCategory>>({
    name: '',
    icon: '🏛️',
    description: '',
    sort_order: 0,
    status: 'active'
  });

  const [achievementForm, setAchievementForm] = useState<Partial<Achievement>>({
    category_id: 0,
    title: '',
    description: '',
    year: '',
    impact: '',
    icon: '🏆',
    sort_order: 0,
    is_featured: false,
    status: 'active',
    image_url: null,
    image_path: null
  });

  const [statForm, setStatForm] = useState<Partial<AchievementStat>>({
    label: '',
    value: '',
    icon: '📊',
    description: '',
    sort_order: 0,
    status: 'active'
  });

  const [recognitionForm, setRecognitionForm] = useState<Partial<AchievementRecognition>>({
    title: '',
    organization: '',
    year: '',
    icon: '⭐',
    description: '',
    sort_order: 0,
    status: 'active',
    image_url: null,
    image_path: null
  });

  const [personalForm, setPersonalForm] = useState<Partial<PersonalInfo>>({
    name: '',
    title: '',
    designation: '',
    description: '',
    email: '',
    phone: '',
    address: '',
    social_links: {},
    image_url: null,
    image_path: null
  });

  // ========== useEffect ==========
  useEffect(() => {
    checkAuth();
  }, []);

  // ========== Auth Check ==========
  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        toast.error('দয়া করে লগইন করুন');
        return;
      }

      setIsAuthenticated(true);
      loadAllData();
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/login');
    }
  };

  // ========== Load All Data ==========
  const loadAllData = async () => {
    try {
      setLoading(true);

      // Load personal info
      const { data: personalData } = await supabase
        .from('achievement_personal_info')
        .select('*')
        .eq('id', 1)
        .single();

      if (personalData) setPersonalInfo(personalData);

      // Load categories
      const { data: categoriesData } = await supabase
        .from('achievement_categories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (categoriesData) setCategories(categoriesData);

      // Load achievements
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .order('sort_order', { ascending: true });

      if (achievementsData) setAchievements(achievementsData);

      // Load stats
      const { data: statsData } = await supabase
        .from('achievement_stats')
        .select('*')
        .order('sort_order', { ascending: true });

      if (statsData) setStats(statsData);

      // Load recognitions
      const { data: recognitionsData } = await supabase
        .from('achievement_recognitions')
        .select('*')
        .order('sort_order', { ascending: true });

      if (recognitionsData) setRecognitions(recognitionsData);

    } catch (error) {
      console.error('Load error:', error);
      toast.error('ডাটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // ========== Image Upload ==========
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'personal' | 'achievement' | 'recognition'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('ছবির সাইজ 5MB এর কম হতে হবে');
      return;
    }

    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `achievements/${type}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('achievements')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('achievements')
        .getPublicUrl(filePath);

      if (type === 'personal') {
        setPersonalForm(prev => ({ ...prev, image_url: publicUrl, image_path: filePath }));
      } else if (type === 'achievement') {
        setAchievementForm(prev => ({ ...prev, image_url: publicUrl, image_path: filePath }));
      } else if (type === 'recognition') {
        setRecognitionForm(prev => ({ ...prev, image_url: publicUrl, image_path: filePath }));
      }

      toast.success('ছবি আপলোড সফল হয়েছে');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('ছবি আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploadingImage(false);
    }
  };

  // ========== Category CRUD ==========
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!categoryForm.name?.trim()) {
        toast.error('নাম দিন');
        return;
      }

      if (editingCategory) {
        const { error } = await supabase
          .from('achievement_categories')
          .update({
            ...categoryForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast.success('ক্যাটাগরি আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('achievement_categories')
          .insert([{
            ...categoryForm,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('নতুন ক্যাটাগরি যোগ হয়েছে');
      }

      setShowCategoryModal(false);
      setEditingCategory(null);
      resetCategoryForm();
      loadAllData();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCategoryDelete = async (id: number) => {
    if (!confirm('এই ক্যাটাগরি ও এর সব অর্জন মুছে ফেলতে চান?')) return;

    try {
      const { error } = await supabase
        .from('achievement_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('ক্যাটাগরি মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Achievement CRUD ==========
  const handleAchievementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!achievementForm.category_id) {
        toast.error('ক্যাটাগরি নির্বাচন করুন');
        return;
      }
      if (!achievementForm.title?.trim()) {
        toast.error('শিরোনাম দিন');
        return;
      }
      if (!achievementForm.description?.trim()) {
        toast.error('বিবরণ দিন');
        return;
      }

      const { data: userData } = await supabase.auth.getUser();

      if (editingAchievement) {
        const { error } = await supabase
          .from('achievements')
          .update({
            ...achievementForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingAchievement.id);

        if (error) throw error;
        toast.success('অর্জন আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('achievements')
          .insert([{
            ...achievementForm,
            created_by: userData.user?.id,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('নতুন অর্জন যোগ হয়েছে');
      }

      setShowAchievementModal(false);
      setEditingAchievement(null);
      resetAchievementForm();
      loadAllData();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAchievementDelete = async (id: number, imagePath?: string | null) => {
    if (!confirm('এই অর্জনটি মুছে ফেলতে চান?')) return;

    try {
      if (imagePath) {
        await supabase.storage
          .from('achievements')
          .remove([imagePath]);
      }

      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('অর্জন মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Stat CRUD ==========
  const handleStatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!statForm.label?.trim()) {
        toast.error('লেবেল দিন');
        return;
      }
      if (!statForm.value?.trim()) {
        toast.error('মান দিন');
        return;
      }

      if (editingStat) {
        const { error } = await supabase
          .from('achievement_stats')
          .update({
            ...statForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingStat.id);

        if (error) throw error;
        toast.success('পরিসংখ্যান আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('achievement_stats')
          .insert([{
            ...statForm,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('নতুন পরিসংখ্যান যোগ হয়েছে');
      }

      setShowStatModal(false);
      setEditingStat(null);
      resetStatForm();
      loadAllData();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatDelete = async (id: number) => {
    if (!confirm('এই পরিসংখ্যানটি মুছে ফেলতে চান?')) return;

    try {
      const { error } = await supabase
        .from('achievement_stats')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('পরিসংখ্যান মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Recognition CRUD ==========
  const handleRecognitionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!recognitionForm.title?.trim()) {
        toast.error('শিরোনাম দিন');
        return;
      }
      if (!recognitionForm.organization?.trim()) {
        toast.error('প্রতিষ্ঠানের নাম দিন');
        return;
      }
      if (!recognitionForm.year?.trim()) {
        toast.error('সাল দিন');
        return;
      }

      const { data: userData } = await supabase.auth.getUser();

      if (editingRecognition) {
        const { error } = await supabase
          .from('achievement_recognitions')
          .update({
            ...recognitionForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingRecognition.id);

        if (error) throw error;
        toast.success('স্বীকৃতি আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('achievement_recognitions')
          .insert([{
            ...recognitionForm,
            created_by: userData.user?.id,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('নতুন স্বীকৃতি যোগ হয়েছে');
      }

      setShowRecognitionModal(false);
      setEditingRecognition(null);
      resetRecognitionForm();
      loadAllData();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRecognitionDelete = async (id: number, imagePath?: string | null) => {
    if (!confirm('এই স্বীকৃতিটি মুছে ফেলতে চান?')) return;

    try {
      if (imagePath) {
        await supabase.storage
          .from('achievements')
          .remove([imagePath]);
      }

      const { error } = await supabase
        .from('achievement_recognitions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('স্বীকৃতি মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Personal Info Update ==========
  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!personalForm.name?.trim()) {
        toast.error('নাম দিন');
        return;
      }
      if (!personalForm.title?.trim()) {
        toast.error('শিরোনাম দিন');
        return;
      }

      const { data: userData } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('achievement_personal_info')
        .upsert({
          id: 1,
          ...personalForm,
          updated_by: userData.user?.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success('ব্যক্তিগত তথ্য আপডেট হয়েছে');
      setShowPersonalModal(false);
      loadAllData();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  // ========== Reset Forms ==========
  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      icon: '🏛️',
      description: '',
      sort_order: 0,
      status: 'active'
    });
  };

  const resetAchievementForm = () => {
    setAchievementForm({
      category_id: 0,
      title: '',
      description: '',
      year: '',
      impact: '',
      icon: '🏆',
      sort_order: 0,
      is_featured: false,
      status: 'active',
      image_url: null,
      image_path: null
    });
  };

  const resetStatForm = () => {
    setStatForm({
      label: '',
      value: '',
      icon: '📊',
      description: '',
      sort_order: 0,
      status: 'active'
    });
  };

  const resetRecognitionForm = () => {
    setRecognitionForm({
      title: '',
      organization: '',
      year: '',
      icon: '⭐',
      description: '',
      sort_order: 0,
      status: 'active',
      image_url: null,
      image_path: null
    });
  };

  // ========== Toggle Category Expand ==========
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // ========== Get Category Name ==========
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown';
  };

  // ========== Loading State ==========
  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600 font-bangla">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // ========== Main Render ==========
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900 font-bangla mb-4">
            অর্জন ব্যবস্থাপনা
          </h1>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-4 py-2 font-bangla transition-colors relative ${
                activeTab === 'personal'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="inline w-4 h-4 mr-2" />
              ব্যক্তিগত তথ্য
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 font-bangla transition-colors relative ${
                activeTab === 'categories'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Award className="inline w-4 h-4 mr-2" />
              ক্যাটাগরি
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-2 font-bangla transition-colors relative ${
                activeTab === 'achievements'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Star className="inline w-4 h-4 mr-2" />
              অর্জনসমূহ
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 font-bangla transition-colors relative ${
                activeTab === 'stats'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <TrendingUp className="inline w-4 h-4 mr-2" />
              পরিসংখ্যান
            </button>
            <button
              onClick={() => setActiveTab('recognitions')}
              className={`px-4 py-2 font-bangla transition-colors relative ${
                activeTab === 'recognitions'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Award className="inline w-4 h-4 mr-2" />
              স্বীকৃতি
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold font-bangla">ব্যক্তিগত তথ্য</h2>
              <button
                onClick={() => {
                  setPersonalForm(personalInfo || {});
                  setShowPersonalModal(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bangla flex items-center gap-2"
              >
                <Edit size={18} />
                <span>সম্পাদনা</span>
              </button>
            </div>
            <div className="p-6">
              {personalInfo && (
                <div className="flex flex-col md:flex-row gap-8">
                  {personalInfo.image_url && (
                    <div className="md:w-1/4">
                      <div className="relative h-48 w-48 rounded-lg overflow-hidden">
                        <Image
                          src={personalInfo.image_url}
                          alt={personalInfo.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{personalInfo.name}</h3>
                    <p className="text-green-600 font-semibold mb-4">{personalInfo.title}</p>
                    <p className="text-gray-600 mb-6">{personalInfo.description}</p>
                    
                    {(personalInfo.email || personalInfo.phone || personalInfo.address) && (
                      <div className="space-y-2">
                        {personalInfo.email && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail size={16} />
                            <span>{personalInfo.email}</span>
                          </div>
                        )}
                        {personalInfo.phone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone size={16} />
                            <span>{personalInfo.phone}</span>
                          </div>
                        )}
                        {personalInfo.address && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={16} />
                            <span>{personalInfo.address}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold font-bangla">ক্যাটাগরি সমূহ</h2>
              <button
                onClick={() => {
                  resetCategoryForm();
                  setEditingCategory(null);
                  setShowCategoryModal(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bangla flex items-center gap-2"
              >
                <Plus size={18} />
                <span>নতুন ক্যাটাগরি</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {categories.map((category) => (
                  <div key={category.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{category.icon}</span>
                        <div>
                          <h3 className="font-semibold text-lg">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-500">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCategory(category.id!)}
                          className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                          {expandedCategories.includes(category.id!) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingCategory(category);
                            setCategoryForm(category);
                            setShowCategoryModal(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleCategoryDelete(category.id!)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Category Achievements */}
                    {expandedCategories.includes(category.id!) && (
                      <div className="mt-4 pl-8">
                        <h4 className="font-medium mb-2">এই ক্যাটাগরির অর্জনসমূহ:</h4>
                        {achievements.filter(a => a.category_id === category.id).length === 0 ? (
                          <p className="text-sm text-gray-400">কোনো অর্জন নেই</p>
                        ) : (
                          <div className="space-y-2">
                            {achievements
                              .filter(a => a.category_id === category.id)
                              .map(achievement => (
                                <div key={achievement.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                                  <div>
                                    <span className="font-medium">{achievement.title}</span>
                                    <span className="text-sm text-gray-500 ml-2">({achievement.year})</span>
                                  </div>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    achievement.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                  }`}>
                                    {achievement.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold font-bangla">অর্জন সমূহ</h2>
              <button
                onClick={() => {
                  resetAchievementForm();
                  setEditingAchievement(null);
                  setShowAchievementModal(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bangla flex items-center gap-2"
              >
                <Plus size={18} />
                <span>নতুন অর্জন</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        {achievement.image_url ? (
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                            <Image
                              src={achievement.image_url}
                              alt={achievement.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                            {achievement.icon || '🏆'}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{achievement.title}</h3>
                          <p className="text-sm text-gray-500 mb-1">{achievement.description}</p>
                          <p className="text-sm text-green-600 mb-1">{achievement.impact}</p>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {achievement.year}
                            </span>
                            <span className="text-gray-500">
                              ক্যাটাগরি: {getCategoryName(achievement.category_id)}
                            </span>
                            {achievement.is_featured && (
                              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                বৈশিষ্ট্যযুক্ত
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingAchievement(achievement);
                            setAchievementForm(achievement);
                            setShowAchievementModal(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleAchievementDelete(achievement.id!, achievement.image_path)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold font-bangla">পরিসংখ্যান</h2>
              <button
                onClick={() => {
                  resetStatForm();
                  setEditingStat(null);
                  setShowStatModal(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bangla flex items-center gap-2"
              >
                <Plus size={18} />
                <span>নতুন পরিসংখ্যান</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {stats.map((stat) => (
                  <div key={stat.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{stat.icon}</span>
                        <div>
                          <h3 className="font-semibold text-lg">{stat.label}</h3>
                          <p className="text-2xl font-bold text-green-600">{stat.value}</p>
                          {stat.description && (
                            <p className="text-sm text-gray-500">{stat.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingStat(stat);
                            setStatForm(stat);
                            setShowStatModal(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleStatDelete(stat.id!)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recognitions Tab */}
        {activeTab === 'recognitions' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold font-bangla">স্বীকৃতি সমূহ</h2>
              <button
                onClick={() => {
                  resetRecognitionForm();
                  setEditingRecognition(null);
                  setShowRecognitionModal(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bangla flex items-center gap-2"
              >
                <Plus size={18} />
                <span>নতুন স্বীকৃতি</span>
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {recognitions.map((recognition) => (
                  <div key={recognition.id} className="border rounded-lg p-4">
                    <div className="text-center">
                      {recognition.image_url ? (
                        <div className="relative h-20 w-20 mx-auto mb-3 rounded-full overflow-hidden">
                          <Image
                            src={recognition.image_url}
                            alt={recognition.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="text-4xl mb-3">{recognition.icon || '⭐'}</div>
                      )}
                      <h3 className="font-semibold text-lg mb-1">{recognition.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">{recognition.organization}</p>
                      <p className="text-xs text-gray-500 mb-3">{recognition.year}</p>
                      {recognition.description && (
                        <p className="text-xs text-gray-400 mb-3">{recognition.description}</p>
                      )}
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingRecognition(recognition);
                            setRecognitionForm(recognition);
                            setShowRecognitionModal(true);
                          }}
                          className="p-1 hover:bg-gray-100 rounded-lg text-blue-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleRecognitionDelete(recognition.id!, recognition.image_path)}
                          className="p-1 hover:bg-gray-100 rounded-lg text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <Modal
          title={editingCategory ? 'ক্যাটাগরি সম্পাদনা' : 'নতুন ক্যাটাগরি'}
          onClose={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
            resetCategoryForm();
          }}
          onSubmit={handleCategorySubmit}
          submitting={submitting}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                আইকন
              </label>
              <input
                type="text"
                value={categoryForm.icon}
                onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="যেমন: 🏛️"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                নাম *
              </label>
              <input
                type="text"
                required
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="যেমন: রাজনৈতিক অর্জন"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                বিবরণ
              </label>
              <textarea
                value={categoryForm.description || ''}
                onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="ক্যাটাগরির বিবরণ লিখুন..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                  ক্রম
                </label>
                <input
                  type="number"
                  value={categoryForm.sort_order || 0}
                  onChange={(e) => setCategoryForm({...categoryForm, sort_order: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                  অবস্থা
                </label>
                <select
                  value={categoryForm.status}
                  onChange={(e) => setCategoryForm({...categoryForm, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                >
                  <option value="active">সক্রিয়</option>
                  <option value="inactive">নিষ্ক্রিয়</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Achievement Modal */}
      {showAchievementModal && (
        <Modal
          title={editingAchievement ? 'অর্জন সম্পাদনা' : 'নতুন অর্জন'}
          onClose={() => {
            setShowAchievementModal(false);
            setEditingAchievement(null);
            resetAchievementForm();
          }}
          onSubmit={handleAchievementSubmit}
          submitting={submitting}
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-bangla">
                ছবি
              </label>
              <div className="space-y-3">
                {achievementForm.image_url && (
                  <div className="relative h-32 w-32 rounded-lg overflow-hidden border">
                    <Image
                      src={achievementForm.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (achievementForm.image_path) {
                          await supabase.storage
                            .from('achievements')
                            .remove([achievementForm.image_path]);
                        }
                        setAchievementForm(prev => ({ ...prev, image_url: null, image_path: null }));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'achievement')}
                  disabled={uploadingImage}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {uploadingImage && (
                  <p className="text-sm text-green-600">আপলোড হচ্ছে...</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                ক্যাটাগরি *
              </label>
              <select
                required
                value={achievementForm.category_id}
                onChange={(e) => setAchievementForm({...achievementForm, category_id: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
              >
                <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                শিরোনাম *
              </label>
              <input
                type="text"
                required
                value={achievementForm.title}
                onChange={(e) => setAchievementForm({...achievementForm, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="যেমন: এনসিপি কেন্দ্রীয় সদস্য"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                বিবরণ *
              </label>
              <textarea
                required
                value={achievementForm.description}
                onChange={(e) => setAchievementForm({...achievementForm, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="অর্জনের বিবরণ লিখুন..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                সাল *
              </label>
              <input
                type="text"
                required
                value={achievementForm.year}
                onChange={(e) => setAchievementForm({...achievementForm, year: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="যেমন: ২০২৫-বর্তমান"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                অর্জন/প্রভাব *
              </label>
              <textarea
                required
                value={achievementForm.impact}
                onChange={(e) => setAchievementForm({...achievementForm, impact: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="অর্জনের প্রভাব লিখুন..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                  আইকন
                </label>
                <input
                  type="text"
                  value={achievementForm.icon || '🏆'}
                  onChange={(e) => setAchievementForm({...achievementForm, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                  ক্রম
                </label>
                <input
                  type="number"
                  value={achievementForm.sort_order || 0}
                  onChange={(e) => setAchievementForm({...achievementForm, sort_order: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={achievementForm.is_featured || false}
                  onChange={(e) => setAchievementForm({...achievementForm, is_featured: e.target.checked})}
                  className="h-4 w-4 text-green-600 rounded"
                />
                <label className="text-sm text-gray-700 font-bangla">বৈশিষ্ট্যযুক্ত</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                  অবস্থা
                </label>
                <select
                  value={achievementForm.status}
                  onChange={(e) => setAchievementForm({...achievementForm, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                >
                  <option value="active">সক্রিয়</option>
                  <option value="inactive">নিষ্ক্রিয়</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      )}

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
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                আইকন
              </label>
              <input
                type="text"
                value={statForm.icon}
                onChange={(e) => setStatForm({...statForm, icon: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="যেমন: 📊"
                maxLength={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                লেবেল *
              </label>
              <input
                type="text"
                required
                value={statForm.label}
                onChange={(e) => setStatForm({...statForm, label: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="যেমন: রাজনৈতিক জীবনের বছর"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                মান *
              </label>
              <input
                type="text"
                required
                value={statForm.value}
                onChange={(e) => setStatForm({...statForm, value: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="যেমন: ১৫+"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                বিবরণ
              </label>
              <input
                type="text"
                value={statForm.description || ''}
                onChange={(e) => setStatForm({...statForm, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="ঐচ্ছিক"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                  ক্রম
                </label>
                <input
                  type="number"
                  value={statForm.sort_order || 0}
                  onChange={(e) => setStatForm({...statForm, sort_order: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                  অবস্থা
                </label>
                <select
                  value={statForm.status}
                  onChange={(e) => setStatForm({...statForm, status: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                >
                  <option value="active">সক্রিয়</option>
                  <option value="inactive">নিষ্ক্রিয়</option>
                </select>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Recognition Modal */}
      {showRecognitionModal && (
        <Modal
          title={editingRecognition ? 'স্বীকৃতি সম্পাদনা' : 'নতুন স্বীকৃতি'}
          onClose={() => {
            setShowRecognitionModal(false);
            setEditingRecognition(null);
            resetRecognitionForm();
          }}
          onSubmit={handleRecognitionSubmit}
          submitting={submitting}
        >
          <div className="space-y-4">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-bangla">
                ছবি
              </label>
              <div className="space-y-3">
                {recognitionForm.image_url && (
                  <div className="relative h-32 w-32 rounded-lg overflow-hidden border">
                    <Image
                      src={recognitionForm.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (recognitionForm.image_path) {
                          await supabase.storage
                            .from('achievements')
                            .remove([recognitionForm.image_path]);
                        }
                        setRecognitionForm(prev => ({ ...prev, image_url: null, image_path: null }));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'recognition')}
                  disabled={uploadingImage}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {uploadingImage && (
                  <p className="text-sm text-green-600">আপলোড হচ্ছে...</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                শিরোনাম *
              </label>
              <input
                type="text"
                required
                value={recognitionForm.title}
                onChange={(e) => setRecognitionForm({...recognitionForm, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="যেমন: বিশিষ্ট যুব নেতা"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                প্রতিষ্ঠান/সংস্থা *
              </label>
              <input
                type="text"
                required
                value={recognitionForm.organization}
                onChange={(e) => setRecognitionForm({...recognitionForm, organization: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="যেমন: জাতীয় নাগরিক পার্টি"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                সাল *
              </label>
              <input
                type="text"
                required
                value={recognitionForm.year}
                onChange={(e) => setRecognitionForm({...recognitionForm, year: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="যেমন: ২০২৫"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                বিবরণ
              </label>
              <textarea
                value={recognitionForm.description || ''}
                onChange={(e) => setRecognitionForm({...recognitionForm, description: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="ঐচ্ছিক"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                  আইকন
                </label>
                <input
                  type="text"
                  value={recognitionForm.icon || '⭐'}
                  onChange={(e) => setRecognitionForm({...recognitionForm, icon: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  maxLength={2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                  ক্রম
                </label>
                <input
                  type="number"
                  value={recognitionForm.sort_order || 0}
                  onChange={(e) => setRecognitionForm({...recognitionForm, sort_order: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                অবস্থা
              </label>
              <select
                value={recognitionForm.status}
                onChange={(e) => setRecognitionForm({...recognitionForm, status: e.target.value as any})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
              >
                <option value="active">সক্রিয়</option>
                <option value="inactive">নিষ্ক্রিয়</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* Personal Info Modal */}
      {showPersonalModal && (
        <Modal
          title="ব্যক্তিগত তথ্য সম্পাদনা"
          onClose={() => {
            setShowPersonalModal(false);
            setPersonalForm(personalInfo || {});
          }}
          onSubmit={handlePersonalSubmit}
          submitting={submitting}
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-bangla">
                প্রোফাইল ছবি
              </label>
              <div className="space-y-3">
                {personalForm.image_url && (
                  <div className="relative h-32 w-32 rounded-lg overflow-hidden border">
                    <Image
                      src={personalForm.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        if (personalForm.image_path) {
                          await supabase.storage
                            .from('achievements')
                            .remove([personalForm.image_path]);
                        }
                        setPersonalForm(prev => ({ ...prev, image_url: null, image_path: null }));
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'personal')}
                  disabled={uploadingImage}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                নাম *
              </label>
              <input
                type="text"
                required
                value={personalForm.name}
                onChange={(e) => setPersonalForm({...personalForm, name: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="খালেদ সাইফুল্লাহ জুয়েল"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                শিরোনাম *
              </label>
              <input
                type="text"
                required
                value={personalForm.title}
                onChange={(e) => setPersonalForm({...personalForm, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="জাতীয় নাগরিক পার্টি (এনসিপি) - কেন্দ্রীয় সদস্য"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                পদবী
              </label>
              <input
                type="text"
                value={personalForm.designation || ''}
                onChange={(e) => setPersonalForm({...personalForm, designation: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="কেন্দ্রীয় সদস্য, জাতীয় নাগরিক পার্টি"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                বিবরণ *
              </label>
              <textarea
                required
                value={personalForm.description}
                onChange={(e) => setPersonalForm({...personalForm, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="ব্যক্তিগত বিবরণ লিখুন..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                ইমেইল
              </label>
              <input
                type="email"
                value={personalForm.email || ''}
                onChange={(e) => setPersonalForm({...personalForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                ফোন
              </label>
              <input
                type="text"
                value={personalForm.phone || ''}
                onChange={(e) => setPersonalForm({...personalForm, phone: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="+880 1XXX-XXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                ঠিকানা
              </label>
              <textarea
                value={personalForm.address || ''}
                onChange={(e) => setPersonalForm({...personalForm, address: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md font-bangla"
                placeholder="ঠিকানা লিখুন..."
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ========== Modal Component ==========
interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  submitting?: boolean;
}

function Modal({ title, children, onClose, onSubmit, submitting }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold font-bangla">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-4">
            {children}
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-bangla"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 font-bangla flex items-center gap-2"
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
  );
}