// app/news/election/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  Clock, 
  BarChart3, 
  Award,
  ChevronRight,
  Calendar,
  PieChart,
  Newspaper,
  Filter,
  Search,
  ThumbsUp,
  MessageCircle,
  Share2,
  Bookmark,
  Flame,
  Star,
  Activity,
  X,
  Eye,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Check,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { electionNewsApi, pollApi, trendingApi, eventsApi, statsApi, subscriberApi } from '@/lib/supabase/election';
import Image from 'next/image';
import Link from 'next/link';

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

interface TrendingTopic {
  id: string;
  topic: string;
  posts: number;
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

interface SiteStats {
  total_news: number;
  total_constituencies: number;
  total_candidates: number;
  pending_seats: number;
  online_users: number;
  trending_news: number;
}

// Helper function to convert numbers to Bangla
const toBanglaNumber = (num: number): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, digit => banglaDigits[parseInt(digit)]);
};

// Helper function to format numbers with commas in Bangla
const formatBanglaNumber = (num: number): string => {
  return toBanglaNumber(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Helper function to format date in Bangla
const formatBanglaDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const ElectionNewsPage = () => {
  // State management
  const [electionNews, setElectionNews] = useState<ElectionNews[]>([]);
  const [pollData, setPollData] = useState<PollData[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [stats, setStats] = useState<SiteStats | null>(null);
  
  // UI State
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [visibleNews, setVisibleNews] = useState<ElectionNews[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');

  // News Detail Modal State
  const [selectedNews, setSelectedNews] = useState<ElectionNews | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const [relatedNews, setRelatedNews] = useState<ElectionNews[]>([]);

  // Fetch initial data
  useEffect(() => {
    fetchAllData();
  }, []);

  // Filter news when search, region, or category changes
  useEffect(() => {
    filterNews();
  }, [searchQuery, selectedRegion, selectedCategory, electionNews, activeTab]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const [newsRes, pollRes, trendingRes, eventsRes, statsRes] = await Promise.all([
        electionNewsApi.getNews({ limit: 50 }),
        pollApi.getActivePoll(),
        trendingApi.getTrendingTopics(),
        eventsApi.getUpcomingEvents(),
        statsApi.getStats()
      ]);

      if (newsRes.data) {
        setElectionNews(newsRes.data);
        setVisibleNews(newsRes.data.slice(0, 10));
      }
      if (pollRes.data) setPollData(pollRes.data);
      if (trendingRes.data) setTrendingTopics(trendingRes.data);
      if (eventsRes.data) setUpcomingEvents(eventsRes.data);
      if (statsRes.data) setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterNews = () => {
    let filtered = [...electionNews];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(news => 
        news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        news.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(news => news.region === selectedRegion);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(news => news.category === selectedCategory);
    }

    // Apply tab filter
    switch (activeTab) {
      case 'trending':
        filtered = filtered.filter(news => news.trending);
        break;
      case 'latest':
        filtered = filtered.sort((a, b) => 
          new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
        );
        break;
      case 'popular':
        filtered = filtered.sort((a, b) => b.likes - a.likes);
        break;
      default:
        break;
    }

    setVisibleNews(filtered.slice(0, 10));
    setHasMore(filtered.length > 10);
    setPage(1);
  };

  const loadMoreNews = () => {
    setIsLoading(true);
    setTimeout(() => {
      const start = page * 10;
      const end = start + 10;
      let filtered = [...electionNews];

      // Apply same filters
      if (searchQuery) {
        filtered = filtered.filter(news => 
          news.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (selectedRegion !== 'all') {
        filtered = filtered.filter(news => news.region === selectedRegion);
      }
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(news => news.category === selectedCategory);
      }

      // Apply tab filter
      switch (activeTab) {
        case 'trending':
          filtered = filtered.filter(news => news.trending);
          break;
        case 'latest':
          filtered = filtered.sort((a, b) => 
            new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
          );
          break;
        case 'popular':
          filtered = filtered.sort((a, b) => b.likes - a.likes);
          break;
        default:
          break;
      }

      const newNews = filtered.slice(start, end);
      setVisibleNews(prev => [...prev, ...newNews]);
      setPage(prev => prev + 1);
      setHasMore(end < filtered.length);
      setIsLoading(false);
    }, 1000);
  };

  const handleLike = async (newsId: string) => {
    try {
      await electionNewsApi.incrementLikes(newsId);
      // Update local state
      setElectionNews(prev =>
        prev.map(news =>
          news.id === newsId
            ? { ...news, likes: news.likes + 1 }
            : news
        )
      );
      
      // Update selected news if modal is open
      if (selectedNews?.id === newsId) {
        setSelectedNews(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error liking news:', error);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeLoading(true);
    setSubscribeMessage('');

    try {
      await subscriberApi.subscribe(subscribeEmail);
      setSubscribeMessage('সাবস্ক্রিপশন সফল হয়েছে! আপনার ইনবক্স চেক করুন।');
      setSubscribeEmail('');
      setTimeout(() => {
        setShowSubscribeModal(false);
        setSubscribeMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error subscribing:', error);
      setSubscribeMessage('সাবস্ক্রিপশন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setSubscribeLoading(false);
    }
  };

  // News Detail Modal Functions
  const openNewsDetail = async (news: ElectionNews) => {
    setSelectedNews(news);
    setShowDetailModal(true);
    setShareUrl(`${window.location.origin}/news/election/${news.slug}`);
    
    // Increment view count
    try {
      await electionNewsApi.incrementViews(news.id);
      // Update local state
      setElectionNews(prev =>
        prev.map(item =>
          item.id === news.id
            ? { ...item, views: item.views + 1 }
            : item
        )
      );
    } catch (error) {
      console.error('Error incrementing views:', error);
    }

    // Fetch related news
    try {
      const { data } = await electionNewsApi.getNews({
        region: news.region,
        limit: 4
      });
      if (data) {
        setRelatedNews(data.filter(n => n.id !== news.id).slice(0, 3));
      }
    } catch (error) {
      console.error('Error fetching related news:', error);
    }
  };

  const closeNewsDetail = () => {
    setShowDetailModal(false);
    setSelectedNews(null);
    setLiked(false);
    setBookmarked(false);
    setShowShareMenu(false);
    setCopySuccess('');
    setRelatedNews([]);
  };

  const handleShare = (platform: string) => {
    const text = encodeURIComponent(selectedNews?.title || '');
    const url = encodeURIComponent(shareUrl);

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
    }
    setShowShareMenu(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess('কপি করা হয়েছে!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      setCopySuccess('কপি ব্যর্থ');
    }
  };

  // Categories for filter
  const categories = [
    'সব',
    'মনোনয়ন',
    'ইশতেহার',
    'প্রার্থী',
    'বিক্ষোভ',
    'প্রচারণা',
    'আপডেট'
  ];

  // Regions for filter
  const regions = [
    'সব অঞ্চল',
    'ঢাকা',
    'চট্টগ্রাম',
    'রংপুর',
    'খুলনা',
    'বরিশাল',
    'সিলেট',
    'ময়মনসিংহ',
    'রাজশাহী'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === 'সব' ? 'all' : category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                (category === 'সব' && selectedCategory === 'all') || selectedCategory === category
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main News Section */}
          <div className="lg:col-span-2">
            {/* Tab Navigation and Filters */}
            <div className="bg-white rounded-xl shadow-lg p-2 mb-6 flex flex-wrap gap-2">
              {['all', 'trending', 'latest', 'popular'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab === 'all' && 'সব খবর'}
                  {tab === 'trending' && 'ট্রেন্ডিং'}
                  {tab === 'latest' && 'সর্বশেষ'}
                  {tab === 'popular' && 'জনপ্রিয়'}
                </button>
              ))}
              
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="ml-auto px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 bg-white"
              >
                {regions.map((region) => (
                  <option key={region} value={region === 'সব অঞ্চল' ? 'all' : region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>

            {/* Loading State */}
            {isLoading && visibleNews.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visibleNews.map((news, index) => (
                    <div
                      key={news.id}
                      className="group bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-all duration-500 animate-fadeIn cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => openNewsDetail(news)}
                    >
                      <div className="relative h-48 overflow-hidden">
                        {news.image_url ? (
                          <img
                            src={news.image_url}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
                            <Newspaper className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        {news.trending && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                            <Flame className="h-4 w-4" />
                            ট্রেন্ডিং
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(news.published_at).toLocaleDateString('bn-BD', {
                            hour: 'numeric',
                            minute: 'numeric'
                          })}
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {news.category}
                          </span>
                          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {news.party}
                          </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {news.title}
                        </h3>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {news.region}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {toBanglaNumber(news.views)} বার দেখা
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLike(news.id);
                              }}
                              className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors"
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span>{toBanglaNumber(news.likes)}</span>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                openNewsDetail(news);
                              }}
                              className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors"
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span>{toBanglaNumber(news.comments)}</span>
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Share2 className="h-4 w-4 text-gray-500" />
                            </button>
                            <button 
                              onClick={(e) => e.stopPropagation()}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <Bookmark className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* No Results */}
                {visibleNews.length === 0 && !isLoading && (
                  <div className="text-center py-12 bg-white rounded-2xl">
                    <Newspaper className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">কোনো খবর পাওয়া যায়নি</h3>
                    <p className="text-gray-500">অনুগ্রহ করে অন্য কিওয়ার্ড দিয়ে খুঁজুন</p>
                  </div>
                )}

                {/* Load More Button */}
                {hasMore && visibleNews.length > 0 && (
                  <div className="text-center mt-8">
                    <button
                      onClick={loadMoreNews}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          লোড হচ্ছে...
                        </div>
                      ) : (
                        'আরো খবর দেখুন'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Poll Section */}
            {pollData.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6 transform hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                    <PieChart className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">জরিপ ফলাফল</h3>
                </div>
                
                <div className="space-y-4">
                  {pollData.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{item.party}</span>
                        <span className="text-sm font-bold text-gray-900">{toBanglaNumber(item.percentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${item.color_from} ${item.color_to} h-2.5 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300">
                  বিস্তারিত দেখুন
                </button>
              </div>
            )}

            {/* Trending Topics */}
            {trendingTopics.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 p-2 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">ট্রেন্ডিং টপিক</h3>
                </div>
                
                <div className="space-y-4">
                  {trendingTopics.map((topic, index) => (
                    <div
                      key={topic.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer group"
                    >
                      <div>
                        <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {topic.topic}
                        </p>
                        <p className="text-sm text-gray-500">{formatBanglaNumber(topic.posts)} পোস্ট</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-6 w-6" />
                  <h3 className="text-xl font-bold">আসন্ন ইভেন্ট</h3>
                </div>
                
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-4">
                      <p className="text-sm opacity-90">
                        {new Date(event.event_date).toLocaleDateString('bn-BD', {
                          day: 'numeric',
                          month: 'long'
                        })}
                      </p>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm opacity-75 mt-1">{event.location}</p>
                      {event.party && (
                        <span className="inline-block mt-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                          {event.party}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                
                <button className="mt-6 w-full bg-white text-blue-600 py-3 rounded-xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300">
                  সব ইভেন্ট দেখুন
                </button>
              </div>
            )}

            {/* Newsletter */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">আপডেট পেতে সাবস্ক্রাইব করুন</h3>
              <p className="text-gray-600 mb-4">প্রতিদিনের নির্বাচনী খবর সরাসরি আপনার ইনবক্সে</p>
              
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="আপনার ইমেইল"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  onClick={() => setShowSubscribeModal(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300"
                >
                  সাবস্ক্রাইব
                </button>
              </div>
            </div>

            {/* Important Links */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">গুরুত্বপূর্ণ লিংক</h3>
              <div className="space-y-2">
                <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="font-semibold">নির্বাচন কমিশন</div>
                  <div className="text-sm text-gray-500">সরকারি ওয়েবসাইট</div>
                </a>
                <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="font-semibold">ভোটার তথ্য</div>
                  <div className="text-sm text-gray-500">ভোটার তালিকা চেক করুন</div>
                </a>
                <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="font-semibold">প্রার্থী তালিকা</div>
                  <div className="text-sm text-gray-500">সব দলের প্রার্থীগণ</div>
                </a>
                <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="font-semibold">ফলাফল ২০১৮</div>
                  <div className="text-sm text-gray-500">পূর্ববর্তী নির্বাচনের ফলাফল</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscribe Modal */}
      {showSubscribeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">নিউজলেটার সাবস্ক্রিপশন</h3>
                <button
                  onClick={() => {
                    setShowSubscribeModal(false);
                    setSubscribeMessage('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubscribe}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ইমেইল ঠিকানা
                  </label>
                  <input
                    type="email"
                    required
                    value={subscribeEmail}
                    onChange={(e) => setSubscribeEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>

                {subscribeMessage && (
                  <div className={`mb-4 p-3 rounded-lg ${
                    subscribeMessage.includes('সফল') 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {subscribeMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={subscribeLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
                >
                  {subscribeLoading ? 'সাবস্ক্রাইব হচ্ছে...' : 'সাবস্ক্রাইব'}
                </button>
              </form>

              <p className="text-xs text-gray-500 mt-4 text-center">
                সাবস্ক্রাইব করে আপনি আমাদের প্রাইভেসি পলিসি এবং টার্মস অফ সার্ভিসে সম্মতি দিচ্ছেন
              </p>
            </div>
          </div>
        </div>
      )}

      {/* News Detail Modal */}
      {showDetailModal && selectedNews && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Image */}
            <div className="relative h-64 overflow-hidden rounded-t-2xl">
              {selectedNews.image_url ? (
                <img
                  src={selectedNews.image_url}
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center">
                  <Newspaper className="h-16 w-16 text-white/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
              
              {/* Close Button */}
              <button
                onClick={closeNewsDetail}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-lg transition-colors backdrop-blur-sm"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedNews.category}
                  </span>
                  <span className="bg-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedNews.party}
                  </span>
                  {selectedNews.trending && (
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      ট্রেন্ডিং
                    </span>
                  )}
                </div>

                <h2 className="text-2xl font-bold mb-2">{selectedNews.title}</h2>

                <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formatBanglaDate(selectedNews.published_at)}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedNews.region}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    {toBanglaNumber(selectedNews.views)} বার দেখা
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Action Buttons */}
              <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleLike(selectedNews.id)}
                    disabled={liked}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      liked
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                    {liked ? 'লাইক দেওয়া হয়েছে' : 'লাইক দিন'} ({toBanglaNumber(selectedNews.likes)})
                  </button>

                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    মন্তব্য ({toBanglaNumber(selectedNews.comments)})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`p-2 rounded-lg transition-colors ${
                      bookmarked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Bookmark className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`} />
                  </button>

                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>

                    {showShareMenu && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-50 p-2">
                        <p className="text-sm font-medium text-gray-700 mb-2 px-2">শেয়ার করুন</p>
                        <div className="space-y-1">
                          <button
                            onClick={() => handleShare('facebook')}
                            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Facebook className="h-5 w-5 text-blue-600" />
                            <span>Facebook</span>
                          </button>
                          <button
                            onClick={() => handleShare('twitter')}
                            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Twitter className="h-5 w-5 text-sky-500" />
                            <span>Twitter</span>
                          </button>
                          <button
                            onClick={() => handleShare('linkedin')}
                            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Linkedin className="h-5 w-5 text-blue-700" />
                            <span>LinkedIn</span>
                          </button>
                          <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <LinkIcon className="h-5 w-5 text-gray-600" />
                            <span>লিংক কপি করুন</span>
                          </button>
                          {copySuccess && (
                            <div className="mt-2 px-3 py-2 bg-green-100 text-green-700 text-sm rounded-lg flex items-center gap-2">
                              <Check className="h-4 w-4" />
                              {copySuccess}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* News Content */}
              <div className="prose prose-lg max-w-none mb-8">
                {selectedNews.content ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedNews.content.replace(/\n/g, '<br />') }} />
                ) : (
                  <p className="text-gray-600 italic">কোনো বিস্তারিত তথ্য পাওয়া যায়নি।</p>
                )}
              </div>

              {/* Tags */}
              <div className="mb-8 pb-6 border-b border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <span className="text-gray-600 font-medium">ট্যাগস:</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">#{selectedNews.category}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">#{selectedNews.party}</span>
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">#{selectedNews.region}</span>
                  {selectedNews.trending && (
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">#ট্রেন্ডিং</span>
                  )}
                </div>
              </div>

              {/* Related News */}
              {relatedNews.length > 0 && (
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">সম্পর্কিত খবর</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {relatedNews.map((item) => (
                      <div
                        key={item.id}
                        className="group cursor-pointer"
                        onClick={() => {
                          openNewsDetail(item);
                        }}
                      >
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                            <Newspaper className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <h4 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {toBanglaNumber(item.views)}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {toBanglaNumber(item.likes)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
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
      `}</style>
    </div>
  );
};

export default ElectionNewsPage;