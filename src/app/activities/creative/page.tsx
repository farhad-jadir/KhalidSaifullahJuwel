// khalid/src/app/activities/creative/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Trophy, Music, Palette, PenTool, Sparkles } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CreativeActivity {
  id: number;
  title: string;
  description: string;
  participants: string;
  status: string;
  icon: string;
  activity_type: string;
  image_url: string | null;
  location: string | null;
  event_date: string | null;
  sort_order: number;
  is_featured: boolean;
}

interface CreativeEvent {
  id: number;
  title: string;
  description: string;
  event_date: string;
  event_type: string;
  icon: string;
  image_url: string | null;
  location: string | null;
  registration_link: string | null;
  status: string;
}

// অ্যাক্টিভিটি টাইপের জন্য কালার ম্যাপিং
const ACTIVITY_COLORS: { [key: string]: string } = {
  art: 'from-purple-400 to-purple-600',
  cultural: 'from-pink-400 to-pink-600',
  music: 'from-blue-400 to-blue-600',
  poetry: 'from-yellow-400 to-yellow-600',
  drama: 'from-orange-400 to-orange-600',
  craft: 'from-green-400 to-green-600',
  others: 'from-gray-400 to-gray-600'
};

// স্ট্যাটাসের জন্য কালার ম্যাপিং
const STATUS_COLORS: { [key: string]: string } = {
  চলমান: 'bg-green-100 text-green-700',
  আসন্ন: 'bg-blue-100 text-blue-700',
  সমাপ্ত: 'bg-gray-100 text-gray-700',
  বার্ষিক: 'bg-purple-100 text-purple-700'
};

