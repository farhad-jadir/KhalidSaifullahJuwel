// khalid/src/app/admin/gallery/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { 
  Images, Video, FolderOpen, Plus, Edit, Trash2, X, Save,
  Upload, Link as LinkIcon, Calendar, MapPin, Star, Eye,
  ChevronDown, ChevronUp, Youtube, Play, Image as ImageIcon
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ========== টাইপ ডিফিনেশন ==========
interface GalleryCategory {
  id: number;
  name: string;
  type: 'photo' | 'video';
  icon: string | null;
  description: string | null;
  sort_order: number;
  status: 'active' | 'inactive';
}

interface GalleryPhoto {
  id: number;
  category_id: number;
  title: string;
  description: string | null;
  image_url: string;
  image_path: string;
  thumbnail_url: string | null;
  date: string | null;
  location: string | null;
  sort_order: number;
  is_featured: boolean;
  status: 'active' | 'inactive';
}

interface GalleryVideo {
  id: number;
  category_id: number;
  title: string;
  description: string | null;
  youtube_url: string;
  youtube_id: string | null;
  thumbnail_url: string | null;
  duration: string | null;
  views: string | null;
  date: string | null;
  sort_order: number;
  is_featured: boolean;
  status: 'active' | 'inactive';
}

interface GalleryStat {
  id: number;
  label: string;
  value: string;
  icon: string | null;
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

export default function AdminGalleryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | 'categories' | 'stats'>('photos');
  
