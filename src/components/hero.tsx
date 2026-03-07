'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { motion, useScroll, useTransform } from "framer-motion";
import CountUp from "react-countup";
import { Typewriter } from "react-simple-typewriter";

import "swiper/css";
import "swiper/css/pagination";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Particle {
  id: number;
  left: string;
  top: string;
  size: string;
  duration: string;
  delay: string;
  tx: string;
  ty: string;
}

export default function Hero() {
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [particles, setParticles] = useState<Particle[]>([]);

  // Scroll Parallax (Only Scroll Parallax is kept)
  const { scrollY } = useScroll();
  const yScroll = useTransform(scrollY, [0, 400], [0, 60]);

  useEffect(() => {
    loadGalleryImages();
    generateParticles();
  }, []);

  const loadGalleryImages = async () => {
    const { data } = await supabase
      .from("gallery_photos")
      .select("image_url, title")
      .eq("status", "active")
      .order("id", { ascending: false })
      .limit(8);

    if (data) setGalleryImages(data);
    setLoading(false);
  };

  const generateParticles = () => {
    // 120 Ultra Small Glowing Particles
    const newParticles = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2.5 + 1}px`, // 1px থেকে 3.5px (Ultra small)
      duration: `${Math.random() * 20 + 15}s`, // Smooth 15s - 35s speed
      delay: `${Math.random() * -30}s`, // Negative delay to start randomly immediately
      tx: `${(Math.random() - 0.5) * 150}px`, // Horizontal Drift
      ty: `${(Math.random() - 0.5) * 150}px`, // Vertical Drift
    }));
    setParticles(newParticles);
  };

  return (
    <section className="relative overflow-hidden py-20 sm:py-24 bg-gradient-to-br from-green-950 via-green-900 to-green-800 text-white">
      {/* Light Beam Sweep */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="light-beam"></div>
      </div>

      {/* 120 Glowing Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              boxShadow: "0 0 8px 2px rgba(255, 255, 255, 0.4)", // Premium Glow
              willChange: "transform, opacity", // Performance safe
              //@ts-ignore Custom CSS variables for dynamic keyframes
              '--tx': p.tx,
              '--ty': p.ty,
              animation: `drift ${p.duration} infinite ease-in-out ${p.delay}`,
            }}
          />
        ))}
      </div>

      {/* Glow Background Gradient */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_40%)] pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center z-10">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          {/* Subtle Bangladesh Flag Wave Badge */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bd-wave-badge inline-block mb-6 px-6 py-2 rounded-full border border-white/20 text-sm font-medium shadow-lg backdrop-blur-md text-white"
          >
            🇧🇩 জনগণের নেতা
          </motion.div>

          {/* Animated Typing */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-lg">
            খালেদ সাইফুল্লাহ জুয়েল <br />
            <span className="text-green-300 text-2xl sm:text-4xl inline-block mt-3 font-bold">
              <Typewriter
                words={[
                  "উন্নয়নের অগ্রদূত",
                  "ন্যায়ের কণ্ঠস্বর",
                  "জনতার আস্থা"
                ]}
                loop
                cursor
                typeSpeed={70}
                deleteSpeed={50}
                delaySpeed={2000}
              />
            </span>
          </h1>

          <p className="mt-6 text-green-100/90 text-base sm:text-lg max-w-xl leading-relaxed drop-shadow-md">
            মানুষের অধিকার, উন্নয়ন ও ন্যায়ের রাজনীতিতে বিশ্বাসী।
            যশোরের উন্নয়ন ও জনগণের কল্যাণে নিবেদিত একজন নেতৃত্ব।
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/sohojogi"
              className="relative overflow-hidden group w-full sm:w-auto text-center px-8 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-green-600 text-white shadow-[0_0_20px_rgba(255,0,0,0.3)] hover:shadow-[0_0_30px_rgba(0,255,0,0.4)] hover:scale-105 transition-all duration-300"
            >
              <span className="relative z-10">সহযোগী হোন</span>
              {/* Button inner shine */}
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
            </Link>

            <Link
              href="/about"
              className="w-full sm:w-auto text-center px-8 py-3.5 rounded-xl border border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300"
            >
              বিস্তারিত জানুন
            </Link>
          </div>
        </motion.div>

        {/* RIGHT CAROUSEL (Only Scroll Parallax) */}
        <motion.div 
          style={{ y: yScroll }} 
          className="relative w-full"
        >
          {/* Outer glow for image container */}
          <div className="absolute inset-0 bg-gradient-to-tr from-green-400 to-green-600 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
          
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/5 backdrop-blur-lg">
            {loading || galleryImages.length === 0 ? (
              <div className="relative w-full aspect-[4/3] bg-black/20">
                <Image
                  src="/jewel.jpg"
                  alt="Jewel"
                  fill
                  className="object-contain hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            ) : (
              <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop
                speed={800}
                className="w-full custom-swiper"
              >
                {galleryImages.map((image, i) => (
                  <SwiperSlide key={i} className="!w-full">
                    <div className="relative w-full aspect-[4/3] bg-black/40 overflow-hidden group">
                      <Image
                        src={image.image_url}
                        alt={image.title || "Gallery"}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-1000 ease-out"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={i === 0}
                      />
                      {/* Gradient overlay for text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {image.title && (
                        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <p className="text-white text-base md:text-lg font-medium drop-shadow-lg text-center">
                            {image.title}
                          </p>
                        </div>
                      )}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </div>
        </motion.div>
      </div>

      {/* Global CSS for Complex Animations */}
      <style jsx global>{`
        /* Swiper Customizations */
        .custom-swiper .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.4);
          transition: all 0.4s ease;
          width: 8px;
          height: 8px;
        }
        .custom-swiper .swiper-pagination-bullet-active {
          background: #4ade80; /* Tailwind green-400 */
          width: 28px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(74, 222, 128, 0.5);
        }

        /* Light Beam Sweep Effect */
        .light-beam {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.02) 40%,
            rgba(255, 255, 255, 0.08) 50%,
            rgba(255, 255, 255, 0.02) 60%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(35deg);
          animation: sweep 10s infinite linear;
        }
        @keyframes sweep {
          0% { transform: rotate(35deg) translateX(-100%); }
          100% { transform: rotate(35deg) translateX(100%); }
        }

        /* Subtle BD Flag Wave Gradient */
        .bd-wave-badge {
          background: linear-gradient(
            120deg, 
            rgba(0, 106, 78, 0.7) 0%, /* Flag Green */
            rgba(244, 42, 65, 0.8) 50%, /* Flag Red */
            rgba(0, 106, 78, 0.7) 100%
          );
          background-size: 200% 200%;
          animation: bdWave 4s infinite ease-in-out;
        }
        @keyframes bdWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Drift Particle Animation (Vertical + Horizontal) */
        @keyframes drift {
          0%, 100% {
            transform: translate(0px, 0px) scale(1);
            opacity: 0.1;
          }
          33% {
            transform: translate(var(--tx), calc(var(--ty) / 2)) scale(1.5);
            opacity: 0.8;
          }
          66% {
            transform: translate(calc(var(--tx) / -2), var(--ty)) scale(0.6);
            opacity: 0.3;
          }
        }
      `}</style>
    </section>
  );
}