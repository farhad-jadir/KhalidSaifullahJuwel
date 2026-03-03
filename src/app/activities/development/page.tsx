// khalid/src/app/activities/development/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import { Building, Lightbulb, Target, Calendar, MapPin, TrendingUp } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface DevelopmentProject {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: string;
  progress: number;
  budget: string | null;
  timeline: string | null;
  status: string;
  image_url: string | null; // null allowed
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_featured: boolean;
}

interface ProjectDetail {
  id: number;
  label: string;
  value: string;
}

interface DevelopmentStat {
  id: number;
  label: string;
  value: string;
  icon: string;
  description: string | null;
}

interface FuturePlan {
  id: number;
  title: string;
  description: string;
  timeline: string;
  icon: string;
  category: string | null;
  image_url: string | null;
  status: string;
}

export default function DevelopmentActivitiesPage() {
  const [projects, setProjects] = useState<DevelopmentProject[]>([]);
  const [projectDetails, setProjectDetails] = useState<{ [key: number]: ProjectDetail[] }>({});
  const [stats, setStats] = useState<DevelopmentStat[]>([]);
  const [plans, setPlans] = useState<FuturePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('development_projects')
        .select('*')
        .order('sort_order', { ascending: true });

      if (projectsError) throw projectsError;

      // Load project details
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

      // Load stats
      const { data: statsData, error: statsError } = await supabase
        .from('development_stats')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

      if (statsError) throw statsError;

      // Load future plans
      const { data: plansData, error: plansError } = await supabase
        .from('future_plans')
        .select('*')
        .eq('status', 'planned')
        .order('sort_order', { ascending: true });

      if (plansError) throw plansError;

      setProjects(projectsData || []);
      setProjectDetails(detailsMap);
      setStats(statsData || []);
      setPlans(plansData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('ডাটা লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'যোগাযোগ': '🛣️',
      'ধর্মীয়': '🕌',
      'পানি সম্পদ': '💧',
      'বিদ্যুৎ': '⚡',
      'শিক্ষা': '📚',
      'স্বাস্থ্য': '🏥',
      'অবকাঠামো': '🏗️',
      'কৃষি': '🌾',
      'শিল্প': '🏭',
    };
    return icons[category] || '📌';
  };

  // Get status color
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'ongoing': 'bg-green-100 text-green-800',
      'completed': 'bg-blue-100 text-blue-800',
      'planned': 'bg-purple-100 text-purple-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Get status text
  const getStatusText = (status: string) => {
    const texts: { [key: string]: string } = {
      'ongoing': 'চলমান',
      'completed': 'সম্পন্ন',
      'planned': 'পরিকল্পিত',
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">উন্নয়নমূলক কার্যক্রম</h1>
            <p className="text-xl max-w-3xl mx-auto font-bangla">
              এলাকার সার্বিক উন্নয়নে বাস্তবমুখী উদ্যোগ
            </p>
          </div>
        </section>

        {/* Loading Spinner */}
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🏗️</span>
            </div>
          </div>
          <p className="text-gray-600 font-bangla mt-4 ml-4">তথ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">উন্নয়নমূলক কার্যক্রম</h1>
            <p className="text-xl max-w-3xl mx-auto font-bangla">
              এলাকার সার্বিক উন্নয়নে বাস্তবমুখী উদ্যোগ
            </p>
          </div>
        </section>

        {/* Error Message */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
            <p className="text-5xl mb-4">😢</p>
            <p className="text-red-600 font-bangla text-lg mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bangla"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayStats = stats.length > 0 ? stats : defaultStats;
  const displayProjects = projects.length > 0 ? projects : defaultProjects;
  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">উন্নয়নমূলক কার্যক্রম</h1>
          <p className="text-xl max-w-3xl mx-auto font-bangla">
            এলাকার সার্বিক উন্নয়নে বাস্তবমুখী উদ্যোগ
          </p>
        </div>
      </section>

      {/* Progress Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {displayStats.map((stat) => (
              <div key={stat.id} className="text-center group hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-bangla">{stat.label}</div>
                {stat.description && (
                  <div className="text-xs text-gray-400 mt-1">{stat.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 font-bangla">সম্পাদিত উন্নয়ন কর্মকাণ্ড</h2>
        <div className="space-y-8">
          {displayProjects.map((project) => {
            const details = projectDetails[project.id] || [];
            return (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-1 group">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/4">
                    {project.image_url ? (
                      <div className="relative h-48 w-full rounded-2xl overflow-hidden">
                        <Image
                          src={project.image_url}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 25vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white text-center h-48 flex flex-col items-center justify-center">
                        <div className="text-6xl mb-2">{project.icon || getCategoryIcon(project.category)}</div>
                        <div className="text-lg font-semibold font-bangla">{project.category}</div>
                      </div>
                    )}
                  </div>
                  <div className="md:w-3/4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold font-bangla text-gray-800 group-hover:text-green-600 transition-colors">
                        {project.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(project.status)} font-bangla`}>
                        {getStatusText(project.status)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 font-bangla leading-relaxed">
                      {project.description}
                    </p>

                    {project.location && (
                      <div className="flex items-center text-gray-500 text-sm mb-2">
                        <MapPin size={16} className="mr-1" />
                        <span className="font-bangla">{project.location}</span>
                      </div>
                    )}

                    {/* Project Details */}
                    {(details.length > 0 || project.budget || project.timeline) && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        {project.budget && (
                          <div className="text-sm bg-gray-50 p-2 rounded-lg">
                            <span className="font-semibold text-green-600 font-bangla">ব্যয়:</span>
                            <span className="text-gray-700 ml-2 font-bangla">{project.budget}</span>
                          </div>
                        )}
                        {project.timeline && (
                          <div className="text-sm bg-gray-50 p-2 rounded-lg">
                            <span className="font-semibold text-green-600 font-bangla">মেয়াদ:</span>
                            <span className="text-gray-700 ml-2 font-bangla">{project.timeline}</span>
                          </div>
                        )}
                        {details.map((detail, idx) => (
                          <div key={idx} className="text-sm bg-gray-50 p-2 rounded-lg">
                            <span className="font-semibold text-green-600 font-bangla">{detail.label}:</span>
                            <span className="text-gray-700 ml-2 font-bangla">{detail.value}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500 font-bangla">অগ্রগতি</span>
                        <span className="text-green-600 font-bold">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Project Dates */}
                    {(project.start_date || project.end_date) && (
                      <div className="flex flex-wrap gap-4 mt-4 text-xs text-gray-400">
                        {project.start_date && (
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            <span className="font-bangla">শুরু: {new Date(project.start_date).toLocaleDateString('bn-BD', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                        )}
                        {project.end_date && (
                          <div className="flex items-center">
                            <Calendar size={12} className="mr-1" />
                            <span className="font-bangla">শেষ: {new Date(project.end_date).toLocaleDateString('bn-BD', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Future Plans */}
      <section className="bg-gradient-to-r from-green-800 to-green-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 font-bangla">ভবিষ্যৎ পরিকল্পনা</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {displayPlans.map((plan) => (
              <div 
                key={plan.id} 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all hover:scale-105"
              >
                {plan.image_url ? (
                  <div className="relative h-32 w-32 mx-auto mb-4">
                    <div className="relative w-full h-full rounded-lg overflow-hidden">
                      <Image
                        src={plan.image_url}
                        alt={plan.title}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-5xl mb-4 text-center">{plan.icon}</div>
                )}
                <h3 className="text-xl font-bold mb-3 font-bangla text-center">{plan.title}</h3>
                <p className="text-green-100 mb-4 text-center font-bangla">{plan.description}</p>
                {plan.category && (
                  <p className="text-sm text-green-300 text-center mb-2">{plan.category}</p>
                )}
                <p className="text-sm text-green-300 text-center font-bangla">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  সম্ভাব্য সময়: {plan.timeline}
                </p>
              </div>
            ))}
          </div>

          {displayPlans.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">🔮</p>
              <p className="text-green-100 font-bangla text-lg">কোনো ভবিষ্যৎ পরিকল্পনা নেই</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats Footer */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{projects.length}</div>
              <div className="text-sm text-gray-500 font-bangla">মোট প্রকল্প</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'ongoing').length}
              </div>
              <div className="text-sm text-gray-500 font-bangla">চলমান</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-500 font-bangla">সম্পন্ন</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{plans.length}</div>
              <div className="text-sm text-gray-500 font-bangla">ভবিষ্যৎ পরিকল্পনা</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Default data
const defaultStats = [
  { id: 1, value: "১৫০+", label: "উন্নয়ন প্রকল্প", icon: "🏗️", description: "সরকারি ও বেসরকারি", status: "active", sort_order: 1 },
  { id: 2, value: "৫০কি.মি.", label: "রাস্তা নির্মাণ", icon: "🛣️", description: "পাকা রাস্তা", status: "active", sort_order: 2 },
  { id: 3, value: "২০টি", label: "শিক্ষাপ্রতিষ্ঠান", icon: "📚", description: "স্কুল ও কলেজ", status: "active", sort_order: 3 },
  { id: 4, value: "১০০%", label: "বিদ্যুতায়ন", icon: "⚡", description: "সবুজ বিদ্যুৎ", status: "active", sort_order: 4 }
];

const defaultProjects = [
  {
    id: 1,
    title: "আঞ্চলিক সড়ক উন্নয়ন",
    description: "৫০ কিলোমিটার আঞ্চলিক সড়ক প্রশস্তকরণ ও পুনঃনির্মাণ। এলাকার যোগাযোগ ব্যবস্থার আধুনিকায়ন।",
    category: "যোগাযোগ",
    icon: "🛣️",
    progress: 85,
    budget: "৫০ কোটি টাকা",
    timeline: "২০২৪",
    status: "ongoing",
    image_url: null,
    location: "ঢাকা",
    start_date: "2023-01-15",
    end_date: "2024-12-30",
    is_featured: true
  },
  {
    id: 2,
    title: "মডেল মসজিদ কমপ্লেক্স",
    description: "আধুনিক সুবিধাসম্পন্ন মডেল মসজিদ ও ইসলামিক সাংস্কৃতিক কেন্দ্র। নামাজের পাশাপাশি সাংস্কৃতিক কার্যক্রমের ব্যবস্থা।",
    category: "ধর্মীয়",
    icon: "🕌",
    progress: 70,
    budget: "৩০ কোটি টাকা",
    timeline: "২০২৪-২৫",
    status: "ongoing",
    image_url: null,
    location: "চট্টগ্রাম",
    start_date: "2023-06-01",
    end_date: "2025-03-30",
    is_featured: false
  },
  {
    id: 3,
    title: "নদী খনন প্রকল্প",
    description: "বর্ষা মৌসুমে বন্যা নিয়ন্ত্রণে নদী খনন ও পুনরুদ্ধার। পানির প্রবাহ স্বাভাবিক রাখা ও নাব্যতা ফিরিয়ে আনা।",
    category: "পানি সম্পদ",
    icon: "💧",
    progress: 60,
    budget: "২৫ কোটি টাকা",
    timeline: "২০২৫",
    status: "ongoing",
    image_url: null,
    location: "রাজশাহী",
    start_date: "2023-09-10",
    end_date: "2025-06-30",
    is_featured: false
  },
  {
    id: 4,
    title: "সৌর বিদ্যুৎ প্রকল্প",
    description: "গ্রামীণ এলাকায় সৌর প্যানেল স্থাপন ও বিদ্যুৎ সংযোগ। পরিবেশবান্ধব জ্বালানি উৎপাদন ও সরবরাহ।",
    category: "বিদ্যুৎ",
    icon: "☀️",
    progress: 100,
    budget: "১৫ কোটি টাকা",
    timeline: "২০২৩",
    status: "completed",
    image_url: null,
    location: "সিলেট",
    start_date: "2022-01-01",
    end_date: "2023-12-31",
    is_featured: true
  }
];

const defaultPlans = [
  {
    id: 1,
    title: "ডিজিটাল সেন্টার",
    description: "প্রতিটি ইউনিয়নে ডিজিটাল সার্ভিস সেন্টার স্থাপন",
    timeline: "২০২৫",
    icon: "💻",
    category: "ডিজিটাল",
    image_url: null,
    status: "planned"
  },
  {
    id: 2,
    title: "শিল্প পার্ক",
    description: "ক্ষুদ্র ও মাঝারি শিল্পের জন্য শিল্প পার্ক নির্মাণ",
    timeline: "২০২৬",
    icon: "🏭",
    category: "শিল্প",
    image_url: null,
    status: "planned"
  },
  {
    id: 3,
    title: "মেডিকেল কলেজ",
    description: "আধুনিক মেডিকেল কলেজ ও হাসপাতাল স্থাপন",
    timeline: "২০২৭",
    icon: "🏥",
    category: "স্বাস্থ্য",
    image_url: null,
    status: "planned"
  }
];