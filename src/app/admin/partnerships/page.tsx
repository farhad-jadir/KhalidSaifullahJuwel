// khalid/src/app/admin/partnerships/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { 
  Users, Building, Globe, Mail, Phone, MapPin, Calendar,
  Edit, Trash2, Plus, Save, X, ChevronDown, ChevronUp,
  Star, Award, Heart, BookOpen, Video, Newspaper,
  Filter, Search, RefreshCw, Upload, Link as LinkIcon,
  Twitter, Facebook, Linkedin, Instagram, Youtube
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ========== টাইপ ডিফিনেশন ==========
interface PartnershipCategory {
  id: number;
  name: string;
  icon: string;
  description: string | null;
  sort_order: number;
  status: 'active' | 'inactive';
}

interface Partnership {
  id: number;
  category_id: number;
  name: string;
  logo: string;
  type: string;
  since: string;
  description: string;
  website: string | null;
  image_url: string | null;
  image_path: string | null;
  sort_order: number;
  is_featured: boolean;
  status: 'active' | 'inactive';
  contact_person: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
}

interface CollaborationType {
  id: number;
  name: string;
  count: string;
  color: string;
  sort_order: number;
  status: 'active' | 'inactive';
}

interface PartnershipStat {
  id: number;
  label: string;
  value: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
  status: 'active' | 'inactive';
}

// ========== মডাল প্রপস ==========
interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => Promise<void>;
  submitting?: boolean;
}

