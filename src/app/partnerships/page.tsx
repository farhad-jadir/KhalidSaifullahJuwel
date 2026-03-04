// khalid/src/app/partnerships/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PartnershipCategory {
  id: number;
  name: string;
  icon: string;
  description: string | null;
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
  is_featured: boolean;
  status: string;
}

interface CollaborationType {
  id: number;
  name: string;
  count: string;
  color: string;
}

interface PartnershipStat {
  id: number;
  label: string;
  value: string;
  icon: string | null;
  description: string | null;
}

export default function PartnershipsPage() {
  const [categories, setCategories] = useState<PartnershipCategory[]>([]);
  const [partnerships, setPartnerships] = useState<Partnership[]>([]);
  const [collaborationTypes, setCollaborationTypes] = useState<CollaborationType[]>([]);
  const [stats, setStats] = useState<PartnershipStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load categories
      const { data: categoriesData } = await supabase
        .from('partnership_categories')
        .select('*')
        .eq('status', 'active')
        .order('sort_order');

      // Load partnerships
      const { data: partnershipsData } = await supabase
        .from('partnerships')
        .select('*')
        .eq('status', 'active')
        .order('sort_order');

      // Load collaboration types
      const { data: collaborationData } = await supabase
        .from('collaboration_types')
        .select('*')
        .eq('status', 'active')
        .order('sort_order');

      // Load stats
      const { data: statsData } = await supabase
        .from('partnership_stats')
        .select('*')
        .eq('status', 'active')
        .order('sort_order');

      setCategories(categoriesData || []);
      setPartnerships(partnershipsData || []);
      setCollaborationTypes(collaborationData || []);
      setStats(statsData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      setError('ডাটা লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  // ক্যাটাগরি অনুযায়ী পার্টনার ফিল্টার
  const filteredPartnerships = selectedCategory === 'all'
    ? partnerships
    : partnerships.filter(p => p.category_id === selectedCategory);

  // ক্যাটাগরি অনুযায়ী পার্টনার গ্রুপ
  const partnershipsByCategory = categories.map(category => ({
    ...category,
    partners: partnerships.filter(p => p.category_id === category.id)
  })).filter(c => c.partners.length > 0);

  // ফিচার্ড পার্টনার
  const featuredPartners = partnerships.filter(p => p.is_featured);

  // পরিসংখ্যান - উপরের কার্ডে দেখানোর জন্য
  const partnershipStats = {
    total: partnerships.length,
    categories: categories.length,
    activePartners: partnerships.filter(p => p.status === 'active').length,
    featuredCount: partnerships.filter(p => p.is_featured).length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="animate-pulse">
              <div className="h-6 w-32 bg-blue-200 rounded-full mx-auto mb-4"></div>
              <div className="h-12 w-64 bg-gray-200 rounded-lg mx-auto mb-4"></div>
              <div className="h-4 w-96 bg-gray-200 rounded-lg mx-auto"></div>
            </div>
          </div>

          {/* Stats Skeleton */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-md p-6 text-center animate-pulse">
                <div className="h-8 w-16 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                <div className="h-4 w-20 bg-gray-200 rounded-lg mx-auto"></div>
              </div>
            ))}
          </div>

          {/* Loading Spinner */}
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">🤝</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              পার্টনারশিপ
            </h1>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4 animate-bounce">😢</div>
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayStats = stats.length > 0 ? stats : defaultStats;
  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  const displayCollaborationTypes = collaborationTypes.length > 0 ? collaborationTypes : defaultCollaborationTypes;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            একসাথে কাজ করি
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            পার্টনারশিপ
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            বিভিন্ন সংস্থা ও প্রতিষ্ঠানের সাথে খালেদ সাইফুল্লাহ জুয়েলের পার্টনারশিপ 
            ও সহযোগিতার সম্পর্ক
          </p>
        </div>

        {/* Stats Cards - Supabase থেকে আসা ডাটা দেখাবে */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {displayStats.map((stat, index) => (
            <div 
              key={stat.id} 
              className="bg-white rounded-xl shadow-md p-6 text-center border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1 animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
              {stat.description && (
                <div className="text-xs text-gray-400 mt-1">{stat.description}</div>
              )}
            </div>
          ))}
        </div>

        {/* Featured Partners */}
        {featuredPartners.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">বিশেষ পার্টনার</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredPartners.slice(0, 3).map((partner, index) => (
                <div
                  key={partner.id}
                  className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    {partner.image_url ? (
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
                        <Image
                          src={partner.image_url}
                          alt={partner.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-3xl">
                        {partner.logo}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{partner.name}</h3>
                      <p className="text-blue-100 text-sm">{partner.type}</p>
                    </div>
                  </div>
                  <p className="text-blue-100 text-sm mb-3">{partner.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-white/20 px-3 py-1 rounded-full">
                      {partner.since}
                    </span>
                    {partner.website && partner.website !== '#' && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-300 hover:text-yellow-400 text-sm"
                      >
                        বিস্তারিত →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collaboration Types */}
        {displayCollaborationTypes.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-12 animate-fadeInUp">
            <h2 className="text-xl font-bold text-gray-900 mb-4">সহযোগিতার ধরন</h2>
            <div className="flex flex-wrap gap-3">
              {displayCollaborationTypes.map((item, index) => (
                <span
                  key={item.id}
                  className={`px-4 py-2 rounded-full text-sm font-medium ${item.color} animate-fadeIn`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.name} • {item.count}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        {displayCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full transition-all transform hover:scale-105 ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-blue-50'
              }`}
            >
              সবগুলো
            </button>
            {displayCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full transition-all transform hover:scale-105 flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-blue-50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Partnerships Grid */}
        <div className="space-y-8">
          {selectedCategory === 'all' ? (
            // Show all categories
            partnershipsByCategory.map((category, catIndex) => (
              <div 
                key={category.id} 
                className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeInUp"
                style={{ animationDelay: `${catIndex * 200}ms` }}
              >
                {/* Category Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h2 className="text-xl font-bold text-white">{category.name}</h2>
                      {category.description && (
                        <p className="text-blue-100 text-sm">{category.description}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Partners */}
                <div className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.partners.map((partner, partnerIdx) => (
                      <div
                        key={partner.id}
                        className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all hover:-translate-y-1 bg-white group"
                        style={{ animationDelay: `${(catIndex * 100) + (partnerIdx * 50)}ms` }}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {partner.image_url ? (
                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                              <Image
                                src={partner.image_url}
                                alt={partner.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <span className="text-3xl">{partner.logo}</span>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {partner.name}
                              </h3>
                              {partner.is_featured && (
                                <span className="text-yellow-500 text-sm">★</span>
                              )}
                            </div>
                            <p className="text-sm text-blue-600">{partner.type}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{partner.description}</p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {partner.since}
                          </span>
                          {partner.website && partner.website !== '#' && (
                            <a
                              href={partner.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                            >
                              বিস্তারিত
                              <span className="text-lg">→</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Show single category
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {displayCategories.find(c => c.id === selectedCategory)?.icon}
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    {displayCategories.find(c => c.id === selectedCategory)?.name}
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPartnerships.map((partner, index) => (
                    <div
                      key={partner.id}
                      className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all hover:-translate-y-1 bg-white group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-start gap-3 mb-3">
                        {partner.image_url ? (
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              src={partner.image_url}
                              alt={partner.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-3xl">{partner.logo}</span>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {partner.name}
                            </h3>
                            {partner.is_featured && (
                              <span className="text-yellow-500 text-sm">★</span>
                            )}
                          </div>
                          <p className="text-sm text-blue-600">{partner.type}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{partner.description}</p>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {partner.since}
                        </span>
                        {partner.website && partner.website !== '#' && (
                          <a
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                          >
                            বিস্তারিত
                            <span className="text-lg">→</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Additional Stats Section - partnerStats ব্যবহার করা হয়েছে */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{partnershipStats.total}</div>
            <div className="text-sm text-gray-600">মোট পার্টনার</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{partnershipStats.categories}</div>
            <div className="text-sm text-gray-600">ক্যাটাগরি</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{partnershipStats.activePartners}</div>
            <div className="text-sm text-gray-600">সক্রিয় পার্টনার</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{partnershipStats.featuredCount}</div>
            <div className="text-sm text-gray-600">বিশেষ পার্টনার</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100 animate-fadeInUp">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                নতুন পার্টনার চাই?
              </h3>
              <p className="text-gray-600">
                আপনার সংগঠন যদি একসাথে কাজ করতে চায়, তাহলে যোগাযোগ করুন
              </p>
            </div>
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md whitespace-nowrap"
            >
              যোগাযোগ করুন
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        .animate-fadeInUp {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// Default data (fallback)
const defaultStats = [
  { id: 1, label: "মোট পার্টনার", value: "১৫+", icon: "🤝", description: "সব ধরণের পার্টনার" },
  { id: 2, label: "ক্যাটাগরি", value: "৪টি", icon: "📑", description: "বিভিন্ন ধরণের সহযোগিতা" },
  { id: 3, label: "সক্রিয় সহযোগিতা", value: "১০+", icon: "⚡", description: "চলমান সম্পর্ক" },
  { id: 4, label: "সর্বশেষ যোগ", value: "২০২৫", icon: "📅", description: "নতুন পার্টনার" }
];

const defaultCategories = [
  { id: 1, name: "রাজনৈতিক জোট ও সংগঠন", icon: "🤝", description: "রাজনৈতিক দল ও জোটের সাথে সম্পর্ক" },
  { id: 2, name: "সামাজিক ও মানবিক সংগঠন", icon: "💝", description: "সামাজিক ও মানবিক সংস্থার সাথে সহযোগিতা" },
  { id: 3, name: "শিক্ষা ও গবেষণা প্রতিষ্ঠান", icon: "🏫", description: "শিক্ষাপ্রতিষ্ঠান ও গবেষণা কেন্দ্র" },
  { id: 4, name: "গণমাধ্যম ও প্রকাশনা", icon: "📺", description: "গণমাধ্যম ও প্রকাশনা সংস্থা" }
];

const defaultPartnerships = [
  // রাজনৈতিক
  {
    id: 1,
    category_id: 1,
    name: "জাতীয় নাগরিক পার্টি (এনসিপি)",
    logo: "🏛️",
    type: "কেন্দ্রীয় সদস্য",
    since: "২০২৫",
    description: "কেন্দ্রীয় কমিটির সদস্য হিসেবে দায়িত্ব পালন",
    website: "#",
    image_url: null,
    is_featured: true,
    status: "active"
  },
  {
    id: 2,
    category_id: 1,
    name: "বৈষম্যবিরোধী ছাত্র আন্দোলন",
    logo: "✊",
    type: "সংগঠক",
    since: "২০২৪",
    description: "গণতান্ত্রিক আন্দোলনে নেতৃত্বদান",
    website: "#",
    image_url: null,
    is_featured: true,
    status: "active"
  },
  {
    id: 3,
    category_id: 1,
    name: "ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় ছাত্র সংসদ",
    logo: "🎓",
    type: "সাবেক প্রতিনিধি",
    since: "২০১০-২০১২",
    description: "শিক্ষার্থীদের অধিকার প্রতিষ্ঠায় ভূমিকা",
    website: "#",
    image_url: null,
    is_featured: false,
    status: "active"
  },
  // সামাজিক
  {
    id: 4,
    category_id: 2,
    name: "বেকার যুবকল্প",
    logo: "👥",
    type: "উপদেষ্টা",
    since: "২০১৮",
    description: "বেকার যুবকদের কর্মসংস্থান সৃষ্টি",
    website: "#",
    image_url: null,
    is_featured: true,
    status: "active"
  },
  {
    id: 5,
    category_id: 2,
    name: "শিক্ষা আলো ফাউন্ডেশন",
    logo: "📚",
    type: "প্রতিষ্ঠাতা সদস্য",
    since: "২০১৯",
    description: "মেধাবী অসচ্ছল শিক্ষার্থীদের বৃত্তি প্রদান",
    website: "#",
    image_url: null,
    is_featured: true,
    status: "active"
  },
  {
    id: 6,
    category_id: 2,
    name: "পরিবেশ বাঁচাও আন্দোলন",
    logo: "🌳",
    type: "সমন্বয়ক",
    since: "২০২০",
    description: "বৃক্ষরোপণ ও পরিবেশ সচেতনতা কর্মসূচি",
    website: "#",
    image_url: null,
    is_featured: false,
    status: "active"
  },
  // শিক্ষা
  {
    id: 7,
    category_id: 3,
    name: "ঢাকা বিশ্ববিদ্যালয়",
    logo: "📖",
    type: "প্রাক্তন শিক্ষার্থী",
    since: "২০০৮-২০১২",
    description: "রাষ্ট্রবিজ্ঞান বিভাগ",
    website: "#",
    image_url: null,
    is_featured: false,
    status: "active"
  },
  {
    id: 8,
    category_id: 3,
    name: "যুব নেতৃত্ব উন্নয়ন একাডেমি",
    logo: "⚡",
    type: "প্রশিক্ষক",
    since: "২০২২",
    description: "তরুণ নেতৃত্ব তৈরিতে প্রশিক্ষণ",
    website: "#",
    image_url: null,
    is_featured: true,
    status: "active"
  },
  // গণমাধ্যম
  {
    id: 9,
    category_id: 4,
    name: "দৈনিক আমাদের সময়",
    logo: "📰",
    type: "নিয়মিত কলামিস্ট",
    since: "২০২৩",
    description: "রাজনীতি ও সমকালীন বিষয়ে লেখালেখি",
    website: "#",
    image_url: null,
    is_featured: true,
    status: "active"
  },
  {
    id: 10,
    category_id: 4,
    name: "অনলাইন নিউজ পোর্টাল",
    logo: "🌐",
    type: "বিশেষ প্রতিনিধি",
    since: "২০২১",
    description: "রাজনৈতিক বিশ্লেষণ ও প্রতিবেদন",
    website: "#",
    image_url: null,
    is_featured: false,
    status: "active"
  }
];

const defaultCollaborationTypes = [
  { id: 1, name: "কেন্দ্রীয় সদস্য", count: "১টি", color: "bg-purple-100 text-purple-800" },
  { id: 2, name: "উপদেষ্টা", count: "৩টি", color: "bg-blue-100 text-blue-800" },
  { id: 3, name: "প্রতিষ্ঠাতা সদস্য", count: "২টি", color: "bg-green-100 text-green-800" },
  { id: 4, name: "সমন্বয়ক", count: "৪টি", color: "bg-orange-100 text-orange-800" }
];

// Missing Icons
function Calendar(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}