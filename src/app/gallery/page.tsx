// khalid/src/app/gallery/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Play, X, Calendar, MapPin, Eye, Youtube } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- Interfaces ---
interface GalleryCategory {
  id: number;
  name: string;
  type: string;
  icon: string | null;
}

interface GalleryPhoto {
  id: number;
  category_id: number;
  title: string;
  description: string | null;
  image_url: string;
  date: string | null;
  location: string | null;
}

interface GalleryVideo {
  id: number;
  category_id: number;
  title: string;
  youtube_id: string;
  date: string | null;
  views: string | null;
}

// --- Video Card Component (Hover to Play) ---
function VideoCard({ video, onSelect }: { video: GalleryVideo, onSelect: () => void }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-sm border cursor-pointer group transition-all hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      <div className="relative aspect-video bg-black overflow-hidden">
        {isHovered ? (
          <iframe
            className="w-full h-full pointer-events-none scale-105"
            src={`https://www.youtube.com/embed/${video.youtube_id}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          ></iframe>
        ) : (
          <>
            <img 
              src={`https://img.youtube.com/vi/${video.youtube_id}/mqdefault.jpg`} 
              alt={video.title}
              className="w-full h-full object-cover opacity-90 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-red-600 fill-current" />
              </div>
            </div>
          </>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3"/> {video.date}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3"/> {video.views}</span>
        </div>
      </div>
    </div>
  );
}

// --- Main Gallery Page ---
export default function GalleryPage() {
  const [activeTab, setActiveTab] = useState<"photos" | "videos">("photos");
  const [selectedImage, setSelectedImage] = useState<GalleryPhoto | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<GalleryVideo | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [videos, setVideos] = useState<GalleryVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const { data: catData } = await supabase.from('gallery_categories').select('*').eq('status', 'active').order('sort_order');
      const { data: photoData } = await supabase.from('gallery_photos').select('*').eq('status', 'active').order('id', { ascending: false });
      const { data: videoData } = await supabase.from('gallery_videos').select('*').eq('status', 'active').order('id', { ascending: false });

      setCategories(catData || []);
      setPhotos(photoData || []);
      setVideos(videoData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentTabCategories = categories.filter(c => c.type === (activeTab === 'photos' ? 'photo' : 'video'));

  const filteredPhotos = selectedCategory === 'all' ? photos : photos.filter(p => p.category_id === parseInt(selectedCategory));
  const filteredVideos = selectedCategory === 'all' ? videos : videos.filter(v => v.category_id === parseInt(selectedCategory));

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">গ্যালারি</h1>
          <p className="text-gray-500">আলোকচিত্র ও ভিডিও ফুটেজ</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl shadow-sm border flex">
            <button onClick={() => {setActiveTab("photos"); setSelectedCategory('all')}} className={`px-8 py-2.5 rounded-lg transition-all ${activeTab === "photos" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}>📸 ছবি</button>
            <button onClick={() => {setActiveTab("videos"); setSelectedCategory('all')}} className={`px-8 py-2.5 rounded-lg transition-all ${activeTab === "videos" ? "bg-blue-600 text-white shadow-md" : "text-gray-600 hover:bg-gray-50"}`}>🎥 ভিডিও</button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <button onClick={() => setSelectedCategory('all')} className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === 'all' ? 'bg-gray-900 text-white' : 'bg-white border text-gray-600'}`}>সবগুলো</button>
          {currentTabCategories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id.toString())} className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id.toString() ? 'bg-gray-900 text-white' : 'bg-white border text-gray-600'}`}>{cat.icon} {cat.name}</button>
          ))}
        </div>

        {/* Photo Grid */}
        {activeTab === "photos" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-fadeIn">
            {filteredPhotos.map((img) => (
              <div key={img.id} className="group cursor-pointer" onClick={() => setSelectedImage(img)}>
                <div className="aspect-square overflow-hidden rounded-2xl bg-gray-200 border">
                  <img src={img.image_url} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                </div>
                <p className="mt-2 text-sm font-semibold text-gray-700 truncate px-1">{img.title}</p>
              </div>
            ))}
          </div>
        )}

        {/* Video Grid */}
        {activeTab === "videos" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} onSelect={() => setSelectedVideo(video)} />
            ))}
          </div>
        )}

        {/* Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" onClick={() => setSelectedImage(null)}>
            <div className="max-w-4xl w-full relative" onClick={e => e.stopPropagation()}>
              <button className="absolute -top-12 right-0 text-white flex items-center gap-2" onClick={() => setSelectedImage(null)}><X /> বন্ধ করুন</button>
              <img src={selectedImage.image_url} alt={selectedImage.title} className="w-full max-h-[75vh] object-contain rounded-lg shadow-2xl" />
              <div className="mt-4 bg-white p-5 rounded-2xl">
                <h3 className="text-xl font-bold text-gray-900">{selectedImage.title}</h3>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {selectedImage.date}</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {selectedImage.location}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4" onClick={() => setSelectedVideo(null)}>
            <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}?autoplay=1`} title={selectedVideo.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
              </div>
            </div>
          </div>
        )}

      </div>
      <style jsx>{` @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; } `}</style>
    </div>
  );
}