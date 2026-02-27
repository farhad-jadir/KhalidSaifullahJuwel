// app/admin/election-roadmap/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import Link from 'next/link'
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  restrictToVerticalAxis,
} from '@dnd-kit/modifiers'
import { SortableItem } from '../components/SortableItem'

// Types
interface ElectionCategory {
  id: string
  category_name: string
  display_order: number
  is_active: boolean
  created_at: string
}

interface ElectionNews {
  id: string
  category_id: string
  title: string
  description: string
  news_date: string
  location: string
  news_type: string
  author: string
  views: number
  read_time: string
  is_featured: boolean
  image_url: string
  is_active: boolean
  created_at: string
}

interface FeaturedNews {
  id: string
  title: string
  summary: string
  image_url: string
  category: string
  read_time: string
  news_date: string
  views: number
  comments_count: number
  display_order: number
  is_active: boolean
}

interface UpcomingEvent {
  id: string
  event_name: string
  description: string
  event_date: string
  event_time: string
  location: string
  image_url: string
  is_active: boolean
}

interface NewspaperColumn {
  id: string
  title: string
  content: string
  author: string
  column_date: string
  column_type: string
  is_active: boolean
}

interface PhotoGallery {
  id: string
  image_url: string
  caption: string
  photo_date: string
  category: string
  is_active: boolean
}

interface Statistic {
  id: string
  stat_name: string
  stat_value: string
  icon: string
  display_order: number
  is_active: boolean
}

