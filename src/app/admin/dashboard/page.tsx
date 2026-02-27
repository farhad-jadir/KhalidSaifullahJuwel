// app/admin/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import {
  Newspaper,
  Users,
  TrendingUp,
  Calendar,
  PieChart,
  Eye,
  ThumbsUp,
  MessageCircle,
  ArrowRight,
  Edit,
  Trash2,
  Plus,
  LogOut,
  Bell,
  Settings,
  BarChart3,
  Activity,
  Clock,
  Award,
  MapPin,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { electionNewsApi, pollApi, trendingApi, eventsApi, statsApi } from '@/lib/supabase/election';

// Types
interface ElectionNews {
  id: string;
  title: string;
  slug: string;
  category: string;
  party: string;
  region: string;
  content?: string;
  image_url?: string;
  trending: boolean;
  featured: boolean;
  likes: number;
  comments: number;
  views: number;
  published_at: string;
}

interface PollData {
  id: string;
  party: string;
  percentage: number;
  color_from: string;
  color_to: string;
}

interface UpcomingEvent {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  party: string;
  image_url?: string;
}

interface DashboardStats {
  totalNews: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  trendingNews: number;
  onlineUsers: number;
  pendingSeats: number;
  totalCandidates: number;
}

interface RecentActivity {
  id: string;
  title: string;
  type: 'news' | 'poll' | 'event';
  action: 'created' | 'updated' | 'published';
  timestamp: string;
}

