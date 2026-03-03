// khalid/src/app/admin/activities/development/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Building, Lightbulb, Target, Calendar, MapPin, TrendingUp, ChevronDown } from 'lucide-react';

// ========== টাইপ ডিফিনেশন ==========
interface DevelopmentProject {
  id?: number;
  title: string;
  description: string;
  category: string;
  icon: string;
  progress: number;
  budget?: string | null;
  timeline?: string | null;
  status: 'active' | 'completed' | 'ongoing' | 'planned';
  image_url?: string | null;
  image_path?: string | null;
  location?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  sort_order?: number;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

interface ProjectDetail {
  id?: number;
  project_id?: number;
  label: string;
  value: string;
  sort_order?: number;
}

interface DevelopmentStat {
  id?: number;
  label: string;
  value: string;
  icon: string;
  description?: string | null;
  sort_order?: number;
  status: 'active' | 'inactive';
}

interface FuturePlan {
  id?: number;
  title: string;
  description: string;
  timeline: string;
  icon: string;
  category?: string | null;
  image_url?: string | null;
  image_path?: string | null;
  sort_order?: number;
  status: 'planned' | 'approved' | 'ongoing';
  created_at?: string;
  updated_at?: string;
  created_by?: string;
}

// ========== কনস্ট্যান্ট ডিফিনেশন ==========
const PROJECT_CATEGORIES = [
  { value: 'যোগাযোগ', label: 'যোগাযোগ', icon: '🛣️' },
  { value: 'ধর্মীয়', label: 'ধর্মীয়', icon: '🕌' },
  { value: 'পানি সম্পদ', label: 'পানি সম্পদ', icon: '💧' },
  { value: 'বিদ্যুৎ', label: 'বিদ্যুৎ', icon: '⚡' },
  { value: 'শিক্ষা', label: 'শিক্ষা', icon: '📚' },
  { value: 'স্বাস্থ্য', label: 'স্বাস্থ্য', icon: '🏥' },
  { value: 'অবকাঠামো', label: 'অবকাঠামো', icon: '🏗️' },
  { value: 'কৃষি', label: 'কৃষি', icon: '🌾' },
  { value: 'শিল্প', label: 'শিল্প', icon: '🏭' },
  { value: 'অন্যান্য', label: 'অন্যান্য', icon: '📌' }
];

const PROJECT_STATUSES = [
  { value: 'ongoing', label: 'চলমান', color: 'green' },
  { value: 'completed', label: 'সম্পন্ন', color: 'blue' },
  { value: 'planned', label: 'পরিকল্পিত', color: 'purple' },
  { value: 'active', label: 'সক্রিয়', color: 'green' }
];

const PLAN_STATUSES = [
  { value: 'planned', label: 'পরিকল্পিত', color: 'purple' },
  { value: 'approved', label: 'অনুমোদিত', color: 'green' },
  { value: 'ongoing', label: 'চলমান', color: 'blue' }
];

// Supabase ক্লায়েন্ট
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDevelopmentActivities() {
  const router = useRouter();
  const [projects, setProjects] = useState<DevelopmentProject[]>([]);
  const [projectDetails, setProjectDetails] = useState<{ [key: number]: ProjectDetail[] }>({});
  const [stats, setStats] = useState<DevelopmentStat[]>([]);
  const [plans, setPlans] = useState<FuturePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showStatModal, setShowStatModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editingProject, setEditingProject] = useState<DevelopmentProject | null>(null);
  const [editingStat, setEditingStat] = useState<DevelopmentStat | null>(null);
  const [editingPlan, setEditingPlan] = useState<FuturePlan | null>(null);
  const [selectedProject, setSelectedProject] = useState<DevelopmentProject | null>(null);
  const [projectDetailList, setProjectDetailList] = useState<ProjectDetail[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'stats' | 'plans'>('projects');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ফর্ম স্টেট - Projects
  const [projectFormData, setProjectFormData] = useState<Partial<DevelopmentProject>>({
    title: '',
    description: '',
    category: 'অবকাঠামো',
    icon: '🏗️',
    progress: 0,
    budget: '',
    timeline: '',
    status: 'ongoing',
    location: '',
    start_date: '',
    end_date: '',
    sort_order: 0,
    is_featured: false,
    image_url: null,
    image_path: null
  });

  // ফর্ম স্টেট - Stats
  const [statFormData, setStatFormData] = useState<Partial<DevelopmentStat>>({
    label: '',
    value: '',
    icon: '📊',
    description: '',
    sort_order: 0,
    status: 'active'
  });

  // ফর্ম স্টেট - Plans
  const [planFormData, setPlanFormData] = useState<Partial<FuturePlan>>({
    title: '',
    description: '',
    timeline: '',
    icon: '🔮',
    category: '',
    sort_order: 0,
    status: 'planned',
    image_url: null,
    image_path: null
  });

  // Detail Form State
  const [detailFormData, setDetailFormData] = useState<ProjectDetail>({
    label: '',
    value: ''
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
      
      // Load projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('development_projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

      // Load project details for each project
      const detailsMap: { [key: number]: ProjectDetail[] } = {};
      for (const project of projectsData || []) {
        const { data: detailsData } = await supabase
          .from('project_details')
          .select('*')
          .eq('project_id', project.id)
          .order('sort_order', { ascending: true });
        
        if (detailsData) {
          detailsMap[project.id] = detailsData;
        }
      }
      setProjectDetails(detailsMap);

      // Load stats
      const { data: statsData, error: statsError } = await supabase
        .from('development_stats')
        .select('*')
        .order('sort_order', { ascending: true });

      if (statsError) throw statsError;
      setStats(statsData || []);

      // Load future plans
      const { data: plansData, error: plansError } = await supabase
        .from('future_plans')
        .select('*')
        .order('sort_order', { ascending: true });

      if (plansError) throw plansError;
      setPlans(plansData || []);
    } catch (error) {
      console.error('Load error:', error);
      toast.error('ডাটা লোড করতে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  // ইমেজ আপলোড (Projects)
  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const filePath = `development/projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('development')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('development')
        .getPublicUrl(filePath);

      setProjectFormData(prev => ({
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

  // Plan Image Upload
  const handlePlanImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const filePath = `development/plans/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('development')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('development')
        .getPublicUrl(filePath);

      setPlanFormData(prev => ({
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

  // Project Submit
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast.error('আপনি লগইন করেননি');
        return;
      }

      if (!projectFormData.title?.trim()) {
        toast.error('শিরোনাম দিন');
        return;
      }
      if (!projectFormData.description?.trim()) {
        toast.error('বিবরণ দিন');
        return;
      }

      const projectData = {
        ...projectFormData,
        title: projectFormData.title.trim(),
        description: projectFormData.description.trim(),
        updated_at: new Date().toISOString()
      };

      let projectId: number;

      if (editingProject) {
        const { error } = await supabase
          .from('development_projects')
          .update(projectData)
          .eq('id', editingProject.id);

        if (error) throw error;
        projectId = editingProject.id!;
        toast.success('তথ্য আপডেট হয়েছে');
      } else {
        const { data, error } = await supabase
          .from('development_projects')
          .insert([{
            ...projectData,
            created_by: userData.user.id,
            created_at: new Date().toISOString()
          }])
          .select();

        if (error) throw error;
        projectId = data[0].id;
        toast.success('নতুন প্রকল্প যোগ হয়েছে');
      }

      setShowProjectModal(false);
      setEditingProject(null);
      resetProjectForm();
      loadData();

      // If this is a new project, open details modal
      if (!editingProject) {
        setSelectedProject({ ...projectData, id: projectId } as DevelopmentProject);
        setProjectDetailList([]);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  // Add Detail
  const handleAddDetail = () => {
    if (!detailFormData.label.trim() || !detailFormData.value.trim()) {
      toast.error('লেবেল এবং ভ্যালু দিন');
      return;
    }

    setProjectDetailList([
      ...projectDetailList,
      { ...detailFormData, sort_order: projectDetailList.length }
    ]);

    setDetailFormData({ label: '', value: '' });
  };

  // Remove Detail
  const handleRemoveDetail = (index: number) => {
    setProjectDetailList(projectDetailList.filter((_, i) => i !== index));
  };

  // Save Details
  const handleSaveDetails = async () => {
    if (!selectedProject?.id) return;

    try {
      // Delete existing details
      await supabase
        .from('project_details')
        .delete()
        .eq('project_id', selectedProject.id);

      // Insert new details
      if (projectDetailList.length > 0) {
        const { error } = await supabase
          .from('project_details')
          .insert(projectDetailList.map(detail => ({
            ...detail,
            project_id: selectedProject.id
          })));

        if (error) throw error;
      }

      toast.success('বিস্তারিত তথ্য সংরক্ষিত হয়েছে');
      setShowDetailsModal(false);
      setSelectedProject(null);
      setProjectDetailList([]);
      loadData();
    } catch (error) {
      console.error('Error saving details:', error);
      toast.error('বিস্তারিত তথ্য সংরক্ষণে সমস্যা হয়েছে');
    }
  };

  // Stat Submit
  const handleStatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!statFormData.label?.trim()) {
        toast.error('লেবেল দিন');
        return;
      }
      if (!statFormData.value?.trim()) {
        toast.error('ভ্যালু দিন');
        return;
      }

      if (editingStat) {
        const { error } = await supabase
          .from('development_stats')
          .update({
            ...statFormData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingStat.id);

        if (error) throw error;
        toast.success('পরিসংখ্যান আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('development_stats')
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

  // Plan Submit
  const handlePlanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (!userData.user) {
        toast.error('আপনি লগইন করেননি');
        return;
      }

      if (!planFormData.title?.trim()) {
        toast.error('শিরোনাম দিন');
        return;
      }
      if (!planFormData.description?.trim()) {
        toast.error('বিবরণ দিন');
        return;
      }
      if (!planFormData.timeline?.trim()) {
        toast.error('সময়সীমা দিন');
        return;
      }

      if (editingPlan) {
        const { error } = await supabase
          .from('future_plans')
          .update({
            ...planFormData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingPlan.id);

        if (error) throw error;
        toast.success('পরিকল্পনা আপডেট হয়েছে');
      } else {
        const { error } = await supabase
          .from('future_plans')
          .insert([{
            ...planFormData,
            created_by: userData.user.id,
            created_at: new Date().toISOString()
          }]);

        if (error) throw error;
        toast.success('নতুন পরিকল্পনা যোগ হয়েছে');
      }

      setShowPlanModal(false);
      setEditingPlan(null);
      resetPlanForm();
      loadData();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Project
  const handleProjectDelete = async (id: number, imagePath?: string | null) => {
    if (!confirm('আপনি কি এই প্রকল্পটি মুছে ফেলতে চান? সাথে এর সকল বিস্তারিত তথ্যও মুছে যাবে।')) return;

    try {
      if (imagePath) {
        await supabase.storage
          .from('development')
          .remove([imagePath]);
      }

      const { error } = await supabase
        .from('development_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('প্রকল্প মুছে ফেলা হয়েছে');
      loadData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  // Delete Stat
  const handleStatDelete = async (id: number) => {
    if (!confirm('আপনি কি এই পরিসংখ্যানটি মুছে ফেলতে চান?')) return;

    try {
      const { error } = await supabase
        .from('development_stats')
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

  // Delete Plan
  const handlePlanDelete = async (id: number, imagePath?: string | null) => {
    if (!confirm('আপনি কি এই পরিকল্পনাটি মুছে ফেলতে চান?')) return;

    try {
      if (imagePath) {
        await supabase.storage
          .from('development')
          .remove([imagePath]);
      }

      const { error } = await supabase
        .from('future_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('পরিকল্পনা মুছে ফেলা হয়েছে');
      loadData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('মুছে ফেলতে সমস্যা হয়েছে');
    }
  };

  const resetProjectForm = () => {
    setProjectFormData({
      title: '',
      description: '',
      category: 'অবকাঠামো',
      icon: '🏗️',
      progress: 0,
      budget: '',
      timeline: '',
      status: 'ongoing',
      location: '',
      start_date: '',
      end_date: '',
      sort_order: 0,
      is_featured: false,
      image_url: null,
      image_path: null
    });
  };

  const resetStatForm = () => {
    setStatFormData({
      label: '',
      value: '',
      icon: '📊',
      description: '',
      sort_order: 0,
      status: 'active'
    });
  };

  const resetPlanForm = () => {
    setPlanFormData({
      title: '',
      description: '',
      timeline: '',
      icon: '🔮',
      category: '',
      sort_order: 0,
      status: 'planned',
      image_url: null,
      image_path: null
    });
  };

  const handleProjectEdit = (project: DevelopmentProject) => {
    setEditingProject(project);
    setProjectFormData({
      ...project,
      start_date: project.start_date || '',
      end_date: project.end_date || ''
    });
    setShowProjectModal(true);
  };

  const handleStatEdit = (stat: DevelopmentStat) => {
    setEditingStat(stat);
    setStatFormData(stat);
    setShowStatModal(true);
  };

  const handlePlanEdit = (plan: FuturePlan) => {
    setEditingPlan(plan);
    setPlanFormData(plan);
    setShowPlanModal(true);
  };

  const handleManageDetails = (project: DevelopmentProject) => {
    setSelectedProject(project);
    setProjectDetailList(projectDetails[project.id!] || []);
    setShowDetailsModal(true);
  };

  // মোবাইলের জন্য প্রকল্প কার্ড ভিউ
  const renderProjectMobileCards = () => {
    return (
      <div className="space-y-4 sm:hidden">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              {/* ছবি/আইকন */}
              <div className="flex-shrink-0">
                {project.image_url ? (
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                    {project.icon}
                  </div>
                )}
              </div>

              {/* কন্টেন্ট */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-medium text-gray-900 font-bangla truncate">
                    {project.title}
                  </h3>
                  {project.is_featured && (
                    <span className="text-yellow-500 ml-2">★</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 font-bangla line-clamp-2 mt-1">
                  {project.description}
                </p>
                
                {/* ট্যাগ ও তথ্য */}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {PROJECT_CATEGORIES.find(c => c.value === project.category)?.icon}{' '}
                    {project.category}
                  </span>
                  <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full
                    ${project.status === 'ongoing' ? 'bg-green-100 text-green-800' : 
                      project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'}`}>
                    {PROJECT_STATUSES.find(s => s.value === project.status)?.label}
                  </span>
                </div>

                {/* অগ্রগতি */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-600 font-bangla">অগ্রগতি</span>
                    <span className="text-gray-900 font-semibold">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* অবস্থান ও সময়সীমা */}
                <div className="mt-2 space-y-1">
                  {project.location && (
                    <p className="text-xs text-gray-600 font-bangla flex items-center">
                      <MapPin size={12} className="mr-1" />
                      {project.location}
                    </p>
                  )}
                  {project.timeline && (
                    <p className="text-xs text-gray-600 font-bangla flex items-center">
                      <Calendar size={12} className="mr-1" />
                      {project.timeline}
                    </p>
                  )}
                </div>

                {/* বিস্তারিত তথ্য বাটন */}
                <div className="mt-2">
                  <button
                    onClick={() => handleManageDetails(project)}
                    className="text-xs text-green-600 hover:text-green-700 font-bangla flex items-center gap-1"
                  >
                    <span>📋</span>
                    <span>বিস্তারিত তথ্য ({(projectDetails[project.id!] || []).length}টি)</span>
                  </button>
                </div>
              </div>

              {/* অ্যাকশন বাটন */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleProjectEdit(project)}
                  className="text-green-600 hover:text-green-900 text-sm font-bangla"
                >
                  এডিট
                </button>
                <button
                  onClick={() => handleProjectDelete(project.id!, project.image_path)}
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
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{stat.icon}</div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 font-bangla">
                    {stat.label}
                  </h3>
                  <p className="text-xl font-bold text-green-600 font-bangla mt-1">
                    {stat.value}
                  </p>
                  {stat.description && (
                    <p className="text-xs text-gray-500 font-bangla mt-1">
                      {stat.description}
                    </p>
                  )}
                  <div className="mt-2">
                    <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full
                      ${stat.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {stat.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                    </span>
                  </div>
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

  // মোবাইলের জন্য পরিকল্পনা কার্ড ভিউ
  const renderPlanMobileCards = () => {
    return (
      <div className="space-y-4 sm:hidden">
        {plans.map((plan) => (
          <div key={plan.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex items-start space-x-3">
              {/* ছবি/আইকন */}
              <div className="flex-shrink-0">
                {plan.image_url ? (
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                    <Image
                      src={plan.image_url}
                      alt={plan.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-3xl">
                    {plan.icon}
                  </div>
                )}
              </div>

              {/* কন্টেন্ট */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 font-bangla truncate">
                  {plan.title}
                </h3>
                <p className="text-sm text-gray-500 font-bangla line-clamp-2 mt-1">
                  {plan.description}
                </p>
                
                {/* ট্যাগ ও তথ্য */}
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full
                    ${plan.status === 'planned' ? 'bg-purple-100 text-purple-800' : 
                      plan.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'}`}>
                    {PLAN_STATUSES.find(s => s.value === plan.status)?.label}
                  </span>
                  {plan.category && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                      {plan.category}
                    </span>
                  )}
                </div>

                {/* সময়সীমা */}
                <div className="mt-2">
                  <p className="text-xs text-gray-600 font-bangla flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {plan.timeline}
                  </p>
                </div>
              </div>

              {/* অ্যাকশন বাটন */}
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handlePlanEdit(plan)}
                  className="text-green-600 hover:text-green-900 text-sm font-bangla"
                >
                  এডিট
                </button>
                <button
                  onClick={() => handlePlanDelete(plan.id!, plan.image_path)}
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
                উন্নয়নমূলক কার্যক্রম ব্যবস্থাপনা
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-bangla mt-1">
                মোট {projects.length}টি প্রকল্প, {stats.length}টি পরিসংখ্যান, {plans.length}টি পরিকল্পনা
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
                      resetStatForm();
                      setEditingStat(null);
                      setShowStatModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-bangla flex items-center justify-center gap-2"
                  >
                    <TrendingUp size={18} />
                    <span>নতুন পরিসংখ্যান</span>
                  </button>
                  <button
                    onClick={() => {
                      resetPlanForm();
                      setEditingPlan(null);
                      setShowPlanModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bangla flex items-center justify-center gap-2"
                  >
                    <Lightbulb size={18} />
                    <span>নতুন পরিকল্পনা</span>
                  </button>
                  <button
                    onClick={() => {
                      resetProjectForm();
                      setEditingProject(null);
                      setShowProjectModal(true);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bangla flex items-center justify-center gap-2"
                  >
                    <Building size={18} />
                    <span>নতুন প্রকল্প</span>
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
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-bangla flex items-center gap-2 text-sm"
                >
                  <TrendingUp size={18} />
                  <span>নতুন পরিসংখ্যান</span>
                </button>
                <button
                  onClick={() => {
                    resetPlanForm();
                    setEditingPlan(null);
                    setShowPlanModal(true);
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bangla flex items-center gap-2 text-sm"
                >
                  <Lightbulb size={18} />
                  <span>নতুন পরিকল্পনা</span>
                </button>
                <button
                  onClick={() => {
                    resetProjectForm();
                    setEditingProject(null);
                    setShowProjectModal(true);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bangla flex items-center gap-2 text-sm"
                >
                  <Building size={18} />
                  <span>নতুন প্রকল্প</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs - Responsive */}
          <div className="flex gap-2 sm:gap-4 mt-4 sm:mt-6 border-b overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 sm:px-4 py-2 font-bangla text-sm sm:text-base transition-colors relative whitespace-nowrap ${
                activeTab === 'projects'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              প্রকল্প সমূহ ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-3 sm:px-4 py-2 font-bangla text-sm sm:text-base transition-colors relative whitespace-nowrap ${
                activeTab === 'stats'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              পরিসংখ্যান ({stats.length})
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-3 sm:px-4 py-2 font-bangla text-sm sm:text-base transition-colors relative whitespace-nowrap ${
                activeTab === 'plans'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              ভবিষ্যৎ পরিকল্পনা ({plans.length})
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
        ) : activeTab === 'projects' ? (
          <>
            {/* Projects Mobile Cards */}
            {renderProjectMobileCards()}

            {/* Projects Desktop Table */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
              {projects.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <p className="text-3xl sm:text-4xl mb-4">🏗️</p>
                  <p className="text-gray-500 font-bangla text-base sm:text-lg mb-4">কোনো প্রকল্প পাওয়া যায়নি</p>
                  <button
                    onClick={() => {
                      resetProjectForm();
                      setEditingProject(null);
                      setShowProjectModal(true);
                    }}
                    className="text-green-600 hover:text-green-700 font-bangla text-sm sm:text-base"
                  >
                    + প্রথম প্রকল্প যোগ করুন
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
                          ক্যাটাগরি
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          অগ্রগতি
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          অবস্থা
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          বিস্তারিত
                        </th>
                        <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider font-bangla">
                          অ্যাকশন
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {projects.map((project) => (
                        <tr key={project.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            {project.image_url ? (
                              <div className="relative h-10 w-10 rounded-lg overflow-hidden">
                                <Image
                                  src={project.image_url}
                                  alt={project.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                                {project.icon}
                              </div>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 font-bangla">
                              {project.title.length > 30 ? project.title.substring(0, 30) + '...' : project.title}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 font-bangla line-clamp-1">
                              {project.description.length > 50 ? project.description.substring(0, 50) + '...' : project.description}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className="text-xs sm:text-sm text-gray-900 font-bangla">
                              {project.category}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-xs sm:text-sm text-gray-900 mr-2">{project.progress}%</span>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${project.status === 'ongoing' ? 'bg-green-100 text-green-800' : 
                                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-purple-100 text-purple-800'}`}>
                              {PROJECT_STATUSES.find(s => s.value === project.status)?.label || project.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleManageDetails(project)}
                              className="text-xs sm:text-sm text-green-600 hover:text-green-700 font-bangla flex items-center gap-1"
                            >
                              <span>📋</span>
                              <span>{(projectDetails[project.id!] || []).length}টি</span>
                            </button>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                            <button
                              onClick={() => handleProjectEdit(project)}
                              className="text-green-600 hover:text-green-900 mr-2 sm:mr-3 font-bangla"
                            >
                              এডিট
                            </button>
                            <button
                              onClick={() => handleProjectDelete(project.id!, project.image_path)}
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
        ) : activeTab === 'stats' ? (
          <>
            {/* Stats Mobile Cards */}
            {renderStatMobileCards()}

            {/* Stats Desktop Table */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
              {stats.length === 0 ? (
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
                          বিবরণ
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
                      {stats.map((stat) => (
                        <tr key={stat.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xl sm:text-2xl">
                            {stat.icon}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 font-bangla">
                              {stat.label}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-bangla">
                            {stat.value}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="text-xs sm:text-sm text-gray-500 font-bangla">
                              {stat.description ? (stat.description.length > 30 ? stat.description.substring(0, 30) + '...' : stat.description) : '-'}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${stat.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {stat.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                            </span>
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
        ) : (
          <>
            {/* Future Plans Mobile Cards */}
            {renderPlanMobileCards()}

            {/* Future Plans Desktop Table */}
            <div className="hidden sm:block bg-white rounded-lg shadow overflow-hidden">
              {plans.length === 0 ? (
                <div className="p-8 sm:p-12 text-center">
                  <p className="text-3xl sm:text-4xl mb-4">🔮</p>
                  <p className="text-gray-500 font-bangla text-base sm:text-lg mb-4">কোনো পরিকল্পনা পাওয়া যায়নি</p>
                  <button
                    onClick={() => {
                      resetPlanForm();
                      setEditingPlan(null);
                      setShowPlanModal(true);
                    }}
                    className="text-green-600 hover:text-green-700 font-bangla text-sm sm:text-base"
                  >
                    + প্রথম পরিকল্পনা যোগ করুন
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
                          সময়সীমা
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
                      {plans.map((plan) => (
                        <tr key={plan.id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            {plan.image_url ? (
                              <div className="relative h-10 w-10 rounded-lg overflow-hidden">
                                <Image
                                  src={plan.image_url}
                                  alt={plan.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="h-10 w-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                                {plan.icon}
                              </div>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="text-sm font-medium text-gray-900 font-bangla">
                              {plan.title.length > 30 ? plan.title.substring(0, 30) + '...' : plan.title}
                            </div>
                            <div className="text-xs sm:text-sm text-gray-500 font-bangla line-clamp-1">
                              {plan.description.length > 50 ? plan.description.substring(0, 50) + '...' : plan.description}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900 font-bangla">
                            {plan.timeline}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                              ${plan.status === 'planned' ? 'bg-purple-100 text-purple-800' : 
                                plan.status === 'approved' ? 'bg-green-100 text-green-800' :
                                'bg-blue-100 text-blue-800'}`}>
                              {PLAN_STATUSES.find(s => s.value === plan.status)?.label || plan.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
                            <button
                              onClick={() => handlePlanEdit(plan)}
                              className="text-green-600 hover:text-green-900 mr-2 sm:mr-3 font-bangla"
                            >
                              এডিট
                            </button>
                            <button
                              onClick={() => handlePlanDelete(plan.id!, plan.image_path)}
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

      {/* Project Modal - সম্পূর্ণ রেস্পন্সিভ */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold font-bangla">
                  {editingProject ? 'প্রকল্প সম্পাদনা' : 'নতুন প্রকল্প'}
                </h2>
                <button
                  onClick={() => {
                    setShowProjectModal(false);
                    setEditingProject(null);
                    resetProjectForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleProjectSubmit} className="space-y-4">
                {/* Image Upload - Responsive */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-bangla">
                    ছবি
                  </label>
                  <div className="space-y-3">
                    {projectFormData.image_url && (
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={projectFormData.image_url}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (projectFormData.image_path) {
                              await supabase.storage
                                .from('development')
                                .remove([projectFormData.image_path]);
                            }
                            setProjectFormData(prev => ({
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
                      onChange={handleProjectImageUpload}
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
                    value={projectFormData.title}
                    onChange={(e) => setProjectFormData({...projectFormData, title: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="যেমন: আঞ্চলিক সড়ক উন্নয়ন"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    বিবরণ *
                  </label>
                  <textarea
                    required
                    value={projectFormData.description}
                    onChange={(e) => setProjectFormData({...projectFormData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="প্রকল্পের বিবরণ লিখুন..."
                  />
                </div>

                {/* Category and Icon - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      ক্যাটাগরি *
                    </label>
                    <select
                      required
                      value={projectFormData.category}
                      onChange={(e) => setProjectFormData({...projectFormData, category: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    >
                      {PROJECT_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      আইকন
                    </label>
                    <input
                      type="text"
                      value={projectFormData.icon}
                      onChange={(e) => setProjectFormData({...projectFormData, icon: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="যেমন: 🏗️"
                      maxLength={2}
                    />
                  </div>
                </div>

                {/* Progress and Status - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      অগ্রগতি (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={projectFormData.progress}
                      onChange={(e) => setProjectFormData({...projectFormData, progress: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      অবস্থা *
                    </label>
                    <select
                      required
                      value={projectFormData.status}
                      onChange={(e) => setProjectFormData({...projectFormData, status: e.target.value as any})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    >
                      {PROJECT_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Budget and Timeline - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      বাজেট
                    </label>
                    <input
                      type="text"
                      value={projectFormData.budget || ''}
                      onChange={(e) => setProjectFormData({...projectFormData, budget: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                      placeholder="যেমন: ৫০ কোটি টাকা"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      সময়সীমা
                    </label>
                    <input
                      type="text"
                      value={projectFormData.timeline || ''}
                      onChange={(e) => setProjectFormData({...projectFormData, timeline: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                      placeholder="যেমন: ২০২৪"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    অবস্থান
                  </label>
                  <input
                    type="text"
                    value={projectFormData.location || ''}
                    onChange={(e) => setProjectFormData({...projectFormData, location: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="যেমন: ঢাকা"
                  />
                </div>

                {/* Start and End Date - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      শুরুর তারিখ
                    </label>
                    <input
                      type="date"
                      value={projectFormData.start_date || ''}
                      onChange={(e) => setProjectFormData({...projectFormData, start_date: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      শেষের তারিখ
                    </label>
                    <input
                      type="date"
                      value={projectFormData.end_date || ''}
                      onChange={(e) => setProjectFormData({...projectFormData, end_date: e.target.value})}
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
                      value={projectFormData.sort_order || 0}
                      onChange={(e) => setProjectFormData({...projectFormData, sort_order: parseInt(e.target.value)})}
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
                        checked={projectFormData.is_featured || false}
                        onChange={(e) => setProjectFormData({...projectFormData, is_featured: e.target.checked})}
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
                      setShowProjectModal(false);
                      setEditingProject(null);
                      resetProjectForm();
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

      {/* Project Details Modal - সম্পূর্ণ রেস্পন্সিভ */}
      {showDetailsModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold font-bangla">
                  বিস্তারিত তথ্য: {selectedProject.title}
                </h2>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedProject(null);
                    setProjectDetailList([]);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>

              {/* Add Detail Form - Responsive */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-3 font-bangla text-sm sm:text-base">নতুন বিস্তারিত তথ্য যোগ করুন</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    placeholder="লেবেল (যেমন: দৈর্ঘ্য)"
                    value={detailFormData.label}
                    onChange={(e) => setDetailFormData({...detailFormData, label: e.target.value})}
                    className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                  />
                  <input
                    type="text"
                    placeholder="ভ্যালু (যেমন: ৫০ কিমি)"
                    value={detailFormData.value}
                    onChange={(e) => setDetailFormData({...detailFormData, value: e.target.value})}
                    className="px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddDetail}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bangla text-sm sm:text-base"
                >
                  + যোগ করুন
                </button>
              </div>

              {/* Details List - Responsive */}
              <div className="space-y-2 max-h-60 overflow-y-auto mb-6">
                {projectDetailList.map((detail, index) => (
                  <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-3 rounded-lg gap-2">
                    <div className="text-sm sm:text-base">
                      <span className="font-semibold text-gray-700">{detail.label}:</span>
                      <span className="ml-2 text-gray-600">{detail.value}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveDetail(index)}
                      className="text-red-600 hover:text-red-700 text-sm sm:text-base self-end sm:self-auto"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {projectDetailList.length === 0 && (
                  <p className="text-center text-gray-500 py-4 font-bangla text-sm sm:text-base">
                    কোনো বিস্তারিত তথ্য যোগ করা হয়নি
                  </p>
                )}
              </div>

              {/* Buttons - Responsive */}
              <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-3">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedProject(null);
                    setProjectDetailList([]);
                  }}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-bangla text-sm sm:text-base"
                >
                  বাতিল
                </button>
                <button
                  onClick={handleSaveDetails}
                  className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-bangla text-sm sm:text-base"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal - সম্পূর্ণ রেস্পন্সিভ */}
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
                    placeholder="যেমন: উন্নয়ন প্রকল্প"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    সংখ্যা *
                  </label>
                  <input
                    type="text"
                    required
                    value={statFormData.value}
                    onChange={(e) => setStatFormData({...statFormData, value: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="যেমন: ১৫০+"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    বিবরণ
                  </label>
                  <input
                    type="text"
                    value={statFormData.description || ''}
                    onChange={(e) => setStatFormData({...statFormData, description: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="ঐচ্ছিক"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      ক্রম
                    </label>
                    <input
                      type="number"
                      value={statFormData.sort_order || 0}
                      onChange={(e) => setStatFormData({...statFormData, sort_order: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      অবস্থা
                    </label>
                    <select
                      value={statFormData.status}
                      onChange={(e) => setStatFormData({...statFormData, status: e.target.value as any})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    >
                      <option value="active">সক্রিয়</option>
                      <option value="inactive">নিষ্ক্রিয়</option>
                    </select>
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

      {/* Plan Modal - সম্পূর্ণ রেস্পন্সিভ */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-bold font-bangla">
                  {editingPlan ? 'পরিকল্পনা সম্পাদনা' : 'নতুন পরিকল্পনা'}
                </h2>
                <button
                  onClick={() => {
                    setShowPlanModal(false);
                    setEditingPlan(null);
                    resetPlanForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handlePlanSubmit} className="space-y-4">
                {/* Image Upload - Responsive */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-bangla">
                    ছবি
                  </label>
                  <div className="space-y-3">
                    {planFormData.image_url && (
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={planFormData.image_url}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            if (planFormData.image_path) {
                              await supabase.storage
                                .from('development')
                                .remove([planFormData.image_path]);
                            }
                            setPlanFormData(prev => ({
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
                      onChange={handlePlanImageUpload}
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
                    value={planFormData.title}
                    onChange={(e) => setPlanFormData({...planFormData, title: e.target.value})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="যেমন: ডিজিটাল সেন্টার"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    বিবরণ *
                  </label>
                  <textarea
                    required
                    value={planFormData.description}
                    onChange={(e) => setPlanFormData({...planFormData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    placeholder="পরিকল্পনার বিবরণ লিখুন..."
                  />
                </div>

                {/* Timeline and Icon - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      সময়সীমা *
                    </label>
                    <input
                      type="text"
                      required
                      value={planFormData.timeline}
                      onChange={(e) => setPlanFormData({...planFormData, timeline: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                      placeholder="যেমন: ২০২৫"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      আইকন
                    </label>
                    <input
                      type="text"
                      value={planFormData.icon}
                      onChange={(e) => setPlanFormData({...planFormData, icon: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                      placeholder="যেমন: 🔮"
                      maxLength={2}
                    />
                  </div>
                </div>

                {/* Category and Status - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      ক্যাটাগরি
                    </label>
                    <input
                      type="text"
                      value={planFormData.category || ''}
                      onChange={(e) => setPlanFormData({...planFormData, category: e.target.value})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                      placeholder="যেমন: ডিজিটাল"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                      অবস্থা *
                    </label>
                    <select
                      required
                      value={planFormData.status}
                      onChange={(e) => setPlanFormData({...planFormData, status: e.target.value as any})}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 font-bangla"
                    >
                      {PLAN_STATUSES.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 font-bangla">
                    সাজানোর ক্রম
                  </label>
                  <input
                    type="number"
                    value={planFormData.sort_order || 0}
                    onChange={(e) => setPlanFormData({...planFormData, sort_order: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="0"
                    min="0"
                  />
                </div>

                {/* Buttons - Responsive */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPlanModal(false);
                      setEditingPlan(null);
                      resetPlanForm();
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