export default function ElectionRoadmapAdmin() {
  // State management for all sections
  const [activeTab, setActiveTab] = useState('categories')
  const [categories, setCategories] = useState<ElectionCategory[]>([])
  const [news, setNews] = useState<ElectionNews[]>([])
  const [featuredNews, setFeaturedNews] = useState<FeaturedNews[]>([])
  const [events, setEvents] = useState<UpcomingEvent[]>([])
  const [columns, setColumns] = useState<NewspaperColumn[]>([])
  const [gallery, setGallery] = useState<PhotoGallery[]>([])
  const [stats, setStats] = useState<Statistic[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')

  // Form state
  const [formData, setFormData] = useState<any>({})

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    setLoading(true)
    try {
      const [
        { data: categoriesData },
        { data: newsData },
        { data: featuredData },
        { data: eventsData },
        { data: columnsData },
        { data: galleryData },
        { data: statsData }
      ] = await Promise.all([
        supabase.from('election_categories').select('*').order('display_order'),
        supabase.from('election_news').select('*').order('created_at', { ascending: false }),
        supabase.from('featured_news').select('*').order('display_order'),
        supabase.from('upcoming_events').select('*').order('event_date'),
        supabase.from('newspaper_columns').select('*').order('column_date', { ascending: false }),
        supabase.from('photo_gallery').select('*').order('created_at', { ascending: false }),
        supabase.from('election_statistics').select('*').order('display_order')
      ])

      if (categoriesData) setCategories(categoriesData)
      if (newsData) setNews(newsData)
      if (featuredData) setFeaturedNews(featuredData)
      if (eventsData) setEvents(eventsData)
      if (columnsData) setColumns(columnsData)
      if (galleryData) setGallery(galleryData)
      if (statsData) setStats(statsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Image upload function
  const uploadImage = async (file: File) => {
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('election-images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('election-images')
        .getPublicUrl(filePath)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    } finally {
      setUploading(false)
    }
  }

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let result
      
      switch (modalType) {
        case 'category':
          if (editingItem) {
            result = await supabase
              .from('election_categories')
              .update(formData)
              .eq('id', editingItem.id)
          } else {
            result = await supabase
              .from('election_categories')
              .insert([formData])
          }
          break

        case 'featured':
          if (editingItem) {
            result = await supabase
              .from('featured_news')
              .update(formData)
              .eq('id', editingItem.id)
          } else {
            result = await supabase
              .from('featured_news')
              .insert([formData])
          }
          break

        case 'event':
          if (editingItem) {
            result = await supabase
              .from('upcoming_events')
              .update(formData)
              .eq('id', editingItem.id)
          } else {
            result = await supabase
              .from('upcoming_events')
              .insert([formData])
          }
          break

        case 'column':
          if (editingItem) {
            result = await supabase
              .from('newspaper_columns')
              .update(formData)
              .eq('id', editingItem.id)
          } else {
            result = await supabase
              .from('newspaper_columns')
              .insert([formData])
          }
          break

        case 'gallery':
          if (editingItem) {
            result = await supabase
              .from('photo_gallery')
              .update(formData)
              .eq('id', editingItem.id)
          } else {
            result = await supabase
              .from('photo_gallery')
              .insert([formData])
          }
          break

        case 'stat':
          if (editingItem) {
            result = await supabase
              .from('election_statistics')
              .update(formData)
              .eq('id', editingItem.id)
          } else {
            result = await supabase
              .from('election_statistics')
              .insert([formData])
          }
          break
      }

      if (result?.error) throw result.error
      
      setShowModal(false)
      setEditingItem(null)
      setFormData({})
      fetchAllData()
      
    } catch (error) {
      console.error('Error saving data:', error)
      alert('Error saving data. Please try again.')
    }
  }

  // Handle delete
  const handleDelete = async (table: string, id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error
      
      fetchAllData()
      
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Error deleting item. Please try again.')
    }
  }

  // Handle toggle active status
  const toggleActive = async (table: string, id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from(table)
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error
      
      fetchAllData()
      
    } catch (error) {
      console.error('Error toggling status:', error)
    }
  }

  // Handle drag end for reordering
  const handleDragEnd = async (event: DragEndEvent, items: any[], table: string) => {
    const { active, over } = event
    
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over?.id)
      
      const newItems = arrayMove(items, oldIndex, newIndex)
      
      // Update local state
      if (table === 'election_categories') {
        setCategories(newItems)
      } else if (table === 'featured_news') {
        setFeaturedNews(newItems)
      } else if (table === 'election_statistics') {
        setStats(newItems)
      }
      
      // Update display_order in database
      for (let i = 0; i < newItems.length; i++) {
        await supabase
          .from(table)
          .update({ display_order: i })
          .eq('id', newItems[i].id)
      }
    }
  }

  // Open modal for editing
  const openEditModal = (type: string, item: any = null) => {
    setModalType(type)
    setEditingItem(item)
    if (item) {
      setFormData(item)
    } else {
      setFormData({ is_active: true })
    }
    setShowModal(true)
  }

  // Render modal form based on type
  const renderModalForm = () => {
    switch (modalType) {
      case 'category':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name (বাংলায়)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.category_name || ''}
                onChange={(e) => setFormData({ ...formData, category_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.display_order || 0}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <label className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
          </div>
        )

      case 'featured':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Summary
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                rows={3}
                value={formData.summary || ''}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Read Time (e.g., "৫ মিনিট")
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.read_time || ''}
                onChange={(e) => setFormData({ ...formData, read_time: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                News Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.news_date || ''}
                onChange={(e) => setFormData({ ...formData, news_date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Upload
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const url = await uploadImage(file)
                    if (url) {
                      setFormData({ ...formData, image_url: url })
                    }
                  }
                }}
              />
              {formData.image_url && (
                <div className="mt-2 relative h-20 w-20">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-full w-full object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.display_order || 0}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <label className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
          </div>
        )

      case 'gallery':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image Upload
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const url = await uploadImage(file)
                    if (url) {
                      setFormData({ ...formData, image_url: url })
                    }
                  }
                }}
                required={!editingItem}
              />
              {formData.image_url && (
                <div className="mt-2 relative h-32 w-32">
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="h-full w-full object-cover rounded"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.caption || ''}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category (e.g., "রally", "সভা")
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photo Date
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.photo_date || ''}
                onChange={(e) => setFormData({ ...formData, photo_date: e.target.value })}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <label className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
          </div>
        )

      case 'stat':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stat Name (e.g., "মোট ভোটার")
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.stat_name || ''}
                onChange={(e) => setFormData({ ...formData, stat_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stat Value (e.g., "১০ কোটি")
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.stat_value || ''}
                onChange={(e) => setFormData({ ...formData, stat_value: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon (Emoji)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.icon || ''}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., 👥"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.display_order || 0}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                checked={formData.is_active !== false}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <label className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">নির্বাচন সংবাদ - এডমিন প্যানেল</h1>
            <Link
              href="/news/election"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              target="_blank"
            >
              পাবলিক ভিউ দেখুন
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {[
              { id: 'categories', name: 'ক্যাটাগরি' },
              { id: 'featured', name: 'ফিচার্ড নিউজ' },
              { id: 'events', name: 'আসন্ন অনুষ্ঠান' },
              { id: 'columns', name: 'সম্পাদকীয়' },
              { id: 'gallery', name: 'ফটো গ্যালারি' },
              { id: 'stats', name: 'পরিসংখ্যান' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-red-600 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">ক্যাটাগরি ম্যানেজ করুন</h2>
              <button
                onClick={() => openEditModal('category')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + নতুন ক্যাটাগরি
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, categories, 'election_categories')}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={categories.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  {categories.map((category) => (
                    <SortableItem key={category.id} id={category.id}>
                      <div className="px-6 py-4 border-b border-gray-200 last:border-0">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center">
                              <div className="cursor-move mr-4 text-gray-400">⋮⋮</div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                  {category.category_name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Order: {category.display_order}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleActive('election_categories', category.id, category.is_active)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                category.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {category.is_active ? 'Active' : 'Inactive'}
                            </button>
                            <button
                              onClick={() => openEditModal('category', category)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('election_categories', category.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Featured News Tab */}
        {activeTab === 'featured' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">ফিচার্ড নিউজ ম্যানেজ করুন</h2>
              <button
                onClick={() => openEditModal('featured')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + নতুন ফিচার্ড নিউজ
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, featuredNews, 'featured_news')}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={featuredNews.map(f => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  {featuredNews.map((item) => (
                    <SortableItem key={item.id} id={item.id}>
                      <div className="px-6 py-4 border-b border-gray-200 last:border-0">
                        <div className="flex items-center">
                          <div className="cursor-move mr-4 text-gray-400">⋮⋮</div>
                          {item.image_url && (
                            <div className="mr-4 h-16 w-16 flex-shrink-0">
                              <img
                                src={item.image_url}
                                alt={item.title}
                                className="h-16 w-16 object-cover rounded"
                              />
                            </div>
                          )}
                          <div className="flex-1">
                            <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2">{item.summary}</p>
                            <div className="flex items-center mt-2 space-x-4 text-xs text-gray-400">
                              <span>{item.category}</span>
                              <span>{item.read_time}</span>
                              <span>Views: {item.views}</span>
                              <span>Comments: {item.comments_count}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleActive('featured_news', item.id, item.is_active)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                item.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {item.is_active ? 'Active' : 'Inactive'}
                            </button>
                            <button
                              onClick={() => openEditModal('featured', item)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('featured_news', item.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">আসন্ন অনুষ্ঠান ম্যানেজ করুন</h2>
              <button
                onClick={() => openEditModal('event')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + নতুন অনুষ্ঠান
              </button>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {events.map((event) => (
                <div key={event.id} className="px-6 py-4 border-b border-gray-200 last:border-0">
                  <div className="flex items-center">
                    {event.image_url && (
                      <div className="mr-4 h-16 w-16 flex-shrink-0">
                        <img
                          src={event.image_url}
                          alt={event.event_name}
                          className="h-16 w-16 object-cover rounded"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">{event.event_name}</h3>
                      <p className="text-sm text-gray-500">{event.description}</p>
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-400">
                        <span>📅 {event.event_date}</span>
                        <span>⏰ {event.event_time}</span>
                        <span>📍 {event.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleActive('upcoming_events', event.id, event.is_active)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {event.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => openEditModal('event', event)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete('upcoming_events', event.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">ফটো গ্যালারি ম্যানেজ করুন</h2>
              <button
                onClick={() => openEditModal('gallery')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + নতুন ছবি আপলোড
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((photo) => (
                <div key={photo.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative h-48">
                    <img
                      src={photo.image_url}
                      alt={photo.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-2">{photo.caption}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{photo.photo_date}</span>
                      <span className="text-xs text-gray-400">{photo.category}</span>
                    </div>
                    <div className="flex justify-end space-x-2 mt-3">
                      <button
                        onClick={() => toggleActive('photo_gallery', photo.id, photo.is_active)}
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          photo.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {photo.is_active ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => openEditModal('gallery', photo)}
                        className="text-blue-600 hover:text-blue-900 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete('photo_gallery', photo.id)}
                        className="text-red-600 hover:text-red-900 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">পরিসংখ্যান ম্যানেজ করুন</h2>
              <button
                onClick={() => openEditModal('stat')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                + নতুন পরিসংখ্যান
              </button>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={(event) => handleDragEnd(event, stats, 'election_statistics')}
              modifiers={[restrictToVerticalAxis]}
            >
              <SortableContext
                items={stats.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  {stats.map((stat) => (
                    <SortableItem key={stat.id} id={stat.id}>
                      <div className="px-6 py-4 border-b border-gray-200 last:border-0">
                        <div className="flex items-center">
                          <div className="cursor-move mr-4 text-gray-400">⋮⋮</div>
                          <div className="flex-1">
                            <div className="flex items-center">
                              <span className="text-2xl mr-3">{stat.icon}</span>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                  {stat.stat_name}: {stat.stat_value}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  Order: {stat.display_order}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleActive('election_statistics', stat.id, stat.is_active)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                stat.is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {stat.is_active ? 'Active' : 'Inactive'}
                            </button>
                            <button
                              onClick={() => openEditModal('stat', stat)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete('election_statistics', stat.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingItem ? 'Edit' : 'Add New'} {
                  modalType === 'category' ? 'Category' :
                  modalType === 'featured' ? 'Featured News' :
                  modalType === 'event' ? 'Event' :
                  modalType === 'column' ? 'Column' :
                  modalType === 'gallery' ? 'Photo' :
                  modalType === 'stat' ? 'Statistic' : ''
                }
              </h3>
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingItem(null)
                  setFormData({})
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {renderModalForm()}
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingItem(null)
                    setFormData({})
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : (editingItem ? 'Update' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}