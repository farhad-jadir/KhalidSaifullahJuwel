//app/login/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [rememberMe, setRememberMe] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for saved email
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      alert('দয়া করে ইমেইল এবং পাসওয়ার্ড দিন')
      return
    }

    setLoading(true)
    
    // Simulate network delay for smooth animation
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    // Save email if remember me is checked
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email)
    } else {
      localStorage.removeItem('rememberedEmail')
    }

    router.push('/admin')
  }

  if (!mounted) return null

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-red-600/20 via-red-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-yellow-600/20 via-yellow-500/10 to-transparent rounded-full blur-3xl"
        />
        
        {/* Grid Pattern - Fixed SVG string */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-6xl"
      >
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="flex flex-col lg:flex-row">
            
            {/* Left Side - Hero Section */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="lg:w-1/2 bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-8 lg:p-12 text-white relative overflow-hidden"
            >
              {/* Animated circles */}
              <motion.div
                animate={{ 
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                }}
                transition={{ duration: 20, repeat: Infinity }}
                className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ 
                  x: [0, -50, 0],
                  y: [0, 100, 0],
                }}
                transition={{ duration: 18, repeat: Infinity }}
                className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl"
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                <motion.div variants={fadeInUp} className="mb-8">
                  <div className="flex items-center gap-4 mb-8">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30"
                    >
                      {/* Replaced flag emoji with Image component */}
                      <div className="relative w-10 h-10">
                        <Image
                          src="/jewel.png" // Make sure to add your flag image in public/images folder
                          alt="Bangladesh Flag"
                          width={100}
                          height={100}
                          className="object-contain rounded"
                          priority
                        />
                      </div>
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-light">স্বাগতম</h3>
                      <p className="text-red-100 text-sm">Welcome to the platform</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="flex-1">
                  <motion.h1 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-3xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight"
                  >
                    খালেদ  সাইফুল্লাহ জুয়েল
                    
                  </motion.h1>
                  
                  <motion.p 
                    variants={fadeInUp}
                    className="text-sm sm:text-lg text-red-100 mb-8 max-w-md"
                  >
                    জনগণের সেবায় নিবেদিত, দেশের উন্নয়নে প্রতিশ্রুতিবদ্ধ
                  </motion.p>

                  {/* Stats or Features */}
                  <motion.div variants={fadeInUp} className="grid grid-cols-3 gap-4 mb-8">
                    {[
                      { number: '২+', label: 'বছরের অভিজ্ঞতা' },
                      { number: '১০+', label: 'উন্নয়ন প্রকল্প' },
                      { number: '১০০+', label: 'সেবাপ্রাপ্ত জনতা' }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ y: -5 }}
                        className="text-center p-3 bg-white/10 backdrop-blur rounded-xl border border-white/20"
                      >
                        <div className="text-xl font-bold text-yellow-300">{stat.number}</div>
                        <div className="text-xs text-red-100">{stat.label}</div>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Quote */}
                  <motion.div 
                    variants={fadeInUp}
                    className="border-l-4 border-yellow-400 pl-4 py-2 bg-white/5 backdrop-blur rounded-r-xl"
                  >
                    <p className="text-sm italic text-red-100">
                      "জনসেবাই আমার রাজনীতির প্রধান লক্ষ্য"
                    </p>
                  </motion.div>
                </motion.div>

                <motion.div variants={fadeInUp} className="mt-8 text-xs text-red-200">
                  © ২০২৬ খালেদ সাইফুল্লাহ জুয়েল - সকল অধিকার সংরক্ষিত
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Login Form */}
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="lg:w-1/2 bg-white p-8 lg:p-12"
            >
              <div className="max-w-md mx-auto">
                <motion.div variants={fadeInUp} className="text-center mb-8">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                    className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg"
                  >
                    <span className="text-white text-3xl">⚡</span>
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">অ্যাডমিন লগইন</h2>
                  <p className="text-gray-500">আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
                </motion.div>

                <form onSubmit={handleLogin} className="space-y-6">
                  {/* Email Field */}
                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ইমেইল অ্যাড্রেস
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-300 ${
                          focusedField === 'email' 
                            ? 'border-red-500 bg-white shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="your@email.com"
                      />
                      <motion.div 
                        animate={{ scale: focusedField === 'email' ? 1 : 0 }}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {focusedField === 'email' && (
                          <span className="text-red-500">✉️</span>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Password Field */}
                  <motion.div variants={fadeInUp}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      পাসওয়ার্ড
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-300 pr-12 ${
                          focusedField === 'password' 
                            ? 'border-red-500 bg-white shadow-lg' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showPassword ? '🙈' : '👁'}
                      </button>
                    </div>
                  </motion.div>

                  {/* Remember Me & Forgot Password */}
                  <motion.div variants={fadeInUp} className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-5 h-5 border-2 rounded transition-all duration-300 ${
                          rememberMe 
                            ? 'bg-red-600 border-red-600' 
                            : 'border-gray-300 group-hover:border-red-400'
                        }`}>
                          {rememberMe && (
                            <motion.svg
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-4 h-4 text-white mx-auto"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </motion.svg>
                          )}
                        </div>
                      </div>
                      <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-800">
                        মনে রাখুন
                      </span>
                    </label>
                    
                    <button 
                      type="button"
                      className="text-sm text-red-600 hover:text-red-700 font-medium hover:underline transition-all"
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </button>
                  </motion.div>

                  {/* Login Button */}
                  <motion.div variants={fadeInUp}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                    >
                      <AnimatePresence mode="wait">
                        {loading ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center justify-center"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            প্রসেসিং...
                          </motion.div>
                        ) : (
                          <motion.span
                            key="login"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative z-10"
                          >
                            লগইন করুন
                          </motion.span>
                        )}
                      </AnimatePresence>
                      
                      {/* Button Shine Effect */}
                      <motion.div
                        className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full"
                        animate={{ translateX: ['200%', '-200%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.button>
                  </motion.div>

                  {/* Security Badge */}
                  <motion.div 
                    variants={fadeInUp}
                    className="text-center pt-4"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-green-500 rounded-full"
                      />
                      <span className="text-xs text-gray-600">এনক্রিপ্টেড সংযোগ • SSL সুরক্ষিত</span>
                    </div>
                  </motion.div>

                  {/* Help Text */}
                  <motion.p 
                    variants={fadeInUp}
                    className="text-center text-xs text-gray-400 mt-6"
                  >
                    এই এলাকাটি সুরক্ষিত। শুধুমাত্র অনুমোদিত প্রশাসক প্রবেশ করতে পারবেন।
                  </motion.p>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}