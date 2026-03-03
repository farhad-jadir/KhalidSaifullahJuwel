// app/activities/political/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';

// Supabase ক্লায়েন্ট তৈরি
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// টাইপ ডিফাইন
interface PoliticalActivity {
  id: number;
  title: string;
  description: string;
  date: string;
  activity_type: string;
  status: string;
  image_url: string | null;
  location: string | null;
  event_date: string | null;
  sort_order: number;
  created_at: string;
}

// অ্যাক্টিভিটি টাইপের জন্য আইকন ম্যাপিং
const ACTIVITY_ICONS: { [key: string]: string } = {
  public_meeting: '🎤',
  party_meeting: '👥',
  human_chain: '🤝',
  procession: '🚩',
  advisory_meeting: '📋',
  grassroots_visit: '🌾',
  others: '📌'
};

const ACTIVITY_LABELS: { [key: string]: string } = {
  public_meeting: 'জনসভা ও সমাবেশ',
  party_meeting: 'দলীয় সভা',
  human_chain: 'মানববন্ধন',
  procession: 'শোভাযাত্রা',
  advisory_meeting: 'উপদেষ্টা সভা',
  grassroots_visit: 'তৃণমূল সফর',
  others: 'অন্যান্য'
};

export default function PoliticalActivitiesPage() {
  const [activities, setActivities] = useState<PoliticalActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('political_activities')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        setError('ডাটা লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।');
        return;
      }

      if (!data || data.length === 0) {
        setActivities(defaultActivities);
      } else {
        setActivities(data);
      }
      
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।');
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    return ACTIVITY_ICONS[type] || '📌';
  };

  const getActivityTitle = (activity: PoliticalActivity) => {
    if (activity.title) return activity.title;
    return ACTIVITY_LABELS[activity.activity_type] || 'অন্যান্য কার্যক্রম';
  };

  // লোডিং স্টেট
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">রাজনৈতিক কার্যক্রম</h1>
            <p className="text-xl max-w-3xl mx-auto font-bangla">
              জনগণের সেবায় নিবেদিত রাজনৈতিক কর্মকাণ্ড
            </p>
          </div>
        </section>

        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🌾</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // এরর স্টেট
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">রাজনৈতিক কার্যক্রম</h1>
            <p className="text-xl max-w-3xl mx-auto font-bangla">
              জনগণের সেবায় নিবেদিত রাজনৈতিক কর্মকাণ্ড
            </p>
          </div>
        </section>

        <div className="text-center py-20">
          <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-md mx-auto">
            <p className="text-xl mb-4">⚠️</p>
            <p className="font-bangla">{error}</p>
            <button 
              onClick={loadActivities}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bangla"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">রাজনৈতিক কার্যক্রম</h1>
          <p className="text-xl max-w-3xl mx-auto font-bangla">
            জনগণের সেবায় নিবেদিত রাজনৈতিক কর্মকাণ্ড
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {activities.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-gray-500 font-bangla text-lg">কোনো কার্যক্রম পাওয়া যায়নি</p>
              <p className="text-gray-400 font-bangla mt-2">শীঘ্রই নতুন কার্যক্রম যুক্ত হবে</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <div 
                key={activity.id} 
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                {activity.image_url ? (
                  <div className="h-48 relative overflow-hidden">
                    <Image
                      src={activity.image_url}
                      alt={getActivityTitle(activity)}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-4xl">{getActivityIcon(activity.activity_type)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <span className="text-7xl transform group-hover:scale-110 transition-transform duration-300">
                      {getActivityIcon(activity.activity_type)}
                    </span>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold font-bangla text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2">
                      {getActivityTitle(activity)}
                    </h3>
                    <span className="text-2xl ml-2 flex-shrink-0">
                      {getActivityIcon(activity.activity_type)}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 font-bangla leading-relaxed line-clamp-3">
                    {activity.description}
                  </p>

                  {activity.location && (
                    <div className="flex items-center text-gray-500 text-sm mb-2 font-bangla">
                      <span className="mr-1">📍</span>
                      <span>{activity.location}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-green-600 font-semibold">
                      <span className="mr-1">📅</span>
                      <span className="font-bangla">{activity.date}</span>
                    </div>
                    
                    <div className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full font-bangla">
                      {ACTIVITY_LABELS[activity.activity_type] || 'চলমান'}
                    </div>
                  </div>

                  {activity.event_date && activity.event_date !== activity.date && (
                    <div className="mt-2 text-xs text-gray-400 font-bangla flex items-center">
                      <span className="mr-1">🗓️</span>
                      <span>ইভেন্ট: {new Date(activity.event_date).toLocaleDateString('bn-BD', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activities.length > 0 && (
          <div className="text-center mt-12 text-gray-500 font-bangla">
            <p>মোট {activities.length}টি সক্রিয় কার্যক্রম</p>
          </div>
        )}
      </section>

      <section className="bg-green-50 py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4 font-bangla">
            আপনার এলাকার কার্যক্রম সম্পর্কে জানতে চান?
          </h2>
          <p className="text-gray-600 mb-6 font-bangla">
            আমাদের সাথে যোগাযোগ করুন অথবা স্থানীয় দলীয় অফিসে যোগ দিন
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/contact" 
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bangla"
            >
              যোগাযোগ করুন
            </Link>
            <Link 
              href="/about" 
              className="px-6 py-3 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors font-bangla"
            >
              আরও জানুন
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// ডিফল্ট ডাটা
const defaultActivities: PoliticalActivity[] = [
  {
    id: 1,
    title: "জনসভা ও সমাবেশ",
    description: "বিভিন্ন উপজেলা ও ইউনিয়নে জনসভা করে সাধারণ মানুষের মতামত গ্রহণ",
    date: "চলমান",
    activity_type: "public_meeting",
    status: "active",
    image_url: null,
    location: "সারাদেশে",
    event_date: null,
    sort_order: 1,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "দলীয় সভা",
    description: "নিয়মিত দলীয় সভা ও আলোচনা সভা আয়োজন",
    date: "সাপ্তাহিক",
    activity_type: "party_meeting",
    status: "active",
    image_url: null,
    location: "ঢাকা",
    event_date: null,
    sort_order: 2,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "মানববন্ধন",
    description: "জনস্বার্থ সংক্রান্ত বিষয়ে মানববন্ধন ও প্রতিবাদ সমাবেশ",
    date: "প্রয়োজন অনুযায়ী",
    activity_type: "human_chain",
    status: "active",
    image_url: null,
    location: "বিভিন্ন স্থানে",
    event_date: null,
    sort_order: 3,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "শোভাযাত্রা",
    description: "বিভিন্ন জাতীয় দিবস ও উৎসব উপলক্ষে শোভাযাত্রা",
    date: "বছরব্যাপী",
    activity_type: "procession",
    status: "active",
    image_url: null,
    location: "সারাদেশে",
    event_date: null,
    sort_order: 4,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: "উপদেষ্টা সভা",
    description: "দলীয় নেতাকর্মীদের সাথে উপদেষ্টা সভা ও মতবিনিময়",
    date: "মাসিক",
    activity_type: "advisory_meeting",
    status: "active",
    image_url: null,
    location: "ঢাকা",
    event_date: null,
    sort_order: 5,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    title: "তৃণমূল সফর",
    description: "তৃণমূল পর্যায়ে গিয়ে সাধারণ মানুষের সাথে মতবিনিময়",
    date: "নিয়মিত",
    activity_type: "grassroots_visit",
    status: "active",
    image_url: null,
    location: "গ্রামাঞ্চলে",
    event_date: null,
    sort_order: 6,
    created_at: new Date().toISOString()
  }
];