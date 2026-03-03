// khalid/src/app/social-activities/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SocialActivity {
  id: number;
  title: string;
  description: string;
  beneficiaries: string;
  icon: string;
  activity_type: string;
  status: string;
  image_url: string | null;
  location: string | null;
  event_date: string | null;
  sort_order: number;
  created_at: string;
}

interface SocialStatistic {
  id: number;
  label: string;
  number: string;
  icon: string;
  status: string;
  sort_order: number;
}

// অ্যাক্টিভিটি টাইপের জন্য কালার ম্যাপিং
const ACTIVITY_COLORS: { [key: string]: string } = {
  medical: 'from-blue-400 to-blue-600',
  education: 'from-purple-400 to-purple-600',
  winter: 'from-cyan-400 to-cyan-600',
  eid: 'from-yellow-400 to-yellow-600',
  blood: 'from-red-400 to-red-600',
  elderly: 'from-indigo-400 to-indigo-600',
  others: 'from-gray-400 to-gray-600'
};

export default function SocialActivitiesPage() {
  const [activities, setActivities] = useState<SocialActivity[]>([]);
  const [statistics, setStatistics] = useState<SocialStatistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load activities
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('social_activities')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;

      // Load statistics
      const { data: statisticsData, error: statisticsError } = await supabase
        .from('social_statistics')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

      if (statisticsError) throw statisticsError;

      setActivities(activitiesData || []);
      setStatistics(statisticsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('ডাটা লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  // টাইপ অনুযায়ী ফিল্টার করা activities
  const filteredActivities = selectedType === 'all' 
    ? activities 
    : activities.filter(a => a.activity_type === selectedType);

  // ইউনিক টাইপ গুলো বের করা
  const activityTypes = ['all', ...new Set(activities.map(a => a.activity_type))];

  const getActivityColor = (type: string) => {
    return ACTIVITY_COLORS[type] || 'from-green-400 to-green-600';
  };

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      medical: 'চিকিৎসা সেবা',
      education: 'শিক্ষা বৃত্তি',
      winter: 'শীতবস্ত্র বিতরণ',
      eid: 'ঈদ উপহার',
      blood: 'রক্তদান কর্মসূচি',
      elderly: 'বয়স্ক ভাতা',
      others: 'অন্যান্য',
      all: 'সবগুলো'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section with Skeleton */}
        <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">সামাজিক কার্যক্রম</h1>
            <p className="text-xl max-w-3xl mx-auto font-bangla">
              মানবতার সেবায় নিরলস প্রচেষ্টা
            </p>
          </div>
        </section>

        {/* Loading Spinner */}
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🤝</span>
            </div>
          </div>
          <p className="text-gray-600 font-bangla mt-4">তথ্য লোড হচ্ছে...</p>
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">সামাজিক কার্যক্রম</h1>
            <p className="text-xl max-w-3xl mx-auto font-bangla">
              মানবতার সেবায় নিরলস প্রচেষ্টা
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

  const displayStatistics = statistics.length > 0 ? statistics : defaultStatistics;
  const displayActivities = filteredActivities.length > 0 ? filteredActivities : 
    (selectedType === 'all' ? defaultActivities : []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">সামাজিক কার্যক্রম</h1>
          <p className="text-xl max-w-3xl mx-auto font-bangla">
            মানবতার সেবায় নিরলস প্রচেষ্টা
          </p>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayStatistics.map((stat, index) => (
            <div 
              key={stat.id} 
              className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-green-600 mb-2 font-bangla">{stat.number}</div>
              <div className="text-gray-600 font-bangla">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Buttons */}
      {activities.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="flex flex-wrap gap-2 justify-center">
            {activityTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-full transition-all duration-300 font-bangla ${
                  selectedType === type
                    ? 'bg-green-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {getTypeLabel(type)}
                {type !== 'all' && (
                  <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                    {activities.filter(a => a.activity_type === type).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Activities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 font-bangla">
          {selectedType === 'all' ? 'আমাদের সামাজিক কর্মকাণ্ড' : getTypeLabel(selectedType)}
        </h2>
        
        {displayActivities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <p className="text-4xl mb-4">📭</p>
            <p className="text-gray-500 font-bangla text-lg">
              এই ক্যাটাগরিতে কোনো কার্যক্রম পাওয়া যায়নি
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {displayActivities.map((activity, index) => (
              <div 
                key={activity.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Card Header with Image/Icon */}
                <div className={`h-48 bg-gradient-to-r ${getActivityColor(activity.activity_type)} relative overflow-hidden`}>
                  {activity.image_url ? (
                    <Image
                      src={activity.image_url}
                      alt={activity.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-8xl opacity-20 select-none">{activity.icon}</span>
                    </div>
                  )}
                  
                  {/* Icon Overlay */}
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <span className="text-3xl">{activity.icon}</span>
                  </div>

                  {/* Beneficiaries Badge */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="text-green-600 font-bold font-bangla">{activity.beneficiaries} জন</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold font-bangla text-gray-800 group-hover:text-green-600 transition-colors">
                      {activity.title}
                    </h3>
                    <span className="text-sm px-3 py-1 bg-green-100 text-green-600 rounded-full font-bangla">
                      {getTypeLabel(activity.activity_type)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 font-bangla leading-relaxed">
                    {activity.description}
                  </p>

                  {/* Location and Date */}
                  <div className="space-y-2">
                    {activity.location && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="mr-2">📍</span>
                        <span className="font-bangla">{activity.location}</span>
                      </div>
                    )}
                    
                    {activity.event_date && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <span className="mr-2">📅</span>
                        <span className="font-bangla">
                          {new Date(activity.event_date).toLocaleDateString('bn-BD', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar (example) */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500 font-bangla">অগ্রগতি</span>
                      <span className="text-green-600 font-bold">১০০%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: '100%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-green-800 to-green-900 text-white py-16 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 font-bangla">আপনিও অংশ নিতে পারেন</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-bangla">
            আমাদের সামাজিক কার্যক্রমে যুক্ত হয়ে মানবতার সেবায় অবদান রাখুন
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/volunteer"
              className="px-8 py-3 bg-white text-green-800 rounded-lg hover:bg-gray-100 transition-colors font-bangla text-lg font-semibold"
            >
              স্বেচ্ছাসেবক হোন
            </Link>
            <Link
              href="/donate"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-bangla text-lg font-semibold"
            >
              দান করুন
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 font-bangla">
          <p>মোট {activities.length}টি সক্রিয় কার্যক্রম চলমান রয়েছে</p>
          <p className="text-sm mt-2">
            সর্বশেষ আপডেট: {new Date().toLocaleDateString('bn-BD')}
          </p>
        </div>
      </section>
    </div>
  );
}

// Default data (fallback)
const defaultStatistics = [
  { id: 1, number: "৫০০০+", label: "উপকৃত পরিবার", icon: "🏠", status: "active", sort_order: 1 },
  { id: 2, number: "১০০+", label: "চিকিৎসা ক্যাম্প", icon: "🏥", status: "active", sort_order: 2 },
  { id: 3, number: "৫০০+", label: "বৃত্তি প্রদান", icon: "📚", status: "active", sort_order: 3 },
  { id: 4, number: "১০০০+", label: "স্বেচ্ছাসেবক", icon: "🤝", status: "active", sort_order: 4 }
];

const defaultActivities = [
  {
    id: 1,
    title: "চিকিৎসা সেবা",
    description: "বিনামূল্যে চিকিৎসা ক্যাম্প ও ওষুধ বিতরণ কর্মসূচি। প্রতিমাসে বিভিন্ন এলাকায় বিশেষজ্ঞ ডাক্তারদের নিয়ে ফ্রি চিকিৎসা ক্যাম্প পরিচালনা করা হয়।",
    beneficiaries: "২৫০০+",
    icon: "🏥",
    activity_type: "medical",
    status: "active",
    image_url: null,
    location: "সারাদেশে",
    event_date: new Date().toISOString(),
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "শিক্ষা বৃত্তি",
    description: "মেধাবী ও দরিদ্র শিক্ষার্থীদের বৃত্তি প্রদান। উচ্চশিক্ষায় আগ্রহী কিন্তু আর্থিকভাবে অস্বচ্ছল শিক্ষার্থীদের জন্য বিশেষ বৃত্তি কর্মসূচি।",
    beneficiaries: "৫০০+",
    icon: "📚",
    activity_type: "education",
    status: "active",
    image_url: null,
    location: "ঢাকা",
    event_date: null,
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "শীতবস্ত্র বিতরণ",
    description: "শীতার্ত মানুষের মাঝে কম্বল ও শীতবস্ত্র বিতরণ। প্রতিবছর শীত মৌসুমে দেশের বিভিন্ন প্রান্তে শীতার্ত মানুষের মাঝে উষ্ণ পোশাক বিতরণ করা হয়।",
    beneficiaries: "৩০০০+",
    icon: "🧥",
    activity_type: "winter",
    status: "active",
    image_url: null,
    location: "উত্তরবঙ্গ",
    event_date: null,
    sort_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "ঈদ উপহার",
    description: "দরিদ্র পরিবারের মাঝে ঈদ সামগ্রী বিতরণ। প্রতিটি ঈদে অসহায় পরিবারের মাঝে ঈদের নতুন জামা ও খাদ্যসামগ্রী পৌঁছে দেওয়া হয়।",
    beneficiaries: "২০০০+",
    icon: "🎁",
    activity_type: "eid",
    status: "active",
    image_url: null,
    location: "সারাদেশে",
    event_date: null,
    sort_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: "রক্তদান কর্মসূচি",
    description: "নিয়মিত রক্তদান ক্যাম্প ও সচেতনতা মূলক কার্যক্রম। প্রতি মাসে বিভিন্ন এলাকায় রক্তদান ক্যাম্পের আয়োজন করা হয়।",
    beneficiaries: "১০০০+",
    icon: "🩸",
    activity_type: "blood",
    status: "active",
    image_url: null,
    location: "ঢাকা, চট্টগ্রাম",
    event_date: null,
    sort_order: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    title: "বয়স্ক ভাতা",
    description: "বয়স্ক ও অসহায় মানুষের জন্য আর্থিক সহায়তা। প্রতিমাসে নির্বাচিত বয়স্ক ও অসহায় ব্যক্তিদের আর্থিক সহায়তা প্রদান করা হয়।",
    beneficiaries: "৫০০+",
    icon: "👴",
    activity_type: "elderly",
    status: "active",
    image_url: null,
    location: "গ্রামাঞ্চলে",
    event_date: null,
    sort_order: 6,
    created_at: new Date().toISOString()
  }
];