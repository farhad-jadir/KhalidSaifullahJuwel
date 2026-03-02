//app/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { 
  LayoutDashboard, 
  Newspaper, 
  Vote, 
  TrendingUp, 
  Calendar, 
  Users, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  BarChart3,
  PieChart,
  Activity,
  ChevronRight
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    totalNews: 0,
    totalPolls: 0,
    totalEvents: 0,
    totalSubscribers: 0
  })

  useEffect(() => {
    checkAdmin()
    fetchDashboardStats()
  }, [])

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    setUser(user)

    // Check admin role
    const { data: admin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!admin) {
      alert('You are not authorized')
      router.push('/')
      return
    }

    setLoading(false)
  }

  const fetchDashboardStats = async () => {
    try {
      // Fetch stats from your tables
      const [newsCount, pollsCount, eventsCount, subscribersCount] = await Promise.all([
        supabase.from('election_news').select('*', { count: 'exact', head: true }),
        supabase.from('polls').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('subscribers').select('*', { count: 'exact', head: true })
      ])

      setStats({
        totalNews: newsCount.count || 0,
        totalPolls: pollsCount.count || 0,
        totalEvents: eventsCount.count || 0,
        totalSubscribers: subscribersCount.count || 0
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const menuItems = [
    {
      title: 'ড্যাশবোর্ড',
      icon: LayoutDashboard,
      href: '/admin',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'নির্বাচন সংবাদ',
      icon: Newspaper,
      href: '/admin/election',
      color: 'from-purple-500 to-purple-600',
      description: 'সংবাদ পরিচালনা'
    },
    {
      title: 'জরিপ',
      icon: PieChart,
      href: '/admin/polls',
      color: 'from-green-500 to-green-600',
      description: 'জনমত জরিপ'
    },
    {
      title: 'ট্রেন্ডিং',
      icon: TrendingUp,
      href: '/admin/trending',
      color: 'from-orange-500 to-orange-600',
      description: 'ট্রেন্ডিং টপিকস'
    },
    {
      title: 'ইভেন্ট',
      icon: Calendar,
      href: '/admin/events',
      color: 'from-pink-500 to-pink-600',
      description: 'আসন্ন ইভেন্ট'
    },
    {
      title: 'সাবস্ক্রাইবার',
      icon: Users,
      href: '/admin/subscribers',
      color: 'from-indigo-500 to-indigo-600',
      description: 'সাবস্ক্রাইবার তালিকা'
    }
  ]

  const quickActions = [
    {
      title: 'নতুন সংবাদ',
      href: '/admin/election?action=new',
      icon: Newspaper,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'জরিপ তৈরি',
      href: '/admin/polls?action=new',
      icon: Vote,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'ইভেন্ট যোগ',
      href: '/admin/events?action=new',
      icon: Calendar,
      color: 'bg-pink-100 text-pink-600'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">K</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-800">খালেদ সাইফুল্লাহ</h2>
                    <p className="text-xs text-gray-500">অ্যাডমিন প্যানেল</p>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-4">
              {menuItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors mb-1"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                    <item.icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full mt-4"
              >
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <LogOut className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">লগআউট</p>
                  <p className="text-xs text-gray-500">সাইন আউট করুন</p>
                </div>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed left-0 top-0 h-full w-72 bg-white shadow-xl overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <div>
              <h2 className="font-bold text-gray-800">খালেদ সাইফুল্লাহ</h2>
              <p className="text-xs text-gray-500">অ্যাডমিন প্যানেল</p>
            </div>
          </div>

          {/* Admin Info */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">লগইনকৃত ইমেইল</p>
            <p className="text-sm font-medium text-gray-800 truncate">{user?.email}</p>
          </div>
        </div>

        <div className="p-4">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 transition-colors mb-1 group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <item.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-500">{item.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full mt-4 group"
          >
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <LogOut className="h-5 w-5" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium">লগআউট</p>
              <p className="text-xs text-gray-500">সাইন আউট করুন</p>
            </div>
            <ChevronRight className="h-4 w-4 text-red-400" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-72 min-h-screen">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="h-6 w-6 text-gray-600" />
              </button>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">ড্যাশবোর্ড</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="খুঁজুন..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 sm:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">মোট সংবাদ</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalNews}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Newspaper className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <Link 
                href="/admin/election" 
                className="text-sm text-purple-600 hover:text-purple-700 mt-4 inline-flex items-center gap-1"
              >
                সব সংবাদ দেখুন <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">সক্রিয় জরিপ</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalPolls}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <Link 
                href="/admin/polls" 
                className="text-sm text-green-600 hover:text-green-700 mt-4 inline-flex items-center gap-1"
              >
                জরিপ দেখুন <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-pink-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">আসন্ন ইভেন্ট</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalEvents}</p>
                </div>
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-pink-600" />
                </div>
              </div>
              <Link 
                href="/admin/events" 
                className="text-sm text-pink-600 hover:text-pink-700 mt-4 inline-flex items-center gap-1"
              >
                ইভেন্ট দেখুন <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">সাবস্ক্রাইবার</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalSubscribers}</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <Link 
                href="/admin/subscribers" 
                className="text-sm text-indigo-600 hover:text-indigo-700 mt-4 inline-flex items-center gap-1"
              >
                তালিকা দেখুন <ChevronRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">দ্রুত অ্যাকশন</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  href={action.href}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow flex items-center gap-4"
                >
                  <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{action.title}</p>
                    <p className="text-sm text-gray-500">ক্লিক করুন</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Activity & Links */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">সাম্প্রতিক কার্যক্রম</h2>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                <Link href="/admin/election" className="block p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <p className="font-medium text-gray-800">নির্বাচন সংবাদ প্যানেলে যান</p>
                  <p className="text-sm text-gray-500">সর্বশেষ সংবাদ ১০টি</p>
                </Link>
                <Link href="/admin/polls" className="block p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <p className="font-medium text-gray-800">জনমত জরিপ দেখুন</p>
                  <p className="text-sm text-gray-500">বর্তমান জরিপ ফলাফল</p>
                </Link>
                <Link href="/admin/trending" className="block p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <p className="font-medium text-gray-800">ট্রেন্ডিং টপিকস</p>
                  <p className="text-sm text-gray-500">আলোচিত বিষয়সমূহ</p>
                </Link>
              </div>
            </div>

            {/* Election News Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-800">নির্বাচন সংবাদ</h2>
                <Link href="/admin/election" className="text-sm text-blue-600 hover:text-blue-700">
                  সব দেখুন
                </Link>
              </div>
              
              <Link
                href="/admin/election"
                className="block p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Newspaper className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">নির্বাচন সংবাদ ব্যবস্থাপনা</p>
                    <p className="text-sm text-gray-600">সংবাদ যোগ করুন, সম্পাদনা করুন</p>
                  </div>
                </div>
              </Link>

              {/* Stats Preview */}
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-purple-600">{stats.totalNews}</p>
                  <p className="text-xs text-gray-500">মোট সংবাদ</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-orange-600">{stats.totalPolls}</p>
                  <p className="text-xs text-gray-500">সক্রিয় জরিপ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Feature Link - Election Management */}
          <div className="mt-8">
            <Link
              href="/admin/election"
              className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 rounded-2xl shadow-xl overflow-hidden group"
            >
              <div className="p-8 text-white relative">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                      <Newspaper className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">নির্বাচন সংবাদ</h3>
                      <p className="text-white/80">সম্পূর্ণ সংবাদ ব্যবস্থাপনা</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-4 max-w-2xl">
                    নির্বাচন সংক্রান্ত সকল সংবাদ, জরিপ, ট্রেন্ডিং টপিকস এবং ইভেন্ট পরিচালনা করুন
                  </p>
                  <div className="flex items-center gap-2 text-white/90 group-hover:gap-4 transition-all">
                    <span>এখনই যান</span>
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}