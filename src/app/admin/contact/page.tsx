// khalid/src/app/admin/contact/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { 
  Mail, Phone, MapPin, Globe, Facebook, Twitter, Linkedin, Instagram,
  Youtube, Send, Clock, Users, Building, HelpCircle, Settings, Download,
  Eye, AlertCircle, Paperclip, Archive, Edit, Trash2, Plus, Save,
  Filter, Search, RefreshCw, Upload, ChevronDown, ChevronUp, Inbox,
  Minus, X, Home, Info, Link2, UserPlus, Briefcase, MessageCircle
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ========== টাইপ ডিফিনেশন ==========
interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'pending' | 'read' | 'replied' | 'archived';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: string | null;
  created_at: string;
  notes: string | null;
}

interface ContactFile {
  id: number;
  message_id: number;
  file_name: string;
  file_size: number;
  file_url: string;
}

interface ContactInfo {
  id: number;
  personal_phone: string | null;
  personal_email: string | null;
  personal_alternative: string | null;
  office_title: string | null;
  office_address: string | null;
  office_location: string | null;
  office_hours: string | null;
  office_phone: string | null;
  office_email: string | null;
  emergency_phone: string | null;
}

interface SocialLink {
  id: number;
  platform: string;
  handle: string;
  url: string;
  icon: string | null;
  color: string | null;
  sort_order: number;
  is_active: boolean;
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  phone: string | null;
  email: string | null;
  availability: string | null;
  image_url: string | null;
  image_path: string | null;
  sort_order: number;
  is_active: boolean;
}

interface Office {
  id: number;
  city: string;
  address: string;
  phone: string | null;
  hours: string | null;
  map_link: string | null;
  is_head_office: boolean;
  sort_order: number;
  is_active: boolean;
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
  is_active: boolean;
}

interface ContactSettings {
  id: number;
  header_title: string | null;
  header_subtitle: string | null;
  hero_image_url: string | null;
  hero_image_path: string | null;
  email_notifications: boolean;
  auto_reply_enabled: boolean;
  auto_reply_subject: string | null;
  auto_reply_message: string | null;
}

// ========== মডাল প্রপস টাইপ ==========
interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onSubmit?: (e: React.FormEvent) => Promise<void>;
  submitting?: boolean;
}

