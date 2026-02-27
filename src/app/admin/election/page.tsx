// app/admin/election/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  Image as ImageIcon,
  Upload,
  Save,
  X,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  PieChart,
  Newspaper,
  Eye,
  ThumbsUp,
  MessageCircle,
  Search,
  Filter,
  RefreshCw,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase/election';
import { electionNewsApi, pollApi, trendingApi, eventsApi, statsApi, subscriberApi, imageUploadApi } from '@/lib/supabase/election';

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
  image_storage_path?: string;
  trending: boolean;
  featured: boolean;
  likes: number;
  comments: number;
  views: number;
  published_at: string;
}

const AdminElectionPage = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [news, setNews] = useState<ElectionNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNews, setEditingNews] = useState<ElectionNews | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [pollData, setPollData] = useState<any[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  
  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'মনোনয়ন',
    party: 'এনসিপি',
    region: 'ঢাকা',
    content: '',
    image_url: '',
    image_storage_path: '',
    trending: false,
    featured: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [newsRes, statsRes, pollRes, trendingRes, eventsRes] = await Promise.all([
        electionNewsApi.getNews({ limit: 50 }),
        statsApi.getStats(),
        pollApi.getActivePoll(),
        trendingApi.getTrendingTopics(),
        eventsApi.getUpcomingEvents()
      ]);

      if (newsRes.data) setNews(newsRes.data);
      if (statsRes.data) setStats(statsRes.data);
      if (pollRes.data) setPollData(pollRes.data);
      if (trendingRes.data) setTrendingTopics(trendingRes.data);
      if (eventsRes.data) setUpcomingEvents(eventsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `news/${fileName}`;

      const { error: uploadError } = await imageUploadApi.uploadImage(file, filePath);
      if (uploadError) throw uploadError;

      const publicUrl = await imageUploadApi.getPublicUrl(filePath);

      setFormData({
        ...formData,
        image_url: publicUrl,
        image_storage_path: filePath
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\u0980-\u09FF]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const newsData = {
        ...formData,
        slug,
        published_at: new Date().toISOString()
      };

      if (editingNews) {
        await electionNewsApi.updateNews(editingNews.id, newsData);
      } else {
        await electionNewsApi.createNews(newsData);
      }

      await fetchData();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news?')) return;

    try {
      await electionNewsApi.deleteNews(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      category: 'মনোনয়ন',
      party: 'এনসিপি',
      region: 'ঢাকা',
      content: '',
      image_url: '',
      image_storage_path: '',
      trending: false,
      featured: false
    });
    setEditingNews(null);
  };

  const handleEdit = (news: ElectionNews) => {
    setEditingNews(news);
    setFormData({
      title: news.title,
      slug: news.slug,
      category: news.category,
      party: news.party,
      region: news.region,
      content: news.content || '',
      image_url: news.image_url || '',
      image_storage_path: news.image_storage_path || '',
      trending: news.trending,
      featured: news.featured
    });
    setShowModal(true);
  };

  // Pagination
  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Mobile tabs
  const tabs = [
    { id: 'news', label: 'সংবাদ', icon: Newspaper },
    { id: 'poll', label: 'জরিপ', icon: PieChart },
    { id: 'trending', label: 'ট্রেন্ডিং', icon: TrendingUp },
    { id: 'events', label: 'ইভেন্ট', icon: Calendar },
    { id: 'subscribers', label: 'সাবস্ক্রাইবার', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800">মেনু</h2>
            </div>
            <div className="p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Tab Navigation - Desktop */}
        <div className="hidden lg:flex bg-white rounded-xl shadow-lg p-2 mb-6 flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Navigation - Tablet & Mobile */}
        <div className="lg:hidden overflow-x-auto pb-2 mb-4">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 text-sm ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* News Management Tab */}
        {activeTab === 'news' && (
          <div>
            {/* Header Actions - Responsive */}
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 w-full sm:flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="খবর খুঁজুন..."
                      className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0">
                    <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={fetchData}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                  >
                    <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={() => {
                    resetForm();
                    setShowModal(true);
                  }}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>নতুন সংবাদ</span>
                </button>
              </div>
            </div>

            {/* News Table - Responsive Card View for Mobile */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ছবি</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">শিরোনাম</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ক্যাটাগরি</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">দল</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অঞ্চল</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">স্ট্যাটাস</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">এনগেজমেন্ট</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">তারিখ</th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 sm:px-6 py-4">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="h-10 w-10 sm:h-12 sm:w-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                            </div>
                          )}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 max-w-[200px]">
                            {item.title}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-500">{item.party}</td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-500">{item.region}</td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {item.trending && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 whitespace-nowrap">
                                ট্রেন্ডিং
                              </span>
                            )}
                            {item.featured && (
                              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800 whitespace-nowrap">
                                ফিচার্ড
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="flex items-center gap-1 text-xs">
                              <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                              {item.likes}
                            </span>
                            <span className="flex items-center gap-1 text-xs">
                              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                              {item.comments}
                            </span>
                            <span className="flex items-center gap-1 text-xs">
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                              {item.views}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 text-xs sm:text-sm text-gray-500">
                          {new Date(item.published_at).toLocaleDateString('bn-BD')}
                        </td>
                        <td className="px-4 sm:px-6 py-4">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1 sm:p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1 sm:p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex gap-3 mb-3">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="h-16 w-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">{item.title}</h3>
                        <div className="flex flex-wrap gap-1 mb-1">
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {item.category}
                          </span>
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            {item.party}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {item.region}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs">
                          <ThumbsUp className="h-3 w-3 text-gray-500" />
                          {item.likes}
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                          <MessageCircle className="h-3 w-3 text-gray-500" />
                          {item.comments}
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                          <Eye className="h-3 w-3 text-gray-500" />
                          {item.views}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.trending && (
                          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                            ট্রেন্ডিং
                          </span>
                        )}
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 hover:bg-blue-100 rounded-lg transition-colors text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(item.published_at).toLocaleDateString('bn-BD')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {filteredNews.length > 0 && (
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs sm:text-sm text-gray-700">
                    দেখানো হচ্ছে <span className="font-medium">{indexOfFirstItem + 1}</span> -{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, filteredNews.length)}
                    </span>{' '}
                    - <span className="font-medium">{filteredNews.length}</span> টির মধ্যে
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 sm:px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                    <span className="px-3 sm:px-4 py-1 rounded-md bg-blue-600 text-white text-sm sm:text-base">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-2 sm:px-3 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Poll Management Tab - Responsive */}
        {activeTab === 'poll' && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">জরিপ ডাটা ম্যানেজমেন্ট</h2>
            <div className="space-y-3 sm:space-y-4">
              {pollData.map((poll, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1 w-full">
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold text-sm sm:text-base">{poll.party}</span>
                      <span className="text-blue-600 font-bold text-sm sm:text-base">{poll.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                      <div
                        className={`bg-gradient-to-r ${poll.color_from} ${poll.color_to} h-2 sm:h-2.5 rounded-full`}
                        style={{ width: `${poll.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg self-end sm:self-center">
                    <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trending Topics Tab - Responsive */}
        {activeTab === 'trending' && (
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">ট্রেন্ডিং টপিকস</h2>
            <div className="space-y-3 sm:space-y-4">
              {trendingTopics.map((topic, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg gap-2">
                  <div>
                    <p className="font-semibold text-sm sm:text-base">{topic.topic}</p>
                    <p className="text-xs sm:text-sm text-gray-500">{topic.posts} পোস্ট</p>
                  </div>
                  <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg self-end sm:self-center">
                    <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal - Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold">
                  {editingNews ? 'সংবাদ সম্পাদনা' : 'নতুন সংবাদ'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  শিরোনাম *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="সংবাদের শিরোনাম লিখুন"
                />
              </div>

              {/* Category, Party, Region - Responsive Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="মনোনয়ন">মনোনয়ন</option>
                    <option value="ইশতেহার">ইশতেহার</option>
                    <option value="প্রার্থী">প্রার্থী</option>
                    <option value="বিক্ষোভ">বিক্ষোভ</option>
                    <option value="প্রচারণা">প্রচারণা</option>
                    <option value="আপডেট">আপডেট</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    দল
                  </label>
                  <select
                    value={formData.party}
                    onChange={(e) => setFormData({ ...formData, party: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="এনসিপি">এনসিপি</option>
                    <option value="বিএনপি">বিএনপি</option>
                    <option value="জামায়াতে ইসলামি">জামায়াতে ইসলামি</option>
                    <option value="জাতীয় পার্টি">জাতীয় পার্টি</option>
                    <option value="স্বতন্ত্র">স্বতন্ত্র</option>
                    <option value="নির্বাচন কমিশন">নির্বাচন কমিশন</option>
                    <option value="বিভিন্ন">বিভিন্ন</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    অঞ্চল
                  </label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="ঢাকা">ঢাকা</option>
                    <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                    <option value="রংপুর">রংপুর</option>
                    <option value="খুলনা">খুলনা</option>
                    <option value="বরিশাল">বরিশাল</option>
                    <option value="সিলেট">সিলেট</option>
                    <option value="ময়মনসিংহ">ময়মনসিংহ</option>
                    <option value="রাজশাহী">রাজশাহী</option>
                  </select>
                </div>
              </div>

              {/* Image Upload - Responsive */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  ছবি
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6">
                  {formData.image_url ? (
                    <div className="relative">
                      <img
                        src={formData.image_url}
                        alt="Preview"
                        className="max-h-32 sm:max-h-48 mx-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image_url: '', image_storage_path: '' })}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-2 sm:mb-4" />
                      <div className="flex items-center justify-center">
                        <label className="cursor-pointer bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base">
                          <Upload className="h-4 w-4 sm:h-5 sm:w-5 inline-block mr-1 sm:mr-2" />
                          ছবি আপলোড করুন
                          <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                          />
                        </label>
                      </div>
                      {uploading && (
                        <p className="text-xs sm:text-sm text-gray-500 mt-2">আপলোড হচ্ছে...</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  বিস্তারিত
                </label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="সংবাদের বিস্তারিত লিখুন..."
                />
              </div>

              {/* Status Toggles */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.trending}
                    onChange={(e) => setFormData({ ...formData, trending: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">ট্রেন্ডিং</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">ফিচার্ড</span>
                </label>
              </div>

              {/* Submit Buttons - Responsive */}
              <div className="flex flex-col-reverse sm:flex-row items-center gap-3 sm:gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="w-full sm:flex-1 bg-gray-100 text-gray-700 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 text-sm sm:text-base"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                >
                  <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                  {loading ? 'সংরক্ষণ হচ্ছে...' : (editingNews ? 'আপডেট করুন' : 'সংরক্ষণ করুন')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminElectionPage;