// khalid/src/app/achievements/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Award, 
  Star, 
  TrendingUp, 
  User, 
  Calendar,
  MapPin,
  Heart,
  Users,
  Briefcase,
  GraduationCap,
  Leaf,
  Droplets,
  Zap,
  Phone,
  Mail,
  Globe,
  Facebook,
  Twitter,
  Linkedin,
  ChevronRight,
  Quote
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// টাইপ ডিফিনেশন
interface PersonalInfo {
  id: number;
  name: string;
  title: string;
  designation: string;
  description: string;
  image_url: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  social_links: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  } | null;
}

interface AchievementCategory {
  id: number;
  name: string;
  icon: string;
  description: string | null;
  sort_order: number;
  status?: string;
}

interface Achievement {
  id: number;
  category_id: number;
  title: string;
  description: string;
  year: string;
  impact: string;
  icon: string;
  image_url: string | null;
  is_featured: boolean;
  sort_order: number;
  status?: string;
}

interface Stat {
  id: number;
  label: string;
  value: string;
  icon: string;
  description: string | null;
  sort_order: number;
  status?: string;
}

interface Recognition {
  id: number;
  title: string;
  organization: string;
  year: string;
  icon: string;
  description: string | null;
  image_url: string | null;
  status?: string;
}

export default function AchievementsPage() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [categories, setCategories] = useState<AchievementCategory[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Stat[]>([]);
  const [recognitions, setRecognitions] = useState<Recognition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [activeQuote, setActiveQuote] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  // কোর্টেশন রোটেটর
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: personalData, error: personalError } = await supabase
        .from('achievement_personal_info')
        .select('*')
        .eq('id', 1)
        .single();

      if (personalError && personalError.code !== 'PGRST116') throw personalError;

      const { data: categoriesData, error: categoriesError } = await supabase
        .from('achievement_categories')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

      if (categoriesError) throw categoriesError;

      const { data: achievementsData, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

      if (achievementsError) throw achievementsError;

      const { data: statsData, error: statsError } = await supabase
        .from('achievement_stats')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

      if (statsError) throw statsError;

      const { data: recognitionsData, error: recognitionsError } = await supabase
        .from('achievement_recognitions')
        .select('*')
        .eq('status', 'active')
        .order('sort_order', { ascending: true });

      if (recognitionsError) throw recognitionsError;

      setPersonalInfo(personalData || null);
      setCategories(categoriesData || []);
      setAchievements(achievementsData || []);
      setStats(statsData || []);
      setRecognitions(recognitionsData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      setError('ডাটা লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const filteredAchievements = selectedCategory === 'all'
    ? achievements
    : achievements.filter(a => a.category_id === selectedCategory);

  const achievementsByCategory = categories.map(category => ({
    ...category,
    achievements: achievements.filter(a => a.category_id === category.id)
  })).filter(c => c.achievements.length > 0);

  const featuredAchievements = achievements.filter(a => a.is_featured);

  const getCategoryIcon = (iconName: string): React.ReactNode => {
    const icons: { [key: string]: React.ReactNode } = {
      '🏛️': <Briefcase className="w-6 h-6" />,
      '✊': <Users className="w-6 h-6" />,
      '🤝': <Heart className="w-6 h-6" />,
      '⚡': <Zap className="w-6 h-6" />,
    };
    return icons[iconName] || <Award className="w-6 h-6" />;
  };

  const getStatIcon = (icon: string): React.ReactNode => {
    const icons: { [key: string]: React.ReactNode } = {
      '📊': <TrendingUp className="w-8 h-8" />,
      '👥': <Users className="w-8 h-8" />,
      '🎓': <GraduationCap className="w-8 h-8" />,
    };
    return icons[icon] || <Award className="w-8 h-8" />;
  };

  const quotes = [
    {
      text: "গণতন্ত্র, সাম্য ও ন্যায়বিচার প্রতিষ্ঠায় নিবেদিত",
      author: "খালেদ সাইফুল্লাহ জুয়েল"
    },
    {
      text: "জনগণের ভালোবাসাই আমার সবচেয়ে বড় অর্জন",
      author: "খালেদ সাইফুল্লাহ জুয়েল"
    },
    {
      text: "তরুণ প্রজন্মকে নেতৃত্বের জন্য তৈরি করাই আমাদের লক্ষ্য",
      author: "খালেদ সাইফুল্লাহ জুয়েল"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="animate-pulse">
              <div className="h-4 w-32 bg-white/20 rounded-full mx-auto mb-4"></div>
              <div className="h-12 w-64 bg-white/20 rounded-lg mx-auto mb-4"></div>
              <div className="h-6 w-96 bg-white/20 rounded-lg mx-auto"></div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl animate-pulse">🏆</span>
            </div>
          </div>
          <p className="text-gray-600 font-bangla mt-4 ml-4">অর্জনসমূহ লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-bangla">
              অর্জনসমূহ
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto font-bangla">
              খালেদ সাইফুল্লাহ জুয়েল এর রাজনৈতিক ও সামাজিক জীবনের উল্লেখযোগ্য অর্জন
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <div className="text-6xl mb-4">😢</div>
            <p className="text-red-600 font-bangla text-lg mb-4">{error}</p>
            <button
              onClick={loadData}
              className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all transform hover:scale-105 font-bangla inline-flex items-center gap-2"
            >
              <span>⟳</span>
              <span>আবার চেষ্টা করুন</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const displayPersonalInfo = personalInfo || defaultPersonalInfo;
  const displayStats = stats.length > 0 ? stats : defaultStats;
  const displayCategories = categories.length > 0 ? categories : defaultCategories;
  const displayRecognitions = recognitions.length > 0 ? recognitions : defaultRecognitions;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-repeat" 
               style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fadeInDown">
              {displayPersonalInfo.title}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-bangla animate-fadeInUp">
              {displayPersonalInfo.name}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto font-bangla animate-fadeInUp">
              {displayPersonalInfo.description}
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-6 animate-fadeInUp">
            <Quote className="w-8 h-8 text-blue-300 mb-2" />
            <p className="text-lg md:text-xl font-bangla mb-2">{quotes[activeQuote].text}</p>
            <p className="text-blue-200">— {quotes[activeQuote].author}</p>
          </div>
        </div>
      </section>

      {/* Profile Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-blue-800 p-8 flex items-center justify-center">
              {displayPersonalInfo.image_url ? (
                <div className="relative h-64 w-64 rounded-full overflow-hidden border-4 border-white/30">
                  <Image
                    src={displayPersonalInfo.image_url}
                    alt={displayPersonalInfo.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-64 w-64 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/30">
                  <User className="w-32 h-32 text-white" />
                </div>
              )}
            </div>
            <div className="md:w-2/3 p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4 font-bangla">
                {displayPersonalInfo.name}
              </h2>
              <p className="text-xl text-blue-600 mb-4 font-bangla">
                {displayPersonalInfo.designation}
              </p>
              <p className="text-gray-600 mb-6 font-bangla leading-relaxed">
                {displayPersonalInfo.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {displayPersonalInfo.email && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-5 h-5 text-blue-600" />
                    <span>{displayPersonalInfo.email}</span>
                  </div>
                )}
                {displayPersonalInfo.phone && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5 text-blue-600" />
                    <span>{displayPersonalInfo.phone}</span>
                  </div>
                )}
                {displayPersonalInfo.address && (
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="font-bangla">{displayPersonalInfo.address}</span>
                  </div>
                )}
              </div>
              {displayPersonalInfo.social_links && (
                <div className="flex gap-4 mt-6">
                  {displayPersonalInfo.social_links.facebook && (
                    <a href={displayPersonalInfo.social_links.facebook} target="_blank" rel="noopener noreferrer"
                       className="bg-gray-100 p-2 rounded-full hover:bg-blue-100 transition-colors">
                      <Facebook className="w-5 h-5 text-blue-600" />
                    </a>
                  )}
                  {displayPersonalInfo.social_links.twitter && (
                    <a href={displayPersonalInfo.social_links.twitter} target="_blank" rel="noopener noreferrer"
                       className="bg-gray-100 p-2 rounded-full hover:bg-blue-100 transition-colors">
                      <Twitter className="w-5 h-5 text-blue-600" />
                    </a>
                  )}
                  {displayPersonalInfo.social_links.linkedin && (
                    <a href={displayPersonalInfo.social_links.linkedin} target="_blank" rel="noopener noreferrer"
                       className="bg-gray-100 p-2 rounded-full hover:bg-blue-100 transition-colors">
                      <Linkedin className="w-5 h-5 text-blue-600" />
                    </a>
                  )}
                  {displayPersonalInfo.social_links.website && (
                    <a href={displayPersonalInfo.social_links.website} target="_blank" rel="noopener noreferrer"
                       className="bg-gray-100 p-2 rounded-full hover:bg-blue-100 transition-colors">
                      <Globe className="w-5 h-5 text-blue-600" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayStats.map((stat) => (
            <div 
              key={stat.id} 
              className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 group"
            >
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600 font-bangla text-sm">{stat.label}</div>
              {stat.description && (
                <div className="text-xs text-gray-400 mt-2">{stat.description}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Featured Achievements */}
      {featuredAchievements.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-center mb-12 font-bangla">বিশেষ অর্জনসমূহ</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredAchievements.slice(0, 3).map((achievement) => (
              <div 
                key={achievement.id}
                className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{achievement.icon}</div>
                <h3 className="text-xl font-bold mb-2 font-bangla">{achievement.title}</h3>
                <p className="text-blue-100 text-sm mb-3">{achievement.description}</p>
                <div className="flex items-center justify-between">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    {achievement.year}
                  </span>
                  <span className="text-yellow-300">★</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Category Filter */}
      {displayCategories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full transition-all transform hover:scale-105 font-bangla ${
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
                className={`px-6 py-3 rounded-full transition-all transform hover:scale-105 font-bangla flex items-center gap-2 ${
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
        </section>
      )}

      {/* Achievements Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {selectedCategory === 'all' ? (
          // Show all categories with their achievements
          <div className="space-y-16">
            {achievementsByCategory.map((category) => (
              <div key={category.id}>
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="bg-blue-100 p-4 rounded-2xl">
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 font-bangla">{category.name}</h2>
                    {category.description && (
                      <p className="text-gray-600 mt-1">{category.description}</p>
                    )}
                  </div>
                </div>

                {/* Category Achievements */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 group"
                    >
                      {achievement.image_url ? (
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={achievement.image_url}
                            alt={achievement.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                          <span className="text-6xl">{achievement.icon}</span>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold font-bangla text-gray-800 group-hover:text-blue-600 transition-colors">
                            {achievement.title}
                          </h3>
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                            {achievement.year}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-4 font-bangla line-clamp-3">{achievement.description}</p>
                        <div className="bg-green-50 rounded-lg p-4">
                          <p className="text-sm text-green-800 font-bangla">
                            <span className="font-semibold">অর্জন: </span>
                            {achievement.impact}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Show single category
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all hover:-translate-y-2 group"
              >
                {achievement.image_url ? (
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={achievement.image_url}
                      alt={achievement.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <span className="text-6xl">{achievement.icon}</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold font-bangla text-gray-800 group-hover:text-blue-600 transition-colors">
                      {achievement.title}
                    </h3>
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm whitespace-nowrap">
                      {achievement.year}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 font-bangla line-clamp-3">{achievement.description}</p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-800 font-bangla">
                      <span className="font-semibold">অর্জন: </span>
                      {achievement.impact}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredAchievements.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-gray-500 font-bangla text-xl">এই ক্যাটাগরিতে কোনো অর্জন নেই</p>
          </div>
        )}
      </section>

      {/* Recognitions Section */}
      {displayRecognitions.length > 0 && (
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-4 font-bangla">স্বীকৃতি ও সম্মাননা</h2>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto font-bangla">
              বিভিন্ন প্রতিষ্ঠান ও সংগঠন থেকে প্রাপ্ত স্বীকৃতি
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {displayRecognitions.map((recognition) => (
                <div
                  key={recognition.id}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all hover:-translate-y-2 group"
                >
                  {recognition.image_url ? (
                    <div className="relative h-24 w-24 mx-auto mb-4 rounded-full overflow-hidden">
                      <Image
                        src={recognition.image_url}
                        alt={recognition.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                      {recognition.icon}
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2 font-bangla">{recognition.title}</h3>
                  <p className="text-blue-600 font-medium mb-2">{recognition.organization}</p>
                  <p className="text-sm text-gray-500 mb-3">{recognition.year}</p>
                  {recognition.description && (
                    <p className="text-sm text-gray-600 font-bangla">{recognition.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-repeat" 
                 style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}>
            </div>
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-bangla">আমাদের সাথে যুক্ত হোন</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto font-bangla">
              গণতন্ত্র, সাম্য ও ন্যায়বিচার প্রতিষ্ঠার এই পথচলায় আপনাকে স্বাগতম
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-3 bg-white text-blue-800 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 font-bangla text-lg font-semibold inline-flex items-center gap-2"
              >
                <span>যোগাযোগ করুন</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="/activities"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white/10 transition-all transform hover:scale-105 font-bangla text-lg font-semibold"
              >
                কার্যক্রম দেখুন
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ডিফল্ট ডাটা
const defaultPersonalInfo: PersonalInfo = {
  id: 1,
  name: "খালেদ সাইফুল্লাহ জুয়েল",
  title: "জাতীয় নাগরিক পার্টি (এনসিপি) - কেন্দ্রীয় সদস্য",
  designation: "কেন্দ্রীয় সদস্য, জাতীয় নাগরিক পার্টি",
  description: "রাজনৈতিক ও সামাজিক জীবনের উল্লেখযোগ্য অর্জনসমূহ - ছাত্রজীবন থেকে শুরু করে বৈষম্যবিরোধী আন্দোলন ও এনসিপির কেন্দ্রীয় সদস্য হিসেবে দায়িত্ব পালন",
  image_url: null,
  email: "contact@example.com",
  phone: "+880 1XXX-XXXXXX",
  address: "ঢাকা, বাংলাদেশ",
  social_links: {
    facebook: "https://facebook.com/",
    twitter: "https://twitter.com/",
    linkedin: "https://linkedin.com/",
    website: "https://example.com/"
  }
};

const defaultStats: Stat[] = [
  { id: 1, label: "রাজনৈতিক জীবনের বছর", value: "১৫+", icon: "📅", description: "ছাত্রজীবন থেকে শুরু", sort_order: 1 },
  { id: 2, label: "সরাসরি সহায়তা প্রাপ্ত পরিবার", value: "২০০০+", icon: "👥", description: "দুস্থ ও অসহায়", sort_order: 2 },
  { id: 3, label: "কর্মসংস্থান সৃষ্টি", value: "৩০০+", icon: "💼", description: "বেকার যুবক", sort_order: 3 },
  { id: 4, label: "বৃত্তিপ্রাপ্ত শিক্ষার্থী", value: "৫০+", icon: "🎓", description: "মেধাবী শিক্ষার্থী", sort_order: 4 }
];

const defaultCategories: AchievementCategory[] = [
  { id: 1, name: "রাজনৈতিক অর্জন", icon: "🏛️", description: "রাজনৈতিক জীবনের উল্লেখযোগ্য অর্জন", sort_order: 1 },
  { id: 2, name: "সামাজিক আন্দোলন", icon: "✊", description: "গণতান্ত্রিক আন্দোলনে ভূমিকা", sort_order: 2 },
  { id: 3, name: "সামাজিক উন্নয়ন", icon: "🤝", description: "মানবিক কার্যক্রম ও উন্নয়ন", sort_order: 3 },
  { id: 4, name: "সাংগঠনিক দক্ষতা", icon: "⚡", description: "নেতৃত্ব উন্নয়ন ও প্রশিক্ষণ", sort_order: 4 }
];

const defaultAchievements: Achievement[] = [
  {
    id: 1,
    category_id: 1,
    title: "এনসিপি কেন্দ্রীয় সদস্য",
    description: "জাতীয় নাগরিক পার্টি (এনসিপি) এর কেন্দ্রীয় কমিটির সদস্য হিসেবে দায়িত্ব পালন",
    year: "২০২৫-বর্তমান",
    impact: "জাতীয় রাজনীতিতে নতুন ধারার নেতৃত্ব ও সংগঠন building",
    icon: "🏛️",
    image_url: null,
    is_featured: true,
    sort_order: 1
  },
  {
    id: 2,
    category_id: 1,
    title: "বৈষম্যবিরোধী ছাত্র আন্দোলন",
    description: "ছাত্র-জনতার বৈষম্যবিরোধী আন্দোলনে গুরুত্বপূর্ণ ভূমিকা ও নেতৃত্ব",
    year: "২০২৪",
    impact: "গণতান্ত্রিক মূল্যবোধ ও ন্যায়বিচার প্রতিষ্ঠায় অবদান",
    icon: "✊",
    image_url: null,
    is_featured: true,
    sort_order: 2
  },
  {
    id: 3,
    category_id: 2,
    title: "গণতান্ত্রিক আন্দোলন সংগঠন",
    description: "গণতন্ত্র ও মানবাধিকার প্রতিষ্ঠায় বিভিন্ন আন্দোলনে নেতৃত্ব ও সংগঠক হিসেবে ভূমিকা",
    year: "২০১৩-২০২৪",
    impact: "গণতান্ত্রিক চেতনা বিকাশ ও নাগরিক সচেতনতা বৃদ্ধি",
    icon: "✊",
    image_url: null,
    is_featured: true,
    sort_order: 3
  },
  {
    id: 4,
    category_id: 3,
    title: "বেকার যুবকদের কর্মসংস্থান",
    description: "তিন শতাধিক বেকার যুবককে বিভিন্ন প্রতিষ্ঠানে চাকরির ব্যবস্থা",
    year: "২০১৬-২০২৪",
    impact: "বেকারত্ব হ্রাস ও আর্থিক স্বাবলম্বিতা অর্জন",
    icon: "💼",
    image_url: null,
    is_featured: true,
    sort_order: 4
  },
  {
    id: 5,
    category_id: 4,
    title: "যুব নেতৃত্ব উন্নয়ন",
    description: "তরুণ নেতৃত্ব তৈরি ও তাদের দক্ষতা উন্নয়নে বিশেষ কর্মসূচি",
    year: "২০১৮-২০২৪",
    impact: "৫০+ তরুণ নেতৃত্ব তৈরি",
    icon: "⚡",
    image_url: null,
    is_featured: true,
    sort_order: 5
  }
];

const defaultRecognitions: Recognition[] = [
  {
    id: 1,
    title: "বিশিষ্ট যুব নেতা",
    organization: "জাতীয় নাগরিক পার্টি (এনসিপি)",
    year: "২০২৫",
    icon: "🏆",
    description: "তরুণ প্রজন্মের নেতৃত্ব বিকাশে বিশেষ অবদান",
    image_url: null
  },
  {
    id: 2,
    title: "গণতান্ত্রিক আন্দোলনের সংগঠক",
    organization: "বৈষম্যবিরোধী ছাত্র আন্দোলন",
    year: "২০২৪",
    icon: "⭐",
    description: "গণতান্ত্রিক আন্দোলনে নেতৃত্বদানের স্বীকৃতি",
    image_url: null
  },
  {
    id: 3,
    title: "শিক্ষা ও মানবাধিকার কর্মী",
    organization: "ঢাকা বিশ্ববিদ্যালয়",
    year: "২০১০-২০১২",
    icon: "🎓",
    description: "শিক্ষার্থীদের অধিকার প্রতিষ্ঠায় অবদান",
    image_url: null
  }
];