"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminLayoutProps {
  children: ReactNode;
  user: any;
  onLogout: () => void;
}

export default function AdminLayoutWithoutSidebar({ children, user, onLogout }: AdminLayoutProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/admin/dashboard", label: "ড্যাশবোর্ড", icon: "📊" },
    { path: "/admin/users", label: "ব্যবহারকারী", icon: "👥" },
    { path: "/admin/posts", label: "পোস্ট", icon: "📝" },
    { path: "/admin/media", label: "মিডিয়া", icon: "🖼️" },
    { path: "/admin/settings", label: "সেটিংস", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* ড্রপডাউন মেনু ওভারলে */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* ড্রপডাউন মেনু (সব ডিভাইসের জন্য) */}
      {isMenuOpen && (
        <div className="fixed top-16 right-4 w-64 bg-white rounded-xl shadow-2xl z-50 border border-gray-200">
          {/* লোগো এবং ইউজার ইনফো */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-sm">সুপার এডমিন</h3>
                <p className="text-gray-600 text-xs truncate max-w-[180px]">
                  {user?.email || "প্রশাসক"}
                </p>
              </div>
            </div>
          </div>

          {/* নেভিগেশন মেনু আইটেম */}
          <nav className="p-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  pathname === item.path
                    ? "bg-green-50 text-green-700"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* লগআউট বাটন */}
          <div className="p-4 border-t">
            <button
              onClick={() => {
                setIsMenuOpen(false);
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 py-3 px-4 rounded-lg transition-colors border border-red-200"
            >
              <span>🚪</span>
              <span className="font-medium">লগআউট</span>
            </button>
          </div>
        </div>
      )}

      {/* টপবার */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* বাম পাশ */}
            <div className="flex items-center gap-4">
              {/* হ্যামবার্গার মেনু বাটন - সব ডিভাইসে দেখা যাবে */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="text-2xl">☰</span>
              </button>
              
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {navItems.find(item => item.path === pathname)?.label || "ড্যাশবোর্ড"}
                </h2>
                <p className="text-gray-600 text-sm">
                  {new Date().toLocaleDateString('bn-BD', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            
            {/* ডান পাশ */}
            <div className="flex items-center gap-4">
              {/* নোটিফিকেশন বাটন */}
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <span className="text-xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* অনলাইন স্ট্যাটাস - শুধু ডেস্কটপে */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">অনলাইন</span>
              </div>
              
              {/* ডেস্কটপে ব্যবহারকারী তথ্য - মোবাইলে দেখা যাবে না */}
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800 truncate max-w-[150px]">
                    {user?.email || "প্রশাসক"}
                  </p>
                  <p className="text-xs text-gray-500">সুপার এডমিন</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white">
                  {user?.email?.charAt(0).toUpperCase() || "A"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ডেস্কটপ নেভিগেশন বার (ট্যাব এবং ডেস্কটপে) */}
        <div className="hidden md:block border-t">
          <div className="px-6 py-2">
            <nav className="flex items-center gap-1 overflow-x-auto">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    pathname === item.path
                      ? "bg-green-100 text-green-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* পেজ কন্টেন্ট */}
      <main className="p-4 md:p-6">{children}</main>

      
    </div>
  );
}