export default function AdminContactPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'messages' | 'info' | 'social' | 'team' | 'offices' | 'faq' | 'settings'>('messages');
  
  // Data states
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [messageFiles, setMessageFiles] = useState<{ [key: number]: ContactFile[] }>({});
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  
  // Modal states
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showOfficeModal, setShowOfficeModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Selected items for editing
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [editingTeam, setEditingTeam] = useState<TeamMember | null>(null);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  
  // Form states
  const [infoForm, setInfoForm] = useState<Partial<ContactInfo>>({});
  const [socialForm, setSocialForm] = useState<Partial<SocialLink>>({
    platform: '',
    handle: '',
    url: '',
    icon: '',
    color: 'bg-blue-600',
    sort_order: 0,
    is_active: true
  });
  
  const [teamForm, setTeamForm] = useState<Partial<TeamMember>>({
    name: '',
    role: '',
    phone: '',
    email: '',
    availability: '',
    sort_order: 0,
    is_active: true,
    image_url: null,
    image_path: null
  });
  
  const [officeForm, setOfficeForm] = useState<Partial<Office>>({
    city: '',
    address: '',
    phone: '',
    hours: '',
    map_link: '',
    is_head_office: false,
    sort_order: 0,
    is_active: true
  });
  
  const [faqForm, setFaqForm] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    category: '',
    sort_order: 0,
    is_active: true
  });
  
  const [settingsForm, setSettingsForm] = useState<Partial<ContactSettings>>({});
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

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

      // Load messages
      const { data: messagesData } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      setMessages(messagesData || []);

      // Load message files
      const filesMap: { [key: number]: ContactFile[] } = {};
      for (const msg of messagesData || []) {
        const { data: filesData } = await supabase
          .from('contact_files')
          .select('*')
          .eq('message_id', msg.id);
        if (filesData) filesMap[msg.id] = filesData;
      }
      setMessageFiles(filesMap);

      // Load contact info
      const { data: infoData } = await supabase
        .from('contact_info')
        .select('*')
        .eq('id', 1)
        .single();
      setContactInfo(infoData || null);

      // Load social links
      const { data: socialData } = await supabase
        .from('social_links')
        .select('*')
        .order('sort_order');
      setSocialLinks(socialData || []);

      // Load team members
      const { data: teamData } = await supabase
        .from('team_members')
        .select('*')
        .order('sort_order');
      setTeamMembers(teamData || []);

      // Load offices
      const { data: officesData } = await supabase
        .from('offices')
        .select('*')
        .order('sort_order');
      setOffices(officesData || []);

      // Load FAQs
      const { data: faqData } = await supabase
        .from('faq_items')
        .select('*')
        .order('sort_order');
      setFaqs(faqData || []);

      // Load settings
      const { data: settingsData } = await supabase
        .from('contact_settings')
        .select('*')
        .eq('id', 1)
        .single();
      setSettings(settingsData || null);

    } catch (error) {
      console.error('Load error:', error);
      toast.error('ডাটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // ========== Message Actions ==========
  const updateMessageStatus = async (id: number, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ 
          status,
          ...(status === 'read' ? { read_at: new Date().toISOString() } : {}),
          ...(status === 'replied' ? { replied_at: new Date().toISOString() } : {}),
          ...(status === 'archived' ? { archived_at: new Date().toISOString() } : {})
        })
        .eq('id', id);

      if (error) throw error;
      toast.success('স্ট্যাটাস আপডেট হয়েছে');
      loadAllData();
    } catch (error) {
      toast.error('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const updatePriority = async (id: number, priority: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ priority })
        .eq('id', id);

      if (error) throw error;
      toast.success('প্রায়োরিটি আপডেট হয়েছে');
      loadAllData();
    } catch (error) {
      toast.error('প্রায়োরিটি আপডেট করতে সমস্যা হয়েছে');
    }
  };

  const addNote = async (id: number, notes: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ notes })
        .eq('id', id);

      if (error) throw error;
      toast.success('নোট যোগ করা হয়েছে');
      loadAllData();
    } catch (error) {
      toast.error('নোট যোগ করতে সমস্যা হয়েছে');
    }
  };

  const deleteMessage = async (id: number) => {
    if (!confirm('এই বার্তাটি মুছে ফেলতে চান?')) return;

    try {
      const files = messageFiles[id] || [];
      for (const file of files) {
        const path = file.file_url.split('/').pop();
        if (path) {
          await supabase.storage
            .from('contact')
            .remove([`messages/${id}/${path}`]);
        }
      }

      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('বার্তা মুছে ফেলা হয়েছে');
      loadAllData();
      setShowMessageModal(false);
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Contact Info Actions ==========
  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('contact_info')
        .upsert({
          id: 1,
          ...infoForm,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('যোগাযোগের তথ্য আপডেট হয়েছে');
      setShowInfoModal(false);
      loadAllData();
    } catch (error) {
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  // ========== Social Links Actions ==========
  const handleSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingSocial) {
        const { error } = await supabase
          .from('social_links')
          .update({
            ...socialForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSocial.id);
        if (error) throw error;
        toast.success('সোশ্যাল লিংক আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('social_links')
          .insert([{
            ...socialForm,
            created_at: new Date().toISOString()
          }]);
        if (error) throw error;
        toast.success('নতুন সোশ্যাল লিংক যোগ হয়েছে');
      }

      setShowSocialModal(false);
      setEditingSocial(null);
      resetSocialForm();
      loadAllData();
    } catch (error) {
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteSocial = async (id: number) => {
    if (!confirm('এই সোশ্যাল লিংকটি মুছে ফেলতে চান?')) return;

    try {
      const { error } = await supabase
        .from('social_links')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('সোশ্যাল লিংক মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Team Member Actions ==========
  const handleTeamImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.size > 2 * 1024 * 1024) {
      toast.error('ছবির সাইজ 2MB এর কম হতে হবে');
      return;
    }

    setUploadingImage(true);
    try {
      const fileName = `team_${Date.now()}_${file.name}`;
      const filePath = `contact/team/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('contact')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('contact')
        .getPublicUrl(filePath);

      setTeamForm(prev => ({ ...prev, image_url: publicUrl, image_path: filePath }));
      toast.success('ছবি আপলোড সফল হয়েছে');
    } catch (error) {
      toast.error('ছবি আপলোড করতে সমস্যা হয়েছে');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingTeam) {
        const { error } = await supabase
          .from('team_members')
          .update({
            ...teamForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingTeam.id);
        if (error) throw error;
        toast.success('টিম মেম্বার আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('team_members')
          .insert([{
            ...teamForm,
            created_at: new Date().toISOString()
          }]);
        if (error) throw error;
        toast.success('নতুন টিম মেম্বার যোগ হয়েছে');
      }

      setShowTeamModal(false);
      setEditingTeam(null);
      resetTeamForm();
      loadAllData();
    } catch (error) {
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteTeam = async (id: number, imagePath?: string | null) => {
    if (!confirm('এই টিম মেম্বারকে মুছে ফেলতে চান?')) return;

    try {
      if (imagePath) {
        await supabase.storage.from('contact').remove([imagePath]);
      }

      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('টিম মেম্বার মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Office Actions ==========
  const handleOfficeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingOffice) {
        const { error } = await supabase
          .from('offices')
          .update({
            ...officeForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingOffice.id);
        if (error) throw error;
        toast.success('অফিস আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('offices')
          .insert([{
            ...officeForm,
            created_at: new Date().toISOString()
          }]);
        if (error) throw error;
        toast.success('নতুন অফিস যোগ হয়েছে');
      }

      setShowOfficeModal(false);
      setEditingOffice(null);
      resetOfficeForm();
      loadAllData();
    } catch (error) {
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteOffice = async (id: number) => {
    if (!confirm('এই অফিসটি মুছে ফেলতে চান?')) return;

    try {
      const { error } = await supabase
        .from('offices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('অফিস মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== FAQ Actions ==========
  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingFaq) {
        const { error } = await supabase
          .from('faq_items')
          .update({
            ...faqForm,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingFaq.id);
        if (error) throw error;
        toast.success('FAQ আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('faq_items')
          .insert([{
            ...faqForm,
            created_at: new Date().toISOString()
          }]);
        if (error) throw error;
        toast.success('নতুন FAQ যোগ হয়েছে');
      }

      setShowFaqModal(false);
      setEditingFaq(null);
      resetFaqForm();
      loadAllData();
    } catch (error) {
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  const deleteFaq = async (id: number) => {
    if (!confirm('এই FAQ টি মুছে ফেলতে চান?')) return;

    try {
      const { error } = await supabase
        .from('faq_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('FAQ মুছে ফেলা হয়েছে');
      loadAllData();
    } catch (error) {
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // ========== Settings Actions ==========
  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('contact_settings')
        .upsert({
          id: 1,
          ...settingsForm,
          updated_by: user?.id,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('সেটিংস আপডেট হয়েছে');
      setShowSettingsModal(false);
      loadAllData();
    } catch (error) {
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  // ========== Reset Forms ==========
  const resetSocialForm = () => {
    setSocialForm({
      platform: '',
      handle: '',
      url: '',
      icon: '',
      color: 'bg-blue-600',
      sort_order: 0,
      is_active: true
    });
  };

  const resetTeamForm = () => {
    setTeamForm({
      name: '',
      role: '',
      phone: '',
      email: '',
      availability: '',
      sort_order: 0,
      is_active: true,
      image_url: null,
      image_path: null
    });
  };

  const resetOfficeForm = () => {
    setOfficeForm({
      city: '',
      address: '',
      phone: '',
      hours: '',
      map_link: '',
      is_head_office: false,
      sort_order: 0,
      is_active: true
    });
  };

  const resetFaqForm = () => {
    setFaqForm({
      question: '',
      answer: '',
      category: '',
      sort_order: 0,
      is_active: true
    });
  };

  // ========== Helper Functions ==========
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string, label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'অপেক্ষমান' },
      read: { color: 'bg-blue-100 text-blue-800', label: 'পঠিত' },
      replied: { color: 'bg-green-100 text-green-800', label: 'উত্তর দেওয়া' },
      archived: { color: 'bg-gray-100 text-gray-800', label: 'আর্কাইভ' }
    };
    return badges[status] || badges.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const badges: Record<string, { color: string, label: string }> = {
      low: { color: 'bg-gray-100 text-gray-800', label: 'নিম্ন' },
      normal: { color: 'bg-blue-100 text-blue-800', label: 'স্বাভাবিক' },
      high: { color: 'bg-orange-100 text-orange-800', label: 'উচ্চ' },
      urgent: { color: 'bg-red-100 text-red-800', label: 'জরুরি' }
    };
    return badges[priority] || badges.normal;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('bn-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredMessages = messages.filter(msg => {
    if (statusFilter !== 'all' && msg.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        msg.name.toLowerCase().includes(q) ||
        msg.email.toLowerCase().includes(q) ||
        msg.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = {
    total: messages.length,
    pending: messages.filter(m => m.status === 'pending').length,
    urgent: messages.filter(m => m.priority === 'urgent').length
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
            যোগাযোগ ব্যবস্থাপনা
          </h1>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b">
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'messages' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Mail className="w-4 h-4" />
              বার্তাসমূহ
              {stats.pending > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {stats.pending}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'info' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Info className="w-4 h-4" />
              যোগাযোগের তথ্য
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'social' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Link2 className="w-4 h-4" />
              সোশ্যাল লিংক
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'team' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4" />
              টিম
            </button>
            <button
              onClick={() => setActiveTab('offices')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'offices' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Building className="w-4 h-4" />
              অফিস
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'faq' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              FAQ
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === 'settings' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4" />
              সেটিংস
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600">মোট বার্তা</p>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-600">অপেক্ষমান</p>
                <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
              </div>
              <div className="bg-red-50 rounded-lg p-4">
                <p className="text-sm text-red-600">জরুরি</p>
                <p className="text-2xl font-bold text-red-700">{stats.urgent}</p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">সব বার্তা</option>
                <option value="pending">অপেক্ষমান</option>
                <option value="read">পঠিত</option>
                <option value="replied">উত্তর দেওয়া</option>
                <option value="archived">আর্কাইভ</option>
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
                onClick={loadAllData}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-lg shadow">
              {filteredMessages.length === 0 ? (
                <div className="p-12 text-center">
                  <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">কোনো বার্তা পাওয়া যায়নি</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-6 hover:bg-gray-50 cursor-pointer"
                      onClick={() => {
                        setSelectedMessage(msg);
                        setShowMessageModal(true);
                        if (msg.status === 'pending') {
                          updateMessageStatus(msg.id, 'read');
                        }
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                            {msg.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{msg.name}</h3>
                            <p className="text-sm text-gray-500">{msg.email}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(msg.status).color}`}>
                            {getStatusBadge(msg.status).label}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${getPriorityBadge(msg.priority).color}`}>
                            {getPriorityBadge(msg.priority).label}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mb-1">{msg.subject}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{msg.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatDate(msg.created_at)}
                        </span>
                        {messageFiles[msg.id]?.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Paperclip className="w-4 h-4" />
                            {messageFiles[msg.id].length}টি ফাইল
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Info Tab */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">যোগাযোগের তথ্য</h2>
              <button
                onClick={() => {
                  setInfoForm(contactInfo || {});
                  setShowInfoModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                সম্পাদনা
              </button>
            </div>
            <div className="p-6">
              {contactInfo ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">ব্যক্তিগত যোগাযোগ</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">ফোন</p>
                        <p className="font-medium">{contactInfo.personal_phone || 'নেই'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">ইমেইল</p>
                        <p className="font-medium">{contactInfo.personal_email || 'নেই'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">বিকল্প ফোন</p>
                        <p className="font-medium">{contactInfo.personal_alternative || 'নেই'}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">অফিস</h3>
                    <div className="space-y-2">
                      <p className="font-medium">{contactInfo.office_title}</p>
                      <p className="text-gray-600">{contactInfo.office_address}</p>
                      <p className="text-gray-600">{contactInfo.office_location}</p>
                      <p className="text-gray-600">{contactInfo.office_hours}</p>
                      <p className="text-gray-600">{contactInfo.office_phone}</p>
                      <p className="text-gray-600">{contactInfo.office_email}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">জরুরি যোগাযোগ</h3>
                    <p className="text-red-600 font-bold">{contactInfo.emergency_phone || 'নেই'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">কোনো তথ্য নেই</p>
              )}
            </div>
          </div>
        )}

        {/* Social Links Tab */}
        {activeTab === 'social' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">সোশ্যাল মিডিয়া লিংক</h2>
              <button
                onClick={() => {
                  resetSocialForm();
                  setEditingSocial(null);
                  setShowSocialModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                নতুন লিংক
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-4">
                {socialLinks.map((link) => (
                  <div key={link.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${link.color} rounded-lg flex items-center justify-center text-white`}>
                        {link.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{link.platform}</h3>
                        <p className="text-sm text-gray-500">{link.handle}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingSocial(link);
                          setSocialForm(link);
                          setShowSocialModal(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSocial(link.id)}
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

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">টিম মেম্বার</h2>
              <button
                onClick={() => {
                  resetTeamForm();
                  setEditingTeam(null);
                  setShowTeamModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                নতুন মেম্বার
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <div key={member.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {member.image_url ? (
                          <div className="w-16 h-16 rounded-full overflow-hidden">
                            <Image
                              src={member.image_url}
                              alt={member.name}
                              width={64}
                              height={64}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                            {member.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-sm text-blue-600">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTeam(member);
                            setTeamForm(member);
                            setShowTeamModal(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTeam(member.id, member.image_path)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" /> {member.phone || 'নেই'}
                      </p>
                      <p className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4" /> {member.email || 'নেই'}
                      </p>
                      <p className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4" /> {member.availability || 'নেই'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Offices Tab */}
        {activeTab === 'offices' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">আঞ্চলিক কার্যালয়</h2>
              <button
                onClick={() => {
                  resetOfficeForm();
                  setEditingOffice(null);
                  setShowOfficeModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                নতুন অফিস
              </button>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                {offices.map((office) => (
                  <div key={office.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        {office.city}
                        {office.is_head_office && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            প্রধান
                          </span>
                        )}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingOffice(office);
                            setOfficeForm(office);
                            setShowOfficeModal(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteOffice(office.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{office.address}</p>
                    <p className="text-sm text-gray-600 mb-1">{office.phone}</p>
                    <p className="text-sm text-gray-600 mb-2">{office.hours}</p>
                    {office.map_link && (
                      <a
                        href={office.map_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <MapPin className="w-4 h-4" />
                        গুগল ম্যাপে দেখুন
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">সচরাচর জিজ্ঞাসা</h2>
              <button
                onClick={() => {
                  resetFaqForm();
                  setEditingFaq(null);
                  setShowFaqModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                নতুন FAQ
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold">{faq.question}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingFaq(faq);
                            setFaqForm(faq);
                            setShowFaqModal(true);
                          }}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFaq(faq.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{faq.answer}</p>
                    {faq.category && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                        {faq.category}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">পেইজ সেটিংস</h2>
              <button
                onClick={() => {
                  setSettingsForm(settings || {});
                  setShowSettingsModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                সম্পাদনা
              </button>
            </div>
            <div className="p-6">
              {settings ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">হেডার টাইটেল</h3>
                    <p className="text-gray-600">{settings.header_title}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">হেডার সাবটাইটেল</h3>
                    <p className="text-gray-600">{settings.header_subtitle}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">ইমেইল নোটিফিকেশন</h3>
                    <p className={settings.email_notifications ? 'text-green-600' : 'text-red-600'}>
                      {settings.email_notifications ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">অটো-রিপ্লাই</h3>
                    <p className={settings.auto_reply_enabled ? 'text-green-600' : 'text-red-600'}>
                      {settings.auto_reply_enabled ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </p>
                    {settings.auto_reply_enabled && (
                      <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium">{settings.auto_reply_subject}</p>
                        <p className="text-gray-600 mt-1">{settings.auto_reply_message}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">কোনো সেটিংস নেই</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && selectedMessage && (
        <MessageModal
          message={selectedMessage}
          files={messageFiles[selectedMessage.id] || []}
          onClose={() => {
            setShowMessageModal(false);
            setSelectedMessage(null);
          }}
          onStatusChange={(status) => updateMessageStatus(selectedMessage.id, status)}
          onPriorityChange={(priority) => updatePriority(selectedMessage.id, priority)}
          onNoteAdd={(note) => addNote(selectedMessage.id, note)}
          onDelete={() => deleteMessage(selectedMessage.id)}
        />
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <Modal
          title="যোগাযোগের তথ্য সম্পাদনা"
          onClose={() => setShowInfoModal(false)}
          onSubmit={handleInfoSubmit}
          submitting={submitting}
        >
          <div className="space-y-4">
            <h3 className="font-semibold">ব্যক্তিগত যোগাযোগ</h3>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="ব্যক্তিগত ফোন"
                value={infoForm.personal_phone || ''}
                onChange={(e) => setInfoForm({...infoForm, personal_phone: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="ব্যক্তিগত ইমেইল"
                value={infoForm.personal_email || ''}
                onChange={(e) => setInfoForm({...infoForm, personal_email: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="বিকল্প ফোন"
                value={infoForm.personal_alternative || ''}
                onChange={(e) => setInfoForm({...infoForm, personal_alternative: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
            </div>

            <h3 className="font-semibold mt-4">অফিস</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="অফিসের শিরোনাম"
                value={infoForm.office_title || ''}
                onChange={(e) => setInfoForm({...infoForm, office_title: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <textarea
                placeholder="অফিসের ঠিকানা"
                value={infoForm.office_address || ''}
                onChange={(e) => setInfoForm({...infoForm, office_address: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="অবস্থান"
                value={infoForm.office_location || ''}
                onChange={(e) => setInfoForm({...infoForm, office_location: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="কার্যক্রমের সময়"
                value={infoForm.office_hours || ''}
                onChange={(e) => setInfoForm({...infoForm, office_hours: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="অফিস ফোন"
                  value={infoForm.office_phone || ''}
                  onChange={(e) => setInfoForm({...infoForm, office_phone: e.target.value})}
                  className="px-3 py-2 border rounded-lg"
                />
                <input
                  type="email"
                  placeholder="অফিস ইমেইল"
                  value={infoForm.office_email || ''}
                  onChange={(e) => setInfoForm({...infoForm, office_email: e.target.value})}
                  className="px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <h3 className="font-semibold mt-4">জরুরি যোগাযোগ</h3>
            <input
              type="text"
              placeholder="জরুরি ফোন"
              value={infoForm.emergency_phone || ''}
              onChange={(e) => setInfoForm({...infoForm, emergency_phone: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </Modal>
      )}

      {/* Social Modal */}
      {showSocialModal && (
        <Modal
          title={editingSocial ? 'সোশ্যাল লিংক সম্পাদনা' : 'নতুন সোশ্যাল লিংক'}
          onClose={() => {
            setShowSocialModal(false);
            setEditingSocial(null);
            resetSocialForm();
          }}
          onSubmit={handleSocialSubmit}
          submitting={submitting}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="প্ল্যাটফর্ম (যেমন: ফেসবুক)"
              value={socialForm.platform}
              onChange={(e) => setSocialForm({...socialForm, platform: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="হ্যান্ডেল (যেমন: @username)"
              value={socialForm.handle}
              onChange={(e) => setSocialForm({...socialForm, handle: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="url"
              placeholder="URL"
              value={socialForm.url}
              onChange={(e) => setSocialForm({...socialForm, url: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="আইকন (যেমন: 📘)"
                value={socialForm.icon || ''}
                onChange={(e) => setSocialForm({...socialForm, icon: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="text"
                placeholder="রঙ (যেমন: bg-blue-600)"
                value={socialForm.color || ''}
                onChange={(e) => setSocialForm({...socialForm, color: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={socialForm.is_active}
                  onChange={(e) => setSocialForm({...socialForm, is_active: e.target.checked})}
                  className="w-4 h-4"
                />
                সক্রিয়
              </label>
              <input
                type="number"
                placeholder="ক্রম"
                value={socialForm.sort_order}
                onChange={(e) => setSocialForm({...socialForm, sort_order: parseInt(e.target.value)})}
                className="w-20 px-3 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Team Modal */}
      {showTeamModal && (
        <Modal
          title={editingTeam ? 'টিম মেম্বার সম্পাদনা' : 'নতুন টিম মেম্বার'}
          onClose={() => {
            setShowTeamModal(false);
            setEditingTeam(null);
            resetTeamForm();
          }}
          onSubmit={handleTeamSubmit}
          submitting={submitting}
        >
          <div className="space-y-4">
            {teamForm.image_url && (
              <div className="relative w-32 h-32 mx-auto">
                <Image
                  src={teamForm.image_url}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleTeamImageUpload}
              className="w-full"
            />
            <input
              type="text"
              placeholder="নাম"
              value={teamForm.name}
              onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="পদবি"
              value={teamForm.role}
              onChange={(e) => setTeamForm({...teamForm, role: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="ফোন"
                value={teamForm.phone || ''}
                onChange={(e) => setTeamForm({...teamForm, phone: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
              <input
                type="email"
                placeholder="ইমেইল"
                value={teamForm.email || ''}
                onChange={(e) => setTeamForm({...teamForm, email: e.target.value})}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
            <input
              type="text"
              placeholder="প্রাপ্তিসময়"
              value={teamForm.availability || ''}
              onChange={(e) => setTeamForm({...teamForm, availability: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={teamForm.is_active}
                  onChange={(e) => setTeamForm({...teamForm, is_active: e.target.checked})}
                  className="w-4 h-4"
                />
                সক্রিয়
              </label>
              <input
                type="number"
                placeholder="ক্রম"
                value={teamForm.sort_order}
                onChange={(e) => setTeamForm({...teamForm, sort_order: parseInt(e.target.value)})}
                className="w-20 px-3 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Office Modal */}
      {showOfficeModal && (
        <Modal
          title={editingOffice ? 'অফিস সম্পাদনা' : 'নতুন অফিস'}
          onClose={() => {
            setShowOfficeModal(false);
            setEditingOffice(null);
            resetOfficeForm();
          }}
          onSubmit={handleOfficeSubmit}
          submitting={submitting}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="শহর"
              value={officeForm.city}
              onChange={(e) => setOfficeForm({...officeForm, city: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="ঠিকানা"
              value={officeForm.address}
              onChange={(e) => setOfficeForm({...officeForm, address: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="ফোন"
              value={officeForm.phone || ''}
              onChange={(e) => setOfficeForm({...officeForm, phone: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="কার্যক্রমের সময়"
              value={officeForm.hours || ''}
              onChange={(e) => setOfficeForm({...officeForm, hours: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="url"
              placeholder="গুগল ম্যাপ লিংক"
              value={officeForm.map_link || ''}
              onChange={(e) => setOfficeForm({...officeForm, map_link: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={officeForm.is_head_office}
                  onChange={(e) => setOfficeForm({...officeForm, is_head_office: e.target.checked})}
                  className="w-4 h-4"
                />
                প্রধান কার্যালয়
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={officeForm.is_active}
                  onChange={(e) => setOfficeForm({...officeForm, is_active: e.target.checked})}
                  className="w-4 h-4"
                />
                সক্রিয়
              </label>
              <input
                type="number"
                placeholder="ক্রম"
                value={officeForm.sort_order}
                onChange={(e) => setOfficeForm({...officeForm, sort_order: parseInt(e.target.value)})}
                className="w-20 px-3 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* FAQ Modal */}
      {showFaqModal && (
        <Modal
          title={editingFaq ? 'FAQ সম্পাদনা' : 'নতুন FAQ'}
          onClose={() => {
            setShowFaqModal(false);
            setEditingFaq(null);
            resetFaqForm();
          }}
          onSubmit={handleFaqSubmit}
          submitting={submitting}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="প্রশ্ন"
              value={faqForm.question}
              onChange={(e) => setFaqForm({...faqForm, question: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <textarea
              placeholder="উত্তর"
              value={faqForm.answer}
              onChange={(e) => setFaqForm({...faqForm, answer: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="ক্যাটাগরি"
              value={faqForm.category || ''}
              onChange={(e) => setFaqForm({...faqForm, category: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={faqForm.is_active}
                  onChange={(e) => setFaqForm({...faqForm, is_active: e.target.checked})}
                  className="w-4 h-4"
                />
                সক্রিয়
              </label>
              <input
                type="number"
                placeholder="ক্রম"
                value={faqForm.sort_order}
                onChange={(e) => setFaqForm({...faqForm, sort_order: parseInt(e.target.value)})}
                className="w-20 px-3 py-2 border rounded-lg"
                min="0"
              />
            </div>
          </div>
        </Modal>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <Modal
          title="পেইজ সেটিংস সম্পাদনা"
          onClose={() => setShowSettingsModal(false)}
          onSubmit={handleSettingsSubmit}
          submitting={submitting}
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="হেডার টাইটেল"
              value={settingsForm.header_title || ''}
              onChange={(e) => setSettingsForm({...settingsForm, header_title: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <textarea
              placeholder="হেডার সাবটাইটেল"
              value={settingsForm.header_subtitle || ''}
              onChange={(e) => setSettingsForm({...settingsForm, header_subtitle: e.target.value})}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settingsForm.email_notifications}
                  onChange={(e) => setSettingsForm({...settingsForm, email_notifications: e.target.checked})}
                  className="w-4 h-4"
                />
                ইমেইল নোটিফিকেশন সক্রিয়
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settingsForm.auto_reply_enabled}
                  onChange={(e) => setSettingsForm({...settingsForm, auto_reply_enabled: e.target.checked})}
                  className="w-4 h-4"
                />
                অটো-রিপ্লাই সক্রিয়
              </label>
            </div>
            {settingsForm.auto_reply_enabled && (
              <>
                <input
                  type="text"
                  placeholder="অটো-রিপ্লাই সাবজেক্ট"
                  value={settingsForm.auto_reply_subject || ''}
                  onChange={(e) => setSettingsForm({...settingsForm, auto_reply_subject: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                <textarea
                  placeholder="অটো-রিপ্লাই বার্তা"
                  value={settingsForm.auto_reply_message || ''}
                  onChange={(e) => setSettingsForm({...settingsForm, auto_reply_message: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

// Message Modal Component
function MessageModal({ 
  message, 
  files, 
  onClose, 
  onStatusChange, 
  onPriorityChange, 
  onNoteAdd, 
  onDelete 
}: {
  message: ContactMessage;
  files: ContactFile[];
  onClose: () => void;
  onStatusChange: (status: string) => Promise<void>;
  onPriorityChange: (priority: string) => Promise<void>;
  onNoteAdd: (note: string) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [note, setNote] = useState(message.notes || '');
  const [saving, setSaving] = useState(false);

  const handleSaveNote = async () => {
    setSaving(true);
    await onNoteAdd(note);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">বার্তা #{message.id}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xl">
                  {message.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{message.name}</h3>
                  <p className="text-gray-500">{message.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={message.status}
                  onChange={(e) => onStatusChange(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="pending">অপেক্ষমান</option>
                  <option value="read">পঠিত</option>
                  <option value="replied">উত্তর দেওয়া</option>
                  <option value="archived">আর্কাইভ</option>
                </select>
                <select
                  value={message.priority}
                  onChange={(e) => onPriorityChange(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="low">নিম্ন</option>
                  <option value="normal">স্বাভাবিক</option>
                  <option value="high">উচ্চ</option>
                  <option value="urgent">জরুরি</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">ফোন</p>
                <p className="font-medium">{message.phone || 'নেই'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">বিষয়</p>
                <p className="font-medium">{message.subject}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">বার্তা</h4>
              <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                {message.message}
              </p>
            </div>

            {files.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">সংযুক্ত ফাইল</h4>
                <div className="space-y-2">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{file.file_name}</span>
                      </div>
                      <a
                        href={file.file_url}
                        download
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">নোট</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="এই বার্তা সম্পর্কে নোট লিখুন..."
              />
              <button
                onClick={handleSaveNote}
                disabled={saving}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'সেভ হচ্ছে...' : 'নোট সংরক্ষণ'}
              </button>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => window.location.href = `mailto:${message.email}`}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                ইমেইল উত্তর
              </button>
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                ডিলিট
              </button>
            </div>
          </div>
        </div>
      </div>
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