export default function CreativeActivitiesPage() {
  const [activities, setActivities] = useState<CreativeActivity[]>([]);
  const [events, setEvents] = useState<CreativeEvent[]>([]);
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
        .from('creative_activities')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (activitiesError) throw activitiesError;

      // Load upcoming events
      const { data: eventsData, error: eventsError } = await supabase
        .from('creative_events')
        .select('*')
        .eq('status', 'upcoming')
        .order('sort_order', { ascending: true })
        .order('event_date', { ascending: true });

      if (eventsError) throw eventsError;

      setActivities(activitiesData || []);
      setEvents(eventsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setError('ডাটা লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const getActivityColor = (type: string) => {
    return ACTIVITY_COLORS[type] || 'from-green-400 to-green-600';
  };

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status] || 'bg-gray-100 text-gray-700';
  };

  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'art': return <Palette className="w-8 h-8" />;
      case 'cultural': return <Sparkles className="w-8 h-8" />;
      case 'music': return <Music className="w-8 h-8" />;
      case 'poetry': return <PenTool className="w-8 h-8" />;
      case 'drama': return <Trophy className="w-8 h-8" />;
      default: return <Sparkles className="w-8 h-8" />;
    }
  };

  // ইউনিক টাইপ গুলো বের করা
  const activityTypes = ['all', ...new Set(activities.map(a => a.activity_type))];

  const getTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      art: 'চিত্রাঙ্কন',
      cultural: 'সাংস্কৃতিক',
      music: 'সংগীত',
      poetry: 'কবিতা',
      drama: 'নাট্য',
      craft: 'হস্তশিল্প',
      others: 'অন্যান্য',
      all: 'সবগুলো'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">সৃজনশীল কার্যক্রম</h1>
            <p className="text-xl max-w-3xl mx-auto font-bangla">
              সংস্কৃতি ও সৃজনশীলতার বিকাশে নানামুখী উদ্যোগ
            </p>
          </div>
        </section>

        {/* Loading Spinner */}
        <div className="flex justify-center items-center py-20">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🎨</span>
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">সৃজনশীল কার্যক্রম</h1>
            <p className="text-xl max-w-3xl mx-auto font-bangla">
              সংস্কৃতি ও সৃজনশীলতার বিকাশে নানামুখী উদ্যোগ
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

  const displayActivities = activities.length > 0 ? activities : defaultActivities;
  const displayEvents = events.length > 0 ? events : defaultEvents;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">সৃজনশীল কার্যক্রম</h1>
          <p className="text-xl max-w-3xl mx-auto font-bangla">
            সংস্কৃতি ও সৃজনশীলতার বিকাশে নানামুখী উদ্যোগ
          </p>
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

      {/* Programs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 font-bangla">
          {selectedType === 'all' ? 'আমাদের সৃজনশীল কর্মকাণ্ড' : getTypeLabel(selectedType)}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayActivities
            .filter(a => selectedType === 'all' || a.activity_type === selectedType)
            .map((program, index) => (
            <div 
              key={program.id} 
              className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`h-48 bg-gradient-to-br ${getActivityColor(program.activity_type)} relative overflow-hidden`}>
                {program.image_url ? (
                  <Image
                    src={program.image_url}
                    alt={program.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl opacity-20 select-none">{program.icon}</span>
                  </div>
                )}
                
                {/* Icon Overlay */}
                <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm rounded-full p-3">
                  <span className="text-3xl">{program.icon}</span>
                </div>

                {/* Featured Badge */}
                {program.is_featured && (
                  <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                    বৈশিষ্ট্যযুক্ত
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold font-bangla text-gray-800 group-hover:text-green-600 transition-colors">
                    {program.title}
                  </h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-bangla ${getStatusColor(program.status)}`}>
                    {program.status}
                  </span>
                </div>

                <p className="text-gray-600 mb-4 font-bangla leading-relaxed">
                  {program.description}
                </p>

                {program.location && (
                  <p className="text-sm text-gray-500 mb-2 font-bangla">
                    📍 {program.location}
                  </p>
                )}

                {program.event_date && (
                  <p className="text-sm text-gray-500 mb-2 font-bangla">
                    📅 {new Date(program.event_date).toLocaleDateString('bn-BD', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <span className="text-sm text-green-600 font-semibold font-bangla">
                    👥 {program.participants}+ অংশগ্রহণকারী
                  </span>
                  <button className="text-green-600 hover:text-green-700 text-sm font-bangla">
                    বিস্তারিত →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-gradient-to-r from-green-50 to-green-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4 font-bangla">আসন্ন সৃজনশীল আয়োজন</h2>
          <p className="text-center text-gray-600 mb-12 font-bangla">
            অংশ নিন আমাদের upcoming ইভেন্টগুলোতে
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {displayEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="bg-white rounded-xl p-6 flex items-start gap-4 hover:shadow-lg transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-green-100 rounded-lg p-3 group-hover:bg-green-200 transition-colors">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1 font-bangla group-hover:text-green-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 font-bangla">{event.description}</p>
                  
                  {event.location && (
                    <p className="text-xs text-gray-500 mb-1 font-bangla">📍 {event.location}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-green-600 font-semibold text-sm flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {event.event_date}
                    </p>
                    
                    {event.registration_link && (
                      <a
                        href={event.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-green-600 text-white px-3 py-1 rounded-full hover:bg-green-700 transition-colors font-bangla"
                      >
                        রেজিস্ট্রেশন
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayEvents.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-4xl mb-4">📭</p>
              <p className="text-gray-500 font-bangla text-lg">কোনো আসন্ন ইভেন্ট নেই</p>
              <p className="text-gray-400 font-bangla mt-2">শীঘ্রই নতুন ইভেন্ট যুক্ত হবে</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-green-800 to-green-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 font-bangla">আপনার প্রতিভা বিকাশের সুযোগ</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto font-bangla">
            আমাদের সৃজনশীল কর্মকাণ্ডে অংশ নিয়ে আপনার প্রতিভা বিকাশ করুন
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/volunteer"
              className="px-8 py-3 bg-white text-green-800 rounded-lg hover:bg-gray-100 transition-colors font-bangla text-lg font-semibold"
            >
              অংশ নিন
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-bangla text-lg font-semibold"
            >
              যোগাযোগ করুন
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Footer */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{activities.length}</div>
              <div className="text-sm text-gray-500 font-bangla">মোট কার্যক্রম</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {activities.filter(a => a.status === 'চলমান').length}
              </div>
              <div className="text-sm text-gray-500 font-bangla">চলমান</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{displayEvents.length}</div>
              <div className="text-sm text-gray-500 font-bangla">আসন্ন ইভেন্ট</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {activities.reduce((acc, a) => acc + parseInt(a.participants.replace(/[^0-9]/g, '')), 0)}+
              </div>
              <div className="text-sm text-gray-500 font-bangla">মোট অংশগ্রহণকারী</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Default data (fallback)
const defaultActivities = [
  {
    id: 1,
    title: "চিত্রাঙ্কন প্রতিযোগিতা",
    description: "তরুণ শিল্পীদের জন্য বার্ষিক চিত্রাঙ্কন প্রতিযোগিতা। দেশের বিভিন্ন প্রান্ত থেকে আগত শিল্পীরা অংশগ্রহণ করেন।",
    participants: "৫০০+",
    status: "চলমান",
    icon: "🎨",
    activity_type: "art",
    image_url: null,
    location: "ঢাকা",
    event_date: new Date().toISOString(),
    sort_order: 1,
    is_featured: true
  },
  {
    id: 2,
    title: "সাংস্কৃতিক উৎসব",
    description: "বিভিন্ন সাংস্কৃতিক অনুষ্ঠান ও উৎসব আয়োজন। গান, নাচ, আবৃত্তি সহ নানা আয়োজন।",
    participants: "২০০০+",
    status: "আসন্ন",
    icon: "🎭",
    activity_type: "cultural",
    image_url: null,
    location: "চট্টগ্রাম",
    event_date: null,
    sort_order: 2,
    is_featured: false
  },
  {
    id: 3,
    title: "সংগীত প্রতিযোগিতা",
    description: "আধুনিক ও রবীন্দ্রসংগীত প্রতিযোগিতা। দেশের সম্ভাবনাময় কণ্ঠশিল্পীদের অংশগ্রহণ।",
    participants: "৩০০+",
    status: "চলমান",
    icon: "🎵",
    activity_type: "music",
    image_url: null,
    location: "ঢাকা",
    event_date: null,
    sort_order: 3,
    is_featured: false
  },
  {
    id: 4,
    title: "কবিতা আবৃত্তি",
    description: "কবিতা আবৃত্তি ও লেখনী প্রতিযোগিতা। তরুণ কবি ও আবৃত্তিকারদের মিলনমেলা।",
    participants: "২০০+",
    status: "সমাপ্ত",
    icon: "📝",
    activity_type: "poetry",
    image_url: null,
    location: "রাজশাহী",
    event_date: null,
    sort_order: 4,
    is_featured: false
  },
  {
    id: 5,
    title: "নাট্যোৎসব",
    description: "তরুণ নাট্যকারদের নাটক মঞ্চায়ন। স্বল্পদৈর্ঘ্য ও পূর্ণদৈর্ঘ্য নাটকের আয়োজন।",
    participants: "১৫০+",
    status: "আসন্ন",
    icon: "🎪",
    activity_type: "drama",
    image_url: null,
    location: "খুলনা",
    event_date: null,
    sort_order: 5,
    is_featured: true
  },
  {
    id: 6,
    title: "হস্তশিল্প মেলা",
    description: "স্থানীয় হস্তশিল্প পণ্যের মেলা ও প্রদর্শনী। গ্রামীণ কারিগরদের হাতে তৈরি পণ্য।",
    participants: "১০০০+",
    status: "বার্ষিক",
    icon: "🏺",
    activity_type: "craft",
    image_url: null,
    location: "সিলেট",
    event_date: null,
    sort_order: 6,
    is_featured: false
  }
];

const defaultEvents = [
  {
    id: 1,
    title: "বার্ষিক সাংস্কৃতিক সন্ধ্যা",
    description: "শিল্পী ও সংস্কৃতিকর্মীদের নিয়ে মনোজ্ঞ সাংস্কৃতিক সন্ধ্যা",
    event_date: "১৫ ডিসেম্বর, ২০২৪",
    event_type: "cultural_night",
    icon: "🎭",
    image_url: null,
    location: "ঢাকা",
    registration_link: "/register",
    status: "upcoming"
  },
  {
    id: 2,
    title: "তরুণ শিল্পী সম্মাননা",
    description: "গুণী তরুণ শিল্পীদের সম্মাননা প্রদান",
    event_date: "২০ জানুয়ারি, ২০২৫",
    event_type: "award_ceremony",
    icon: "🏆",
    image_url: null,
    location: "চট্টগ্রাম",
    registration_link: null,
    status: "upcoming"
  },
  {
    id: 3,
    title: "বইমেলা ও পাঠচক্র",
    description: "স্থানীয় লেখকদের বই নিয়ে বইমেলা ও আলোচনা সভা",
    event_date: "৫ ফেব্রুয়ারি, ২০২৫",
    event_type: "book_fair",
    icon: "📚",
    image_url: null,
    location: "রাজশাহী",
    registration_link: "/register/book-fair",
    status: "upcoming"
  },
  {
    id: 4,
    title: "ঐতিহ্যবাহী নৃত্যানুষ্ঠান",
    description: "লোকজ ও ক্লাসিক্যাল নৃত্যের আয়োজন",
    event_date: "১০ মার্চ, ২০২৫",
    event_type: "dance_performance",
    icon: "💃",
    image_url: null,
    location: "সিলেট",
    registration_link: null,
    status: "upcoming"
  }
];