export default function AdminPartnershipsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'categories' | 'partnerships' | 'collaboration' | 'stats'>('partnerships');
  
  // Data states
  const [categories, setCategories] = useState<PartnershipCategory[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [collaborationTypes, setCollaborationTypes] = useState<CollaborationType[]>([]);
  const [stats, setStats] = useState<PartnershipStat[]>([]); // ← এইটা স্টেট
  
  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);
  const [showCollaborationModal, setShowCollaborationModal] = useState(false);
  const [showStatModal, setShowStatModal] = useState(false);
  
  // Selected items for editing
  const [editingCategory, setEditingCategory] = useState<PartnershipCategory | null>(null);
  const [editingPartnership, setEditingPartnership] = useState<Partnership | null>(null);
  const [editingCollaboration, setEditingCollaboration] = useState<CollaborationType | null>(null);
  const [editingStat, setEditingStat] = useState<PartnershipStat | null>(null);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // ========== ফর্ম স্টেট ==========
  const [categoryForm, setCategoryForm] = useState<Partial<PartnershipCategory>>({
    name: '',
    icon: '🤝',
    description: '',
    sort_order: 0,
    status: 'active'
  });
  
  const [partnershipForm, setPartnershipForm] = useState<Partial<Partnership>>({
    category_id: 0,
    name: '',
    logo: '🏛️',
    type: '',
    since: '',
    description: '',
    website: '',
    image_url: null,
    image_path: null,
    sort_order: 0,
    is_featured: false,
    status: 'active',
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    address: ''
  });
  
  const [collaborationForm, setCollaborationForm] = useState<Partial<CollaborationType>>({
    name: '',
    count: '',
    color: 'bg-blue-100 text-blue-800',
    sort_order: 0,
    status: 'active'
  });
  
  const [statForm, setStatForm] = useState<Partial<PartnershipStat>>({
    label: '',
    value: '',
    icon: '🤝',
    description: '',
    sort_order: 0,
    status: 'active'
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
      loadAllData();
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/login');
    }
  };

  const loadAllData = async () => {
    try {
      setLoading(true);

      // Load categories
      const { data: categoriesData } = await supabase
        .from('partnership_categories')
        .select('*')
        .order('sort_order');
      setCategories(categoriesData || []);

      // Load partnerships
      const { data: partnershipsData } = await supabase
        .from('partnerships')
        .select('*')
        .order('sort_order');
      setPartnerships(partnershipsData || []);

      // Load collaboration types
      const { data: collaborationData } = await supabase
        .from('collaboration_types')
        .select('*')
        .order('sort_order');
      setCollaborationTypes(collaborationData || []);

      // Load stats
      const { data: statsData } = await supabase
        .from('partnership_stats')
        .select('*')
        .order('sort_order');
      setStats(statsData || []); // ← স্টেট আপডেট

    } catch (error) {
      console.error('Load error:', error);
      toast.error('ডাটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // ========== Category Actions ==========
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('partnership_categories')
          .update({
            ...categoryForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCategory.id);
        if (error) throw error;
        toast.success('ক্যাটাগরি আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('partnership_categories')
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
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('এই ক্যাটাগরি এবং এর সব পার্টনার মুছে ফেলতে চান?')) return;

    try {
      const { error } = await supabase
        .from('partnership_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('ক্যাটাগরি মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Partnership Actions ==========
  const handlePartnershipImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('ছবির সাইজ 2MB এর কম হতে হবে');
      return;
    }

    setUploadingImage(true);
    try {
      const fileName = `partner_${Date.now()}_${file.name}`;
      const filePath = `partnerships/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('partnerships')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('partnerships')
        .getPublicUrl(filePath);

      setPartnershipForm(prev => ({ ...prev, image_url: publicUrl, image_path: filePath }));
      toast.success('ছবি আপলোড সফল হয়েছে');
    } catch (error) {
      toast.error('ছবি আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePartnershipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (editingPartnership) {
        const { error } = await supabase
          .from('partnerships')
          .update({
            ...partnershipForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPartnership.id);
        if (error) throw error;
        toast.success('পার্টনার আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('partnerships')
          .insert([{
            ...partnershipForm,
            created_by: user?.id,
            created_at: new Date().toISOString()
          }]);
        if (error) throw error;
        toast.success('নতুন পার্টনার যোগ হয়েছে');
      }

      setShowPartnershipModal(false);
      setEditingPartnership(null);
      resetPartnershipForm();
      loadAllData();
    } catch (error) {
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const deletePartnership = async (id: number, imagePath?: string | null) => {
    if (!confirm('এই পার্টনারটি মুছে ফেলতে চান?')) return;

    try {
      if (imagePath) {
        await supabase.storage.from('partnerships').remove([imagePath]);
      }

      const { error } = await supabase
        .from('partnerships')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('পার্টনার মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Collaboration Type Actions ==========
  const handleCollaborationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingCollaboration) {
        const { error } = await supabase
          .from('collaboration_types')
          .update({
            ...collaborationForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCollaboration.id);
        if (error) throw error;
        toast.success('সহযোগিতার ধরন আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('collaboration_types')
          .insert([{
            ...collaborationForm,
            created_at: new Date().toISOString()
          }]);
        if (error) throw error;
        toast.success('নতুন সহযোগিতার ধরন যোগ হয়েছে');
      }

      setShowCollaborationModal(false);
      setEditingCollaboration(null);
      resetCollaborationForm();
      loadAllData();
    } catch (error) {
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteCollaboration = async (id: number) => {
    if (!confirm('এই সহযোগিতার ধরনটি মুছে ফেলতে চান?')) return;

    try {
      const { error } = await supabase
        .from('collaboration_types')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('সহযোগিতার ধরন মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Stat Actions ==========
  const handleStatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingStat) {
        const { error } = await supabase
          .from('partnership_stats')
          .update({
            ...statForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingStat.id);
        if (error) throw error;
        toast.success('পরিসংখ্যান আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('partnership_stats')
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
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteStat = async (id: number) => {
    if (!confirm('এই পরিসংখ্যানটি মুছে ফেলতে চান?')) return;

    try {
      const { error } = await supabase
        .from('partnership_stats')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('পরিসংখ্যান মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Reset Forms ==========
  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      icon: '🤝',
      description: '',
      sort_order: 0,
      status: 'active'
    });
  };

  const resetPartnershipForm = () => {
    setPartnershipForm({
      category_id: 0,
      name: '',
      logo: '🏛️',
      type: '',
      since: '',
      description: '',
      website: '',
      image_url: null,
      image_path: null,
      sort_order: 0,
      is_featured: false,
      status: 'active',
      contact_person: '',
      contact_email: '',
      contact_phone: '',
      address: ''
    });
  };

  const resetCollaborationForm = () => {
    setCollaborationForm({
      name: '',
      count: '',
      color: 'bg-blue-100 text-blue-800',
      sort_order: 0,
      status: 'active'
    });
  };

  const resetStatForm = () => {
    setStatForm({
      label: '',
      value: '',
      icon: '🤝',
      description: '',
      sort_order: 0,
      status: 'active'
    });
  };

  // ========== Helper Functions ==========
  const getCategoryName = (id: number) => {
    return categories.find(c => c.id === id)?.name || 'অজানা';
  };

  const filteredPartnerships = partnerships.filter(p => {
    if (categoryFilter !== 'all' && p.category_id !== parseInt(categoryFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // নাম পরিবর্তন করে partnershipStats করা হলো (stats এর সাথে কনফ্লিক্ট এড়াতে)
  const partnershipStats = {
    total: partnerships.length,
    featured: partnerships.filter(p => p.is_featured).length,
    active: partnerships.filter(p => p.status === 'active').length
  };

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
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
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            পার্টনারশিপ ব্যবস্থাপনা
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600">মোট পার্টনার</p>
              <p className="text-2xl font-bold text-blue-700">{partnershipStats.total}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600">সক্রিয়</p>
              <p className="text-2xl font-bold text-green-700">{partnershipStats.active}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600">ফিচার্ড</p>
              <p className="text-2xl font-bold text-yellow-700">{partnershipStats.featured}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b">
            <button
              onClick={() => setActiveTab('partnerships')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'partnerships' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4" />
              পার্টনার সমূহ
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'categories' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building className="w-4 h-4" />
              ক্যাটাগরি
            </button>
            <button
              onClick={() => setActiveTab('collaboration')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'collaboration' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Heart className="w-4 h-4" />
              সহযোগিতার ধরন
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'stats' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Award className="w-4 h-4" />
              পরিসংখ্যান
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Partnerships Tab */}
        {activeTab === 'partnerships' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex gap-4">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">সব ক্যাটাগরি</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => {
                    resetPartnershipForm();
                    setEditingPartnership(null);
                    setShowPartnershipModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  নতুন পার্টনার
                </button>
              </div>
            </div>

            {/* Partnerships List */}
            <div className="bg-white rounded-lg shadow">
              {filteredPartnerships.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">কোনো পার্টনার পাওয়া যায়নি</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredPartnerships.map((partner) => (
                    <div key={partner.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          {partner.image_url ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden">
                              <Image
                                src={partner.image_url}
                                alt={partner.name}
                                width={64}
                                height={64}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-3xl">
                              {partner.logo}
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-lg">{partner.name}</h3>
                              {partner.is_featured && (
                                <span className="text-yellow-500">★</span>
                              )}
                            </div>
                            <p className="text-sm text-blue-600">{partner.type}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {getCategoryName(partner.category_id)} • সহযোগিতা: {partner.since}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingPartnership(partner);
                              setPartnershipForm(partner);
                              setShowPartnershipModal(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePartnership(partner.id, partner.image_path)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{partner.description}</p>
                      {partner.website && (
                        <a
                          href={partner.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline flex items-center gap-1"
                        >
                          <Globe className="w-4 h-4" />
                          ওয়েবসাইট
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">ক্যাটাগরি</h2>
              <button
                onClick={() => {
                  resetCategoryForm();
                  setEditingCategory(null);
                  setShowCategoryModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                নতুন ক্যাটাগরি
              </button>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                {categories.map((cat) => (
                  <div key={cat.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cat.icon}</span>
                      <div>
                        <h3 className="font-semibold">{cat.name}</h3>
                        <p className="text-sm text-gray-500">{cat.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setCategoryForm(cat);
                          setShowCategoryModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Collaboration Types Tab */}
        {activeTab === 'collaboration' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">সহযোগিতার ধরন</h2>
              <button
                onClick={() => {
                  resetCollaborationForm();
                  setEditingCollaboration(null);
                  setShowCollaborationModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                নতুন ধরন
              </button>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-3">
                {collaborationTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${type.color}`}
                  >
                    <span>{type.name} • {type.count}</span>
                    <button
                      onClick={() => {
                        setEditingCollaboration(type);
                        setCollaborationForm(type);
                        setShowCollaborationModal(true);
                      }}
                      className="ml-2 hover:opacity-70"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => deleteCollaboration(type.id)}
                      className="hover:opacity-70"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                নতুন পরিসংখ্যান
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.id} className="bg-white border rounded-lg p-6 text-center relative group">
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                    {stat.description && (
                      <div className="text-xs text-gray-400 mt-1">{stat.description}</div>
                    )}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingStat(stat);
                          setStatForm(stat);
                          setShowStatModal(true);
                        }}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded mr-1"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteStat(stat.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
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
            <input
              type="text"
              placeholder="ক্যাটাগরির নাম"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="আইকন (যেমন: 🤝)"
              value={categoryForm.icon}
              onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              maxLength={2}
            />
            <textarea
              placeholder="বিবরণ"
              value={categoryForm.description || ''}
              onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={categoryForm.status === 'active'}
                  onChange={(e) => setCategoryForm({...categoryForm, status: e.target.checked ? 'active' : 'inactive'})}
                  className="w-4 h-4"
                />
                সক্রিয়
              </label>
              <input
                type="number"
                placeholder="ক্রম"
                value={categoryForm.sort_order}
                onChange={(e) => setCategoryForm({...categoryForm, sort_order: parseInt(e.target.value)})}
                className="w-20 px-3 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Partnership Modal */}
      {showPartnershipModal && (
        <Modal
          title={editingPartnership ? 'পার্টনার সম্পাদনা' : 'নতুন পার্টনার'}
          onClose={() => {
            setShowPartnershipModal(false);
            setEditingPartnership(null);
            resetPartnershipForm();
          }}
          onSubmit={handlePartnershipSubmit}
          submitting={submitting}
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            {/* Image Upload */}
            <div>
              {partnershipForm.image_url && (
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={partnershipForm.image_url}
                    alt="Preview"
                    fill
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (partnershipForm.image_path) {
                        await supabase.storage
                          .from('partnerships')
                          .remove([partnershipForm.image_path]);
                      }
                      setPartnershipForm(prev => ({ ...prev, image_url: null, image_path: null }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePartnershipImageUpload}
                className="w-full"
              />
            </div>

            <select
              value={partnershipForm.category_id}
              onChange={(e) => setPartnershipForm({...partnershipForm, category_id: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">ক্যাটাগরি নির্বাচন করুন</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="নাম"
              value={partnershipForm.name}
              onChange={(e) => setPartnershipForm({...partnershipForm, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="লোগো (যেমন: 🏛️)"
                value={partnershipForm.logo}
                onChange={(e) => setPartnershipForm({...partnershipForm, logo: e.target.value})}
                className="px-3 py-2 border rounded-lg"
                maxLength={2}
              />
              <input
                type="text"
                placeholder="ধরন (যেমন: কেন্দ্রীয় সদস্য)"
                value={partnershipForm.type}
                onChange={(e) => setPartnershipForm({...partnershipForm, type: e.target.value})}
                className="px-3 py-2 border rounded-lg"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="সহযোগিতা কাল (যেমন: ২০২৫)"
                value={partnershipForm.since}
                onChange={(e) => setPartnershipForm({...partnershipForm, since: e.target.value})}
                className="px-3 py-2 border rounded-lg"
                required
              />
              <input
                type="url"
                placeholder="ওয়েবসাইট"
                value={partnershipForm.website || ''}
                onChange={(e) => setPartnershipForm({...partnershipForm, website: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
            </div>

            <textarea
              placeholder="বিবরণ"
              value={partnershipForm.description}
              onChange={(e) => setPartnershipForm({...partnershipForm, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">যোগাযোগের তথ্য (ঐচ্ছিক)</h3>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="যোগাযোগ ব্যক্তি"
                  value={partnershipForm.contact_person || ''}
                  onChange={(e) => setPartnershipForm({...partnershipForm, contact_person: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="email"
                    placeholder="ইমেইল"
                    value={partnershipForm.contact_email || ''}
                    onChange={(e) => setPartnershipForm({...partnershipForm, contact_email: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="ফোন"
                    value={partnershipForm.contact_phone || ''}
                    onChange={(e) => setPartnershipForm({...partnershipForm, contact_phone: e.target.value})}
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>
                <textarea
                  placeholder="ঠিকানা"
                  value={partnershipForm.address || ''}
                  onChange={(e) => setPartnershipForm({...partnershipForm, address: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={partnershipForm.is_featured}
                  onChange={(e) => setPartnershipForm({...partnershipForm, is_featured: e.target.checked})}
                  className="w-4 h-4"
                />
                ফিচার্ড
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={partnershipForm.status === 'active'}
                  onChange={(e) => setPartnershipForm({...partnershipForm, status: e.target.checked ? 'active' : 'inactive'})}
                  className="w-4 h-4"
                />
                সক্রিয়
              </label>
              <input
                type="number"
                placeholder="ক্রম"
                value={partnershipForm.sort_order}
                onChange={(e) => setPartnershipForm({...partnershipForm, sort_order: parseInt(e.target.value)})}
                className="w-20 px-3 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Collaboration Modal */}
      {showCollaborationModal && (
        <Modal
          title={editingCollaboration ? 'সহযোগিতার ধরন সম্পাদনা' : 'নতুন সহযোগিতার ধরন'}
          onClose={() => {
            setShowCollaborationModal(false);
            setEditingCollaboration(null);
            resetCollaborationForm();
          }}
          onSubmit={handleCollaborationSubmit}
          submitting={submitting}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="নাম (যেমন: কেন্দ্রীয় সদস্য)"
              value={collaborationForm.name}
              onChange={(e) => setCollaborationForm({...collaborationForm, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="সংখ্যা (যেমন: ১টি)"
              value={collaborationForm.count}
              onChange={(e) => setCollaborationForm({...collaborationForm, count: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="রঙ (যেমন: bg-purple-100 text-purple-800)"
              value={collaborationForm.color}
              onChange={(e) => setCollaborationForm({...collaborationForm, color: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={collaborationForm.status === 'active'}
                  onChange={(e) => setCollaborationForm({...collaborationForm, status: e.target.checked ? 'active' : 'inactive'})}
                  className="w-4 h-4"
                />
                সক্রিয়
              </label>
              <input
                type="number"
                placeholder="ক্রম"
                value={collaborationForm.sort_order}
                onChange={(e) => setCollaborationForm({...collaborationForm, sort_order: parseInt(e.target.value)})}
                className="w-20 px-3 py-2 border rounded-lg"
                min="0"
              />
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
            <input
              type="text"
              placeholder="লেবেল (যেমন: মোট পার্টনার)"
              value={statForm.label}
              onChange={(e) => setStatForm({...statForm, label: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="মান (যেমন: ১৫+)"
              value={statForm.value}
              onChange={(e) => setStatForm({...statForm, value: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="আইকন (যেমন: 🤝)"
              value={statForm.icon || ''}
              onChange={(e) => setStatForm({...statForm, icon: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              maxLength={2}
            />
            <textarea
              placeholder="বিবরণ (ঐচ্ছিক)"
              value={statForm.description || ''}
              onChange={(e) => setStatForm({...statForm, description: e.target.value})}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={statForm.status === 'active'}
                  onChange={(e) => setStatForm({...statForm, status: e.target.checked ? 'active' : 'inactive'})}
                  className="w-4 h-4"
                />
                সক্রিয়
              </label>
              <input
                type="number"
                placeholder="ক্রম"
                value={statForm.sort_order}
                onChange={(e) => setStatForm({...statForm, sort_order: parseInt(e.target.value)})}
                className="w-20 px-3 py-2 border rounded-lg"
                min="0"
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
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
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