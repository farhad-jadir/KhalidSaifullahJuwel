//app/admin/layout.tsx
'use client'

import { ReactNode, useState, useRef, ChangeEvent } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Bell, Menu, Camera, Upload } from 'lucide-react'

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [adminImage, setAdminImage] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    setUploadError(null) // Clear any error when closing menu
  }

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setUploadError(null) // Clear previous errors
    
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setUploadError('অনুগ্রহ করে একটি ছবি নির্বাচন করুন')
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('ছবির সাইজ ৫MB এর কম হতে হবে')
        return
      }

      const reader = new FileReader()
      
      reader.onload = (e) => {
        const result = e.target?.result as string
        setAdminImage(result)
        console.log('Image uploaded successfully') // Debug log
      }

      reader.onerror = () => {
        setUploadError('ছবি আপলোড করতে সমস্যা হয়েছে')
      }

      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
    // Don't close menu immediately, let user see the file selection
  }

  // Default avatar if no image is uploaded
  const getAdminImage = () => {
    return adminImage || '/default-avatar.png' // Make sure to add a default avatar image in your public folder
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white p-4 shadow flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* Hamburger Menu Button */}
          <div className="relative">
            <button 
              onClick={toggleMenu}
              className="p-1 hover:bg-red-700 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <>
                {/* Overlay to close menu when clicking outside */}
                <div 
                  className="fixed inset-0 z-40"
                  onClick={closeMenu}
                />
                
                {/* Menu Dropdown */}
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50">
                  {/* Admin Image Upload Option */}
                  <div className="px-4 py-3 border-b">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                          {adminImage ? (
                            <img 
                              src={adminImage}
                              alt="Admin"
                              className="w-full h-full object-cover"
                              onError={() => console.log('Image failed to load')}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                              <Camera size={24} className="text-gray-600" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">খালেদ সাইফুল্লাহ জুয়েল</p>
                        <p className="text-xs text-gray-500 mb-2">এডমিন</p>
                        <button
                          onClick={triggerFileInput}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-700 transition-colors flex items-center gap-1"
                        >
                          <Upload size={14} />
                          
                        </button>
                      </div>
                    </div>
                    
                    {/* Upload Error Message */}
                    {uploadError && (
                      <p className="text-red-500 text-xs mt-2">{uploadError}</p>
                    )}
                  </div>

                  {/* Hidden File Input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Menu Items */}
                  <Link 
                    href="/admin" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={closeMenu}
                  >
                    ড্যাশবোর্ড
                  </Link>
                  <Link 
                    href="/admin/election" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={closeMenu}
                  >
                    নির্বাচন
                  </Link>
                  <Link 
                    href="/admin/activities/political" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={closeMenu}
                  >
                    রাজনৈতিক কার্যক্রম
                  </Link>
                   <Link 
                    href="/admin/activities/social" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={closeMenu}
                  >
                    সামাজিক কার্যক্রম
                  </Link>
                  <Link 
                    href="/admin/activities/creative" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={closeMenu}
                  >
                    সৃজনশীল কার্যক্রম
                  </Link>
                  <Link 
                    href="/admin/activities/development" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={closeMenu}
                  >
                    উন্নয়নমূলক কার্যক্রম
                  </Link>
                  <Link 
                    href="/admin/achievements" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={closeMenu}
                  >
                   অর্জনসমূহ
                  </Link>
                  <Link 
                    href="/admin/contact" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={closeMenu}
                  >
                   যোগাযোগ
                  </Link>
                  <Link 
                    href="/admin/partnerships" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={closeMenu}
                  >
                   পার্টনারশিপ
                  </Link>
                  <Link 
                    href="/admin/gallery" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={closeMenu}
                  >
                   গ্যালারি
                  </Link>
                   <Link 
                    href="/admin/hero" 
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={closeMenu}
                  >
                   বায়োডাটা
                  </Link>
                </div>
              </>
            )}
          </div>
          
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Icon */}
          <button className="p-1 hover:bg-red-700 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-red-600 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
              3
            </span>
          </button>

          {/* Admin Profile Image in Header */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden border-2 border-white">
              {adminImage ? (
                <img 
                  src={adminImage}
                  alt="Admin"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-400 flex items-center justify-center text-white text-xs">
                  AD
                </div>
              )}
            </div>
            <span className="hidden sm:inline text-sm">Admin</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>

     
    </div>
  )
}