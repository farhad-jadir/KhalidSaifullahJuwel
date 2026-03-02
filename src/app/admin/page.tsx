//app/admin/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { 
  Newspaper, 
  PieChart, 
  Calendar, 
  Users,
  ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
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

  const cards = [
    {
      title: 'নির্বাচন সংবাদ',
      value: stats.totalNews,
      icon: Newspaper,
      href: '/admin/election',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'জনমত জরিপ',
      value: stats.totalPolls,
      icon: PieChart,
      href: '/admin/polls',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'আসন্ন ইভেন্ট',
      value: stats.totalEvents,
      icon: Calendar,
      href: '/admin/events',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      title: 'সাবস্ক্রাইবার',
      value: stats.totalSubscribers,
      icon: Users,
      href: '/admin/subscribers',
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">অ্যাডমিন ড্যাশবোর্ড</h1>
              <p className="text-sm text-gray-600 mt-1">{user?.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={card.href}>
                <div className={`${card.bgColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${card.iconBg} p-3 rounded-xl`}>
                      <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                    </div>
                    <ChevronRight className={`h-5 w-5 ${card.iconColor} opacity-50`} />
                  </div>
                  
                  <div>
                    <p className="text-3xl font-bold text-gray-800 mb-1">{card.value}</p>
                    <p className="text-sm text-gray-600">{card.title}</p>
                  </div>

                  <div className="mt-4">
                    <span className={`text-xs font-medium ${card.iconColor} bg-white px-2 py-1 rounded-full`}>
                      দেখুন →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            স্বাগতম, অ্যাডমিন!
          </h2>
          <p className="text-gray-600">
            উপরের কার্ডগুলিতে ক্লিক করে বিভিন্ন বিভাগ পরিচালনা করুন। 
            প্রতিটি কার্ড আপনাকে নির্দিষ্ট সেকশনে নিয়ে যাবে।
          </p>
          <div className="mt-4 flex gap-4 text-sm text-gray-500">
            <span>• সংবাদ: {stats.totalNews} টি</span>
            <span>• জরিপ: {stats.totalPolls} টি</span>
            <span>• ইভেন্ট: {stats.totalEvents} টি</span>
            <span>• সাবস্ক্রাইবার: {stats.totalSubscribers} জন</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}