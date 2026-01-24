"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // লগইন সফল
    router.push("/admin/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      {/* বাংলাদেশের মানচিত্র আকৃতির কন্টেইনার */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-green-700">
        
        {/* পতাকা-থিমযুক্ত হেডার */}
        <div className="bg-gradient-to-r from-green-600 to-red-600 py-6 relative">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-green-600 rounded-full"></div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white text-center mb-2">
            খালেদ সাইফুল্লাহ জুয়েল
          </h1>
          <p className="text-white/90 text-center text-lg font-medium">
            প্রশাসনিক প্যানেল
          </p>
        </div>

        {/* মূল কন্টেন্ট */}
        <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12">
          {/* বাম পাশ - পরিচিতি */}
          <div className="space-y-6">
            <div className="relative h-48 w-full rounded-2xl overflow-hidden border-2 border-green-800">
              {/* ইমেজ প্লেসহোল্ডার - বাস্তবে আপনার ইমেজ ব্যবহার করুন */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center">
                <div className="text-white text-center p-4">
                  <div className="text-5xl mb-2">🏛️</div>
                  <p className="text-lg font-semibold">জনসেবায় নিবেদিত</p>
                </div>
              </div>
              
              {/* বাংলাদেশের মানচিত্র ডিজাইন */}
              <div className="absolute bottom-4 right-4">
                <div className="w-24 h-16 border-2 border-red-500 relative">
                  <div className="absolute top-2 left-4 w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="absolute top-6 left-8 w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="absolute bottom-4 left-12 w-2 h-2 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-l-4 border-green-700">
              <h2 className="text-xl font-bold text-green-900 mb-3">
                স্বাগতম
              </h2>
              <ul className="space-y-2 text-green-800">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  নিরাপদ প্রশাসনিক প্রবেশ
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  গোপনীয়তা নিশ্চিতকৃত
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  শুধুমাই অনুমোদিত কর্মকর্তাগণ
                </li>
              </ul>
            </div>

            {/* রাজনৈতিক প্রতীক */}
            <div className="flex justify-center space-x-6 pt-4">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white text-xl">
                🌸
              </div>
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-xl">
                📜
              </div>
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white text-xl">
                🕊️
              </div>
            </div>
          </div>

          {/* ডান পাশ - লগইন ফর্ম */}
          <div className="bg-gradient-to-b from-white to-green-50 p-8 rounded-3xl border-2 border-green-200 shadow-lg">
            <div className="text-center mb-8">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full flex items-center justify-center text-white text-2xl">
                  🔐
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                প্রশাসক লগইন
              </h2>
              <p className="text-gray-600 mt-2">
                আপনার অ্যাকাউন্টে প্রবেশ করুন
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                <p className="text-red-700 flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center gap-2">
                    <span className="text-green-600">✉️</span>
                    ইমেইল ঠিকানা
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border-2 border-green-200 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="admin@email.gov.bd"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600">
                    📧
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <span className="flex items-center gap-2">
                    <span className="text-green-600">🔒</span>
                    পাসওয়ার্ড
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border-2 border-green-200 rounded-xl px-4 py-3 pl-12 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    placeholder="••••••••"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600">
                    🛡️
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-700 to-emerald-600 text-white py-3.5 rounded-xl font-semibold text-lg hover:from-green-800 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-3 shadow-lg"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    লগইন হচ্ছে...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    প্রবেশ করুন
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-green-200">
              <div className="text-center">
                <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
                  <span className="text-green-600">⚠️</span>
                  শুধুমাত্র অনুমোদিত প্রশাসনিক কর্মকর্তাদের জন্য
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  "সৎ ও যোগ্য নেতৃত্বের প্রতিশ্রুতি"
                </p>
                <div className="flex items-center justify-center mt-4 space-x-4">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ফুটার */}
        <div className="bg-gradient-to-r from-green-800 to-emerald-900 py-4 px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-white/90">
            <div className="flex items-center gap-2 mb-2 md:mb-0">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm">খালেদ সাইফুল্লাহ জুয়েল</span>
            </div>
            <div className="text-xs text-center md:text-right">
              <p>© {new Date().getFullYear()} জনসেবা ও উন্নয়ন প্রশাসন</p>
              <p className="text-white/70">সুরক্ষিত প্রযুক্তি ব্যবস্থা</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}