  // Data states
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [stats, setStats] = useState<GalleryStat[]>([]);
  
  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showStatModal, setShowStatModal] = useState(false);
  
  // Selected items for editing
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [editingVideo, setEditingVideo] = useState<GalleryVideo | null>(null);
  const [editingStat, setEditingStat] = useState<GalleryStat | null>(null);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // ========== ফর্ম স্টেট ==========
  const [categoryForm, setCategoryForm] = useState<Partial<GalleryCategory>>({
    name: '',
    type: 'photo',
    icon: '📁',
    description: '',
    sort_order: 0,
    status: 'active'
  });
  
  const [photoForm, setPhotoForm] = useState<Partial<GalleryPhoto>>({
    category_id: 0,
    title: '',
    description: '',
    image_url: '',
    image_path: '',
    date: '',
    location: '',
    sort_order: 0,
    is_featured: false,
    status: 'active'
  });
  
  const [videoForm, setVideoForm] = useState<Partial<GalleryVideo>>({
    category_id: 0,
    title: '',
    description: '',
    youtube_url: '',
    duration: '',
    views: '',
    date: '',
    sort_order: 0,
    is_featured: false,
    status: 'active'
  });
  
  const [statForm, setStatForm] = useState<Partial<GalleryStat>>({
    label: '',
    value: '',
    icon: '📊',
    sort_order: 0,
    status: 'active'
  });

  // YouTube ID extractor
  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

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
        .from('gallery_categories')
        .select('*')
        .order('sort_order');
      setCategories(categoriesData || []);

      // Load photos
      const { data: photosData } = await supabase
        .from('gallery_photos')
        .select('*')
        .order('sort_order');
      setPhotos(photosData || []);

      // Load videos
      const { data: videosData } = await supabase
        .from('gallery_videos')
        .select('*')
        .order('sort_order');
      setVideos(videosData || []);

      // Load stats
      const { data: statsData } = await supabase
        .from('gallery_stats')
        .select('*')
        .order('sort_order');
      setStats(statsData || []);

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
          .from('gallery_categories')
          .update({
            ...categoryForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingCategory.id);
        if (error) throw error;
        toast.success('ক্যাটাগরি আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('gallery_categories')
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
    if (!confirm('এই ক্যাটাগরি এবং এর সব আইটেম মুছে ফেলতে চান?')) return;

    try {
      const { error } = await supabase
        .from('gallery_categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('ক্যাটাগরি মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Photo Actions ==========
  const handlePhotoImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('ছবির সাইজ 5MB এর কম হতে হবে');
      return;
    }

    setUploadingImage(true);
    try {
      const fileName = `photo_${Date.now()}_${file.name}`;
      const filePath = `gallery/photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath);

      setPhotoForm(prev => ({ 
        ...prev, 
        image_url: publicUrl, 
        image_path: filePath,
        thumbnail_url: publicUrl 
      }));
      toast.success('ছবি আপলোড সফল হয়েছে');
    } catch (error) {
      toast.error('ছবি আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (editingPhoto) {
        const { error } = await supabase
          .from('gallery_photos')
          .update({
            ...photoForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPhoto.id);
        if (error) throw error;
        toast.success('ছবি আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('gallery_photos')
          .insert([{
            ...photoForm,
            created_by: user?.id,
            created_at: new Date().toISOString()
          }]);
        if (error) throw error;
        toast.success('নতুন ছবি যোগ হয়েছে');
      }

      setShowPhotoModal(false);
      setEditingPhoto(null);
      resetPhotoForm();
      loadAllData();
    } catch (error) {
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const deletePhoto = async (id: number, imagePath?: string) => {
    if (!confirm('এই ছবিটি মুছে ফেলতে চান?')) return;

    try {
      if (imagePath) {
        await supabase.storage.from('gallery').remove([imagePath]);
      }

      const { error } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('ছবি মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Video Actions ==========
  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // YouTube ID auto-extract (Supabase trigger handle করবে)
      const videoData = {
        ...videoForm,
        youtube_url: videoForm.youtube_url
      };

      if (editingVideo) {
        const { error } = await supabase
          .from('gallery_videos')
          .update({
            ...videoData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingVideo.id);
        if (error) throw error;
        toast.success('ভিডিও আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('gallery_videos')
          .insert([{
            ...videoData,
            created_by: user?.id,
            created_at: new Date().toISOString()
          }]);
        if (error) throw error;
        toast.success('নতুন ভিডিও যোগ হয়েছে');
      }

      setShowVideoModal(false);
      setEditingVideo(null);
      resetVideoForm();
      loadAllData();
    } catch (error) {
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteVideo = async (id: number) => {
    if (!confirm('এই ভিডিওটি মুছে ফেলতে চান?')) return;

    try {
      const { error } = await supabase
        .from('gallery_videos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('ভিডিও মুছে ফেলা হয়েছে');
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
          .from('gallery_stats')
          .update({
            ...statForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingStat.id);
        if (error) throw error;
        toast.success('পরিসংখ্যান আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('gallery_stats')
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
        .from('gallery_stats')
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
      type: 'photo',
      icon: '📁',
      description: '',
      sort_order: 0,
      status: 'active'
    });
  };

  const resetPhotoForm = () => {
    setPhotoForm({
      category_id: 0,
      title: '',
      description: '',
      image_url: '',
      image_path: '',
      date: '',
      location: '',
      sort_order: 0,
      is_featured: false,
      status: 'active'
    });
  };

  const resetVideoForm = () => {
    setVideoForm({
      category_id: 0,
      title: '',
      description: '',
      youtube_url: '',
      duration: '',
      views: '',
      date: '',
      sort_order: 0,
      is_featured: false,
      status: 'active'
    });
  };

  const resetStatForm = () => {
    setStatForm({
      label: '',
      value: '',
      icon: '📊',
      sort_order: 0,
      status: 'active'
    });
  };

  // ========== Helper Functions ==========
  const getCategoryName = (id: number, type?: string) => {
    const category = categories.find(c => c.id === id);
    return category?.name || 'অজানা';
  };

  const getPhotoCategories = () => categories.filter(c => c.type === 'photo');
  const getVideoCategories = () => categories.filter(c => c.type === 'video');

  const filteredPhotos = photos.filter(p => {
    if (categoryFilter !== 'all' && p.category_id !== parseInt(categoryFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.location && p.location.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const filteredVideos = videos.filter(v => {
    if (categoryFilter !== 'all' && v.category_id !== parseInt(categoryFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        v.title.toLowerCase().includes(q) ||
        (v.description && v.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const galleryStats = {
    totalPhotos: photos.length,
    totalVideos: videos.length,
    featuredPhotos: photos.filter(p => p.is_featured).length,
    featuredVideos: videos.filter(v => v.is_featured).length
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
            গ্যালারি ব্যবস্থাপনা
          </h1>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600">মোট ছবি</p>
              <p className="text-2xl font-bold text-blue-700">{galleryStats.totalPhotos}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600">মোট ভিডিও</p>
              <p className="text-2xl font-bold text-green-700">{galleryStats.totalVideos}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600">ফিচার্ড ছবি</p>
              <p className="text-2xl font-bold text-yellow-700">{galleryStats.featuredPhotos}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600">ফিচার্ড ভিডিও</p>
              <p className="text-2xl font-bold text-purple-700">{galleryStats.featuredVideos}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b">
            <button
              onClick={() => setActiveTab('photos')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'photos' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              ছবি সমূহ
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'videos' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Video className="w-4 h-4" />
              ভিডিও সমূহ
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'categories' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <FolderOpen className="w-4 h-4" />
              ক্যাটাগরি
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'stats' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Eye className="w-4 h-4" />
              পরিসংখ্যান
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Photos Tab */}
        {activeTab === 'photos' && (
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
                  {getPhotoCategories().map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => {
                    resetPhotoForm();
                    setEditingPhoto(null);
                    setShowPhotoModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  নতুন ছবি
                </button>
              </div>
            </div>

            {/* Photos Grid */}
            <div className="bg-white rounded-lg shadow p-6">
              {filteredPhotos.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">কোনো ছবি পাওয়া যায়নি</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredPhotos.map((photo) => (
                    <div key={photo.id} className="border rounded-lg overflow-hidden group">
                      <div className="relative aspect-square bg-gray-100">
                        <Image
                          src={photo.image_url}
                          alt={photo.title}
                          fill
                          className="object-cover"
                        />
                        {photo.is_featured && (
                          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 p-1 rounded-full">
                            <Star className="w-4 h-4" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => {
                              setEditingPhoto(photo);
                              setPhotoForm(photo);
                              setShowPhotoModal(true);
                            }}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePhoto(photo.id, photo.image_path)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 truncate">{photo.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{getCategoryName(photo.category_id)}</p>
                        {photo.date && (
                          <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {photo.date}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Videos Tab */}
        {activeTab === 'videos' && (
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
                  {getVideoCategories().map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => {
                    resetVideoForm();
                    setEditingVideo(null);
                    setShowVideoModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  নতুন ভিডিও
                </button>
              </div>
            </div>

            {/* Videos Grid */}
            <div className="bg-white rounded-lg shadow p-6">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">কোনো ভিডিও পাওয়া যায়নি</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="border rounded-lg overflow-hidden group">
                      <div className="relative aspect-video bg-gray-900">
                        {video.youtube_id ? (
                          <img
                            src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                            <Youtube className="w-12 h-12 text-red-600" />
                          </div>
                        )}
                        {video.is_featured && (
                          <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 p-1 rounded-full">
                            <Star className="w-4 h-4" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          <button
                            onClick={() => {
                              setEditingVideo(video);
                              setVideoForm(video);
                              setShowVideoModal(true);
                            }}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteVideo(video.id)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 truncate">{video.title}</h3>
                        <p className="text-sm text-gray-500 truncate">{getCategoryName(video.category_id)}</p>
                        <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                          {video.date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {video.date}
                            </span>
                          )}
                          {video.views && (
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {video.views}
                            </span>
                          )}
                        </div>
                      </div>
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
                      <span className="text-2xl">{cat.icon || (cat.type === 'photo' ? '📸' : '🎥')}</span>
                      <div>
                        <h3 className="font-semibold">{cat.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            cat.type === 'photo' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {cat.type === 'photo' ? '📸 ছবি' : '🎥 ভিডিও'}
                          </span>
                          {cat.description && (
                            <span className="text-xs text-gray-500">{cat.description}</span>
                          )}
                        </div>
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
            <select
              value={categoryForm.type}
              onChange={(e) => setCategoryForm({...categoryForm, type: e.target.value as 'photo' | 'video'})}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="photo">📸 ছবি</option>
              <option value="video">🎥 ভিডিও</option>
            </select>
            <input
              type="text"
              placeholder="আইকন (যেমন: 🏛️)"
              value={categoryForm.icon || ''}
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

      {/* Photo Modal */}
      {showPhotoModal && (
        <Modal
          title={editingPhoto ? 'ছবি সম্পাদনা' : 'নতুন ছবি'}
          onClose={() => {
            setShowPhotoModal(false);
            setEditingPhoto(null);
            resetPhotoForm();
          }}
          onSubmit={handlePhotoSubmit}
          submitting={submitting}
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            {/* Image Upload */}
            <div>
              {photoForm.image_url && (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={photoForm.image_url}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (photoForm.image_path) {
                        await supabase.storage
                          .from('gallery')
                          .remove([photoForm.image_path]);
                      }
                      setPhotoForm(prev => ({ ...prev, image_url: '', image_path: '' }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoImageUpload}
                disabled={uploadingImage}
                className="w-full"
              />
              {uploadingImage && <p className="text-sm text-blue-600 mt-2">আপলোড হচ্ছে...</p>}
            </div>

            <select
              value={photoForm.category_id}
              onChange={(e) => setPhotoForm({...photoForm, category_id: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">ক্যাটাগরি নির্বাচন করুন</option>
              {getPhotoCategories().map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="শিরোনাম"
              value={photoForm.title}
              onChange={(e) => setPhotoForm({...photoForm, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />

            <textarea
              placeholder="বিবরণ"
              value={photoForm.description || ''}
              onChange={(e) => setPhotoForm({...photoForm, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="তারিখ (যেমন: ১৫ জানুয়ারি, ২০২৬)"
                value={photoForm.date || ''}
                onChange={(e) => setPhotoForm({...photoForm, date: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="স্থান"
                value={photoForm.location || ''}
                onChange={(e) => setPhotoForm({...photoForm, location: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={photoForm.is_featured}
                  onChange={(e) => setPhotoForm({...photoForm, is_featured: e.target.checked})}
                  className="w-4 h-4"
                />
                ফিচার্ড
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={photoForm.status === 'active'}
                  onChange={(e) => setPhotoForm({...photoForm, status: e.target.checked ? 'active' : 'inactive'})}
                  className="w-4 h-4"
                />
                সক্রিয়
              </label>
              <input
                type="number"
                placeholder="ক্রম"
                value={photoForm.sort_order}
                onChange={(e) => setPhotoForm({...photoForm, sort_order: parseInt(e.target.value)})}
                className="w-20 px-3 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Video Modal */}
      {showVideoModal && (
        <Modal
          title={editingVideo ? 'ভিডিও সম্পাদনা' : 'নতুন ভিডিও'}
          onClose={() => {
            setShowVideoModal(false);
            setEditingVideo(null);
            resetVideoForm();
          }}
          onSubmit={handleVideoSubmit}
          submitting={submitting}
        >
          <div className="space-y-4">
            {videoForm.youtube_id && (
              <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden bg-gray-900">
                <img
                  src={`https://img.youtube.com/vi/${videoForm.youtube_id}/mqdefault.jpg`}
                  alt={videoForm.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Youtube className="w-16 h-16 text-red-600 opacity-80" />
                </div>
              </div>
            )}

            <select
              value={videoForm.category_id}
              onChange={(e) => setVideoForm({...videoForm, category_id: parseInt(e.target.value)})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">ক্যাটাগরি নির্বাচন করুন</option>
              {getVideoCategories().map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="শিরোনাম"
              value={videoForm.title}
              onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />

            <div className="relative">
              <input
                type="url"
                placeholder="YouTube URL"
                value={videoForm.youtube_url}
                onChange={(e) => setVideoForm({...videoForm, youtube_url: e.target.value})}
                className="w-full pl-10 pr-3 py-2 border rounded-lg"
                required
              />
              <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-red-600" />
            </div>

            <textarea
              placeholder="বিবরণ"
              value={videoForm.description || ''}
              onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="তারিখ (যেমন: ১৫ জানুয়ারি, ২০২৬)"
                value={videoForm.date || ''}
                onChange={(e) => setVideoForm({...videoForm, date: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="দৈর্ঘ্য (যেমন: ১৫:৩০)"
                value={videoForm.duration || ''}
                onChange={(e) => setVideoForm({...videoForm, duration: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="ভিউ (যেমন: ২.৫কে)"
                value={videoForm.views || ''}
                onChange={(e) => setVideoForm({...videoForm, views: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={videoForm.is_featured}
                  onChange={(e) => setVideoForm({...videoForm, is_featured: e.target.checked})}
                  className="w-4 h-4"
                />
                ফিচার্ড
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={videoForm.status === 'active'}
                  onChange={(e) => setVideoForm({...videoForm, status: e.target.checked ? 'active' : 'inactive'})}
                  className="w-4 h-4"
                />
                সক্রিয়
              </label>
              <input
                type="number"
                placeholder="ক্রম"
                value={videoForm.sort_order}
                onChange={(e) => setVideoForm({...videoForm, sort_order: parseInt(e.target.value)})}
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
              placeholder="লেবেল (যেমন: মোট ছবি)"
              value={statForm.label}
              onChange={(e) => setStatForm({...statForm, label: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="মান (যেমন: ১০০+)"
              value={statForm.value}
              onChange={(e) => setStatForm({...statForm, value: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="আইকন (যেমন: 📸)"
              value={statForm.icon || ''}
              onChange={(e) => setStatForm({...statForm, icon: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              maxLength={2}
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