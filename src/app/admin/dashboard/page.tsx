// app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home,
  Users,
  Calendar,
  FileText,
  Image as ImageIcon,
  Settings,
  LogOut,
  Activity,
  ChevronRight,
  Vote,
  Briefcase,
  Target,
  Award,
  Megaphone
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalActivities: 0,
    totalCategories: 0,
    upcomingEvents: 0,
    activeProjects: 0
  });

  const menuItems = [
    {
      title: 'রাজনৈতিক কার্যক্রম',
      description: 'ব্যানার, ক্যাটাগরি, কার্যক্রম ও প্রকল্প ব্যবস্থাপনা',
      icon: Vote,
      color: 'bg-red-500',
      // এই লিঙ্কটি AdminPoliticalActivities পেইজে যাবে
      href: '/admin/activities/political',
      badge: 'এডিট করুন'
    },
    {
      title: 'সামাজিক কার্যক্রম',
      description: 'সমাজ সেবা, শিক্ষা ও স্বাস্থ্য',
      icon: Users,
      color: 'bg-blue-500',
      href: '/admin/activities/social',
      badge: 'শীঘ্রই'
    },
    {
      title: 'চলমান প্রকল্প',
      description: 'বর্তমানে চলমান প্রকল্পসমূহ',
      icon: Briefcase,
      color: 'bg-green-500',
      href: '/admin/projects',
      badge: '১২'
    },
    {
      title: 'রাজনৈতিক নীতি',
      description: 'নীতি ও আদর্শ ব্যবস্থাপনা',
      icon: Target,
      color: 'bg-purple-500',
      href: '/admin/principles',
      badge: '৮'
    },
    {
      title: 'অর্জনসমূহ',
      description: 'রাজনৈতিক অর্জন ও সাফল্য',
      icon: Award,
      color: 'bg-yellow-500',
      href: '/admin/achievements',
      badge: '২৪'
    },
    {
      title: 'ইভেন্ট ম্যানেজমেন্ট',
      description: 'আসন্ন ইভেন্ট ও সভা ব্যবস্থাপনা',
      icon: Calendar,
      color: 'bg-indigo-500',
      href: '/admin/events',
      badge: stats.upcomingEvents
    },
    {
      title: 'মিডিয়া লাইব্রেরি',
      description: 'ছবি, ভিডিও ও ডকুমেন্ট ম্যানেজমেন্ট',
      icon: ImageIcon,
      color: 'bg-pink-500',
      href: '/admin/media',
      badge: '১৫০+'
    },
    {
      title: 'ঘোষণা ও প্রচারণা',
      description: 'প্রেস রিলিজ ও প্রচারণা ম্যানেজমেন্ট',
      icon: Megaphone,
      color: 'bg-orange-500',
      href: '/admin/campaigns',
      badge: '১০'
    },
  ];

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  // Fetch dashboard stats
  useEffect(() => {
    // ড্যাশবোর্ড স্ট্যাটস ফেচ করার ফাংশন
    const fetchDashboardStats = async () => {
      try {
        // আপনার API কল এখানে যোগ করুন
        // উদাহরণ:
        // const response = await fetch('/api/dashboard/stats');
        // const data = await response.json();
        // setStats(data);
        
        // Temporary dummy data
        setStats({
          totalActivities: 24,
          totalCategories: 6,
          upcomingEvents: 5,
          activeProjects: 12
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    
    fetchDashboardStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-red-600 p-2 rounded-lg">
                <Home className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">এডমিন ড্যাশবোর্ড</h1>
                <p className="text-gray-600 text-sm">কার্যক্রম ব্যবস্থাপনা প্যানেল</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="font-medium text-gray-900">আব্দুল্লাহ আল মামুন</p>
                <p className="text-sm text-gray-600">সিস্টেম অ্যাডমিন</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">মোট কার্যক্রম</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalActivities}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Vote className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link 
                href="/admin/activities/political"
                className="text-sm text-red-600 hover:text-red-800 font-medium"
              >
                দেখুন →
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">ক্যাটাগরি</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCategories}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link 
                href="/admin/activities/political#categories"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                ম্যানেজ করুন →
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">আসন্ন ইভেন্ট</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingEvents}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link 
                href="/admin/events"
                className="text-sm text-green-600 hover:text-green-800 font-medium"
              >
                দেখুন →
              </Link>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600">চলমান প্রকল্প</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activeProjects}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Briefcase className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <Link 
                href="/admin/activities/political#projects"
                className="text-sm text-purple-600 hover:text-purple-800 font-medium"
              >
                দেখুন →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Access Menu */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">কার্যক্রম ম্যানেজমেন্ট</h2>
            <p className="text-gray-600">বিভিন্ন ধরনের কার্যক্রম ব্যবস্থাপনা করুন</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${item.color} p-3 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    {item.badge && (
                      <span className="bg-gray-100 text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700">
                      প্রবেশ করুন →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">সাম্প্রতিক কার্যক্রম</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <Vote className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">রাজনৈতিক কার্যক্রম ম্যানেজমেন্ট</p>
                  <p className="text-sm text-gray-600">ব্যানার, ক্যাটাগরি, কার্যক্রম ও প্রকল্প এডিট করুন</p>
                </div>
              </div>
              <Link 
                href="/admin/activities/political"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                প্রবেশ করুন
              </Link>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">চলমান প্রকল্প যুক্ত করুন</p>
                  <p className="text-sm text-gray-600">নতুন রাজনৈতিক প্রকল্প সংযুক্ত করুন</p>
                </div>
              </div>
              <Link 
                href="/admin/activities/political#projects"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                প্রকল্প যোগ করুন
              </Link>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">আসন্ন ইভেন্ট আপডেট করুন</p>
                  <p className="text-sm text-gray-600">নতুন রাজনৈতিক ইভেন্ট সংযুক্ত করুন</p>
                </div>
              </div>
              <Link 
                href="/admin/activities/political#events"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                ইভেন্ট যোগ করুন
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Tips */}
        <div className="mt-8 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-red-800 mb-3">দ্রুত টিপস</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/80 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">ব্যানার আপলোড</h4>
              <p className="text-sm text-gray-600">ছবির সাইজ ৫ এমবির বেশি হতে পারবে না</p>
            </div>
            <div className="bg-white/80 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">ক্যাটাগরি অর্ডার</h4>
              <p className="text-sm text-gray-600">ডিসপ্লে অর্ডার ব্যবহার করে সাজান</p>
            </div>
            <div className="bg-white/80 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">ডেটা ব্যাকআপ</h4>
              <p className="text-sm text-gray-600">নিয়মিত ডেটা এক্সপোর্ট করুন</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}