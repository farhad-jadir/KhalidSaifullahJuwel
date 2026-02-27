// app/admin/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface DashboardStats {
  totalCategories: number
  totalNews: number
  totalFeatured: number
  totalEvents: number
  totalColumns: number
  totalGallery: number
  totalStats: number
  recentNews: any[]
  upcomingEvents: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCategories: 0,
    totalNews: 0,
    totalFeatured: 0,
    totalEvents: 0,
    totalColumns: 0,
    totalGallery: 0,
    totalStats: 0,
    recentNews: [],
    upcomingEvents: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    setLoading(true)
    try {
      const [
        { count: categoriesCount },
        { count: newsCount },
        { count: featuredCount },
        { count: eventsCount },
        { count: columnsCount },
        { count: galleryCount },
        { count: statsCount },
        { data: recentNews },
        { data: upcomingEvents }
      ] = await Promise.all([
        supabase.from('election_categories').select('*', { count: 'exact', head: true }),
        supabase.from('election_news').select('*', { count: 'exact', head: true }),
        supabase.from('featured_news').select('*', { count: 'exact', head: true }),
        supabase.from('upcoming_events').select('*', { count: 'exact', head: true }),
        supabase.from('newspaper_columns').select('*', { count: 'exact', head: true }),
        supabase.from('photo_gallery').select('*', { count: 'exact', head: true }),
        supabase.from('election_statistics').select('*', { count: 'exact', head: true }),
        supabase.from('election_news').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('upcoming_events').select('*').gte('event_date', new Date().toISOString().split('T')[0]).order('event_date').limit(5)
      ])

      setStats({
        totalCategories: categoriesCount || 0,
        totalNews: newsCount || 0,
        totalFeatured: featuredCount || 0,
        totalEvents: eventsCount || 0,
        totalColumns: columnsCount || 0,
        totalGallery: galleryCount || 0,
        totalStats: statsCount || 0,
        recentNews: recentNews || [],
        upcomingEvents: upcomingEvents || []
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const statCards = [
    { title: 'মোট ক্যাটাগরি', value: stats.totalCategories, icon: '📑', color: 'bg-blue-500', link: '/admin/election-roadmap?tab=categories' },
    { title: 'মোট সংবাদ', value: stats.totalNews, icon: '📰', color: 'bg-green-500', link: '/admin/election-roadmap?tab=news' },
    { title: 'ফিচার্ড নিউজ', value: stats.totalFeatured, icon: '⭐', color: 'bg-yellow-500', link: '/admin/election-roadmap?tab=featured' },
    { title: 'আসন্ন অনুষ্ঠান', value: stats.totalEvents, icon: '📅', color: 'bg-purple-500', link: '/admin/election-roadmap?tab=events' },
    { title: 'সম্পাদকীয়', value: stats.totalColumns, icon: '✍️', color: 'bg-red-500', link: '/admin/election-roadmap?tab=columns' },
    { title: 'গ্যালারি', value: stats.totalGallery, icon: '🖼️', color: 'bg-pink-500', link: '/admin/election-roadmap?tab=gallery' },
    { title: 'পরিসংখ্যান', value: stats.totalStats, icon: '📊', color: 'bg-indigo-500', link: '/admin/election-roadmap?tab=stats' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">ড্যাশবোর্ড</h1>
        <div className="text-sm text-gray-500">
          সর্বশেষ আপডেট: {new Date().toLocaleDateString('bn-BD')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent News */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">সর্বশেষ সংবাদ</h2>
            <Link href="/admin/election-roadmap?tab=news" className="text-sm text-red-600 hover:text-red-700">
              সব দেখুন →
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentNews.length > 0 ? (
              stats.recentNews.map((news: any) => (
                <div key={news.id} className="flex items-start space-x-3 border-b border-gray-100 pb-3 last:border-0">
                  {news.image_url && (
                    <div className="w-12 h-12 flex-shrink-0">
                      <img src={news.image_url} alt={news.title} className="w-full h-full object-cover rounded" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 line-clamp-1">{news.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(news.created_at)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">কোন সংবাদ নেই</p>
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">আসন্ন অনুষ্ঠান</h2>
            <Link href="/admin/election-roadmap?tab=events" className="text-sm text-red-600 hover:text-red-700">
              সব দেখুন →
            </Link>
          </div>
          <div className="space-y-4">
            {stats.upcomingEvents.length > 0 ? (
              stats.upcomingEvents.map((event: any) => (
                <div key={event.id} className="flex items-start space-x-3 border-b border-gray-100 pb-3 last:border-0">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 flex-shrink-0">
                    📅
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{event.event_name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(event.event_date)} | {event.location}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">কোন আসন্ন অনুষ্ঠান নেই</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">দ্রুত অ্যাকশন</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/election-roadmap?action=new&type=featured"
            className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">📰</div>
            <div className="text-sm font-medium text-gray-700">নতুন ফিচার্ড নিউজ</div>
          </Link>
          <Link
            href="/admin/election-roadmap?action=new&type=event"
            className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">📅</div>
            <div className="text-sm font-medium text-gray-700">নতুন অনুষ্ঠান</div>
          </Link>
          <Link
            href="/admin/election-roadmap?action=new&type=gallery"
            className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">🖼️</div>
            <div className="text-sm font-medium text-gray-700">ছবি আপলোড</div>
          </Link>
          <Link
            href="/admin/election-roadmap?action=new&type=stat"
            className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-medium text-gray-700">নতুন পরিসংখ্যান</div>
          </Link>
        </div>
      </div>
    </div>
  )
}