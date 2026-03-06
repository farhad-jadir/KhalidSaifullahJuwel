// components/hero.tsx
'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';

// Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// SVG Icons as components (unchanged)
const ArrowRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const UserGroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
  </svg>
);

const HeartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.5 20.25l-.259-1.035a3.375 3.375 0 00-2.456-2.456L12.75 16.5l1.035-.259a3.375 3.375 0 002.456-2.456L16.5 12.75l.259 1.035a3.375 3.375 0 002.456 2.456L20.25 16.5l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

export default function Hero() {
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check mobile and visibility
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setIsVisible(true);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Optimized mouse move - only on desktop
  useEffect(() => {
    if (isMobile) return; // Skip on mobile
    
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Load images with caching
  const loadGalleryImages = useCallback(async () => {
    try {
      // Check cache first
      const cached = sessionStorage.getItem('gallery_images');
      if (cached) {
        setGalleryImages(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const { data } = await supabase
        .from('gallery_photos')
        .select('image_url, title')
        .eq('status', 'active')
        .order('id', { ascending: false })
        .limit(isMobile ? 4 : 10); // Load fewer images on mobile

      if (data && data.length > 0) {
        setGalleryImages(data);
        sessionStorage.setItem('gallery_images', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error loading gallery images:', err);
    } finally {
      setLoading(false);
    }
  }, [isMobile]);

  useEffect(() => {
    loadGalleryImages();
  }, [loadGalleryImages]);

  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden"
    >
      {/* Animated Background Elements - Simplified on mobile */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Only show animated blobs on desktop or if visible */}
        {!isMobile && isVisible && (
          <>
            <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </>
        )}
        
        {/* Floating Particles - Only on desktop */}
        {!isMobile && (
          <div className="absolute inset-0" style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/20 rounded-full"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `float ${5 + Math.random() * 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full py-12 lg:py-20">
          
          {/* Left Content - Animated Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-left order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6 border border-white/20"
            >
              <SparklesIcon />
              <span className="text-xs sm:text-sm text-white/90">জনতার নেতা - ২০২৪</span>
            </motion.div>

            {/* Name with Gradient */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-2 sm:mb-4"
            >
              <span className="text-white">খালেদ সাইফুল্লাহ</span>
              <br />
              <span className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-transparent bg-clip-text text-2xl sm:text-3xl md:text-4xl lg:text-7xl">
                জুয়েল
              </span>
            </motion.h1>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="space-y-2 sm:space-y-4 mb-6 sm:mb-8"
            >
              <p className="text-sm sm:text-base md:text-xl text-gray-300 leading-relaxed max-w-lg">
                মানুষের অধিকার, উন্নয়ন ও ন্যায়ের রাজনীতিতে বিশ্বাসী। 
                <span className="block mt-1 sm:mt-2 text-green-400 font-semibold text-xs sm:text-sm md:text-lg">
                  বাঘারপাড়ার উন্নয়ন ও জনগণের কল্যাণে নিবেদিত একজন নেতৃত্ব।
                </span>
              </p>
            </motion.div>

            {/* CTA Buttons with Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex flex-wrap gap-2 sm:gap-4 mb-8 lg:mb-12"
            >
              <Link href="/about" className="flex-1 sm:flex-none">
                <motion.button
                  whileHover={!isMobile ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto group bg-gradient-to-r from-green-500 to-green-600 text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base"
                >
                  <UserGroupIcon />
                  <span className="whitespace-nowrap">আমার সম্পর্কে</span>
                  <ArrowRightIcon />
                </motion.button>
              </Link>

              <Link href="/contact" className="flex-1 sm:flex-none">
                <motion.button
                  whileHover={!isMobile ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto group bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base"
                >
                  <PhoneIcon />
                  <span className="whitespace-nowrap">যোগাযোগ</span>
                </motion.button>
              </Link>

              <Link href="/sohojogi" className="flex-1 sm:flex-none">
                <motion.button
                  whileHover={!isMobile ? { scale: 1.05 } : {}}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto group bg-gradient-to-r from-red-500 to-red-600 text-white px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 rounded-lg sm:rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base"
                >
                  <HeartIcon />
                  <span className="whitespace-nowrap">সহযোগী হোন</span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats Counter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="grid grid-cols-3 gap-4 sm:gap-6 max-w-md"
            >
              {[
                { label: 'সম্পাদিত কাজ', value: '৫০০+' },
                { label: 'সক্রিয় সদস্য', value: '১০০০+' },
                { label: 'আস্থা', value: '১০০%' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-400">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Enhanced Carousel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative order-1 lg:order-2 mb-6 lg:mb-0"
          >
            {loading || galleryImages.length === 0 ? (
              <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 shadow-xl sm:shadow-2xl">
                <Image
                  src="/jewel.jpg"
                  alt="Khaled Saifullah Jewel"
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </div>
            ) : (
              <>
                <Swiper
                  modules={[Autoplay, Navigation, Pagination, EffectFade]}
                  effect="fade"
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation={!isMobile} // Disable navigation on mobile
                  pagination={{ clickable: true }}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  loop
                  className="rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl sm:shadow-2xl"
                  style={
                    {
                      '--swiper-navigation-color': '#fff',
                      '--swiper-pagination-color': '#22c55e',
                    } as any
                  }
                >
                  {galleryImages.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-gray-700 to-gray-800">
                        <Image
                          src={image.image_url}
                          alt={image.title || 'Gallery image'}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 600px"
                          priority={index === 0}
                          loading={index === 0 ? 'eager' : 'lazy'}
                          quality={isMobile ? 70 : 75} // Lower quality on mobile
                        />
                        
                        {/* Image Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        
                        {/* Caption - Only show on larger screens */}
                        {image.title && !isMobile && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="absolute bottom-0 left-0 right-0 p-4 sm:p-6"
                          >
                            <p className="text-white text-sm sm:text-base lg:text-lg font-semibold text-center line-clamp-2">
                              {image.title}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Decorative Elements - Hidden on mobile */}
                {!isMobile && (
                  <>
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-green-500/30 rounded-full blur-2xl" />
                    <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/30 rounded-full blur-2xl" />
                  </>
                )}
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      {!isMobile && (
        <motion.button
          onClick={scrollToNext}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, repeat: Infinity, duration: 1, repeatType: "reverse" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 hover:text-white transition-colors"
        >
          <ChevronDownIcon />
        </motion.button>
      )}

      {/* Custom Styles - Optimized for mobile */}
      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-100px) rotate(180deg); }
          100% { transform: translateY(0px) rotate(360deg); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .swiper {
          width: 100%;
          height: 100%;
        }

        .swiper-slide {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Responsive navigation buttons */
        .swiper-button-next,
        .swiper-button-prev {
          width: 28px !important;
          height: 28px !important;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          backdrop-filter: blur(4px);
          transition: all 0.3s ease;
        }

        @media (min-width: 640px) {
          .swiper-button-next,
          .swiper-button-prev {
            width: 32px !important;
            height: 32px !important;
          }
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: scale(1.1);
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 12px !important;
          font-weight: bold;
        }

        @media (min-width: 640px) {
          .swiper-button-next:after,
          .swiper-button-prev:after {
            font-size: 14px !important;
          }
        }

        .swiper-button-next {
          right: 8px !important;
        }

        .swiper-button-prev {
          left: 8px !important;
        }

        @media (min-width: 640px) {
          .swiper-button-next {
            right: 10px !important;
          }
          .swiper-button-prev {
            left: 10px !important;
          }
        }

        /* Responsive pagination */
        .swiper-pagination-bullet {
          width: 6px !important;
          height: 6px !important;
          background: #fff !important;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        @media (min-width: 640px) {
          .swiper-pagination-bullet {
            width: 8px !important;
            height: 8px !important;
          }
        }

        .swiper-pagination-bullet-active {
          width: 18px !important;
          border-radius: 10px !important;
          background: #22c55e !important;
          opacity: 1;
        }

        @media (min-width: 640px) {
          .swiper-pagination-bullet-active {
            width: 24px !important;
            border-radius: 12px !important;
          }
        }

        /* Line clamp for captions */
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
}