const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalNews: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    trendingNews: 0,
    onlineUsers: 2345,
    pendingSeats: 45,
    totalCandidates: 1854
  });

  const [recentNews, setRecentNews] = useState<ElectionNews[]>([]);
  const [pollData, setPollData] = useState<PollData[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      title: 'নির্বাচনে আওয়ামী লীগের মনোনয়ন পেলেন যারা',
      type: 'news',
      action: 'published',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      title: 'বিএনপির নির্বাচনী ইশতেহার প্রকাশ কাল',
      type: 'news',
      action: 'updated',
      timestamp: new Date(Date.now() - 3600000).toISOString()
    }
  ]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [newsRes, pollRes, eventsRes, statsRes] = await Promise.all([
        electionNewsApi.getNews({ limit: 5 }),
        pollApi.getActivePoll(),
        eventsApi.getUpcomingEvents(),
        statsApi.getStats()
      ]);

      // Check and set news data with type safety
      if (newsRes.data && Array.isArray(newsRes.data)) {
        const newsData = newsRes.data as ElectionNews[];
        setRecentNews(newsData);
        
        // Calculate stats from news
        const totalViews = newsData.reduce((sum, item) => sum + (item.views || 0), 0);
        const totalLikes = newsData.reduce((sum, item) => sum + (item.likes || 0), 0);
        const totalComments = newsData.reduce((sum, item) => sum + (item.comments || 0), 0);
        const trendingCount = newsData.filter(item => item.trending).length;

        setStats(prev => ({
          ...prev,
          totalNews: newsData.length,
          totalViews,
          totalLikes,
          totalComments,
          trendingNews: trendingCount
        }));
      }

      // Check and set poll data
      if (pollRes.data && Array.isArray(pollRes.data)) {
        setPollData(pollRes.data as PollData[]);
      }

      // Check and set events data
      if (eventsRes.data && Array.isArray(eventsRes.data)) {
        setUpcomingEvents(eventsRes.data as UpcomingEvent[]);
      }

      // Check and set stats data
      if (statsRes.data) {
        setStats(prev => ({
          ...prev,
          ...statsRes.data as Partial<DashboardStats>
        }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert numbers to Bangla
  const toBanglaNumber = (num: number): string => {
    if (num === undefined || num === null) return '০';
    const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return num.toString().replace(/\d/g, digit => banglaDigits[parseInt(digit)]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-xl">
                <BarChart3 className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">অ্যাডমিন ড্যাশবোর্ড</h1>
                <p className="text-white/80 mt-1">স্বাগতম, নির্বাচন নিউজ ম্যানেজমেন্ট সিস্টেম</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Settings className="h-6 w-6" />
              </button>
              <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <LogOut className="h-5 w-5" />
                লগআউট
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">মোট সংবাদ</p>
                <h3 className="text-3xl font-bold text-gray-800">{toBanglaNumber(stats.totalNews)}</h3>
                <p className="text-xs text-green-500 mt-2">+{toBanglaNumber(12)} আজ</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Newspaper className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">মোট ভিউ</p>
                <h3 className="text-3xl font-bold text-gray-800">{toBanglaNumber(stats.totalViews)}</h3>
                <p className="text-xs text-green-500 mt-2">+{toBanglaNumber(345)} আজ</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">মোট লাইক</p>
                <h3 className="text-3xl font-bold text-gray-800">{toBanglaNumber(stats.totalLikes)}</h3>
                <p className="text-xs text-green-500 mt-2">+{toBanglaNumber(89)} আজ</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <ThumbsUp className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">মোট কমেন্ট</p>
                <h3 className="text-3xl font-bold text-gray-800">{toBanglaNumber(stats.totalComments)}</h3>
                <p className="text-xs text-green-500 mt-2">+{toBanglaNumber(23)} আজ</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <MessageCircle className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Management Cards */}
          <div className="lg:col-span-2 space-y-8">
            {/* Election News Management Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Newspaper className="h-6 w-6 text-white" />
                    <h2 className="text-xl font-bold text-white">নির্বাচন নিউজ ম্যানেজমেন্ট</h2>
                  </div>
                  <Link href="/admin/election">
                    <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300">
                      <span>ম্যানেজ করুন</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-700">সাম্প্রতিক সংবাদ</h3>
                  <Link href="/admin/election?action=create">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors">
                      <Plus className="h-4 w-4" />
                      নতুন সংবাদ
                    </button>
                  </Link>
                </div>

                <div className="space-y-4">
                  {recentNews.slice(0, 3).map((news) => (
                    <div key={news.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        {news.image_url ? (
                          <img src={news.image_url} alt={news.title} className="h-12 w-12 object-cover rounded-lg" />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Newspaper className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-semibold text-gray-800 line-clamp-1">{news.title}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {toBanglaNumber(news.views || 0)}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {toBanglaNumber(news.likes || 0)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="h-3 w-3" />
                              {toBanglaNumber(news.comments || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/admin/election?edit=${news.id}`}>
                          <button className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {recentNews.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      কোনো সংবাদ পাওয়া যায়নি
                    </div>
                  )}
                </div>

                <Link href="/admin/election">
                  <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                    সব সংবাদ দেখুন
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Poll & Trending Management */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Poll Management */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <PieChart className="h-5 w-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">জরিপ ডাটা</h3>
                  </div>
                  <Link href="/admin/election?tab=poll">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">সম্পাদনা</button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {pollData.length > 0 ? (
                    pollData.map((poll, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{poll.party}</span>
                          <span className="font-semibold">{poll.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`bg-gradient-to-r ${poll.color_from} ${poll.color_to} h-2 rounded-full`}
                            style={{ width: `${poll.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">কোনো জরিপ ডাটা নেই</p>
                  )}
                </div>
              </div>

              {/* Trending Topics Management */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">ট্রেন্ডিং টপিক</h3>
                  </div>
                  <Link href="/admin/election?tab=trending">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">সম্পাদনা</button>
                  </Link>
                </div>

                <div className="space-y-3">
                  {['#ঢাকার_নির্বাচন', '#মনোনয়ন_বঞ্চনা', '#ইশতেহার_২০২৪'].map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="font-medium">{topic}</span>
                      <span className="text-sm text-gray-500">{toBanglaNumber(1000 - index * 100)} পোস্ট</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-6 w-6" />
                <h3 className="text-xl font-bold">আসন্ন ইভেন্ট</h3>
              </div>
              
              <div className="space-y-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                      <p className="text-sm opacity-90">
                        {new Date(event.event_date).toLocaleDateString('bn-BD')}
                      </p>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm opacity-75 mt-1">{event.location}</p>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                      <p className="text-sm opacity-90">আগামীকাল</p>
                      <p className="font-semibold">বিএনপির নির্বাচনী সমাবেশ</p>
                      <p className="text-sm opacity-75 mt-1">সোহরাওয়ার্দী উদ্যান, ঢাকা</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                      <p className="text-sm opacity-90">১৫ জানুয়ারি</p>
                      <p className="font-semibold">আওয়ামী লীগের ইশতেহার ঘোষণা</p>
                      <p className="text-sm opacity-75 mt-1">বঙ্গবন্ধু আন্তর্জাতিক সম্মেলন কেন্দ্র</p>
                    </div>
                  </>
                )}
              </div>
              
              <Link href="/admin/election?tab=events">
                <button className="mt-6 w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                  সব ইভেন্ট দেখুন
                </button>
              </Link>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">সাম্প্রতিক কার্যক্রম</h3>
              
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      activity.type === 'news' ? 'bg-blue-100' :
                      activity.type === 'poll' ? 'bg-purple-100' : 'bg-green-100'
                    }`}>
                      {activity.type === 'news' && <Newspaper className="h-4 w-4 text-blue-600" />}
                      {activity.type === 'poll' && <PieChart className="h-4 w-4 text-purple-600" />}
                      {activity.type === 'event' && <Calendar className="h-4 w-4 text-green-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 line-clamp-1">{activity.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.action === 'created' && 'তৈরি করা হয়েছে'}
                        {activity.action === 'updated' && 'আপডেট করা হয়েছে'}
                        {activity.action === 'published' && 'প্রকাশিত হয়েছে'}
                        {' - '}
                        <Clock className="h-3 w-3 inline mr-1" />
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">দ্রুত অ্যাকশন</h3>
              
              <div className="space-y-3">
                <Link href="/admin/election?action=create">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                    <Plus className="h-5 w-5" />
                    নতুন সংবাদ যোগ করুন
                  </button>
                </Link>
                
                <Link href="/admin/election?tab=poll">
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                    <PieChart className="h-5 w-5" />
                    জরিপ আপডেট করুন
                  </button>
                </Link>
                
                <Link href="/admin/election?tab=events">
                  <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                    <Calendar className="h-5 w-5" />
                    নতুন ইভেন্ট যোগ করুন
                  </button>
                </Link>
              </div>
            </div>

            {/* Site Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">সাইট পরিসংখ্যান</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">অনলাইন ইউজার</span>
                  <span className="font-semibold">{toBanglaNumber(stats.onlineUsers)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">মোট প্রার্থী</span>
                  <span className="font-semibold">{toBanglaNumber(stats.totalCandidates)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">আসন বাকি</span>
                  <span className="font-semibold text-orange-600">{toBanglaNumber(stats.pendingSeats)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ট্রেন্ডিং নিউজ</span>
                  <span className="font-semibold text-red-600">{toBanglaNumber(stats.trendingNews)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;