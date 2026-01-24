"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // মেনু আইটেমগুলো এখানে ডিফাইন করা হয়েছে
  const menuItems = [
    { name: "ড্যাশবোর্ড", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "কর্মী ব্যবস্থাপনা", href: "/admin/workers", icon: Users },
    { name: "ইভেন্ট ও সভা", href: "/admin/events", icon: Calendar },
    { name: "জনগণের মেসেজ", href: "/admin/messages", icon: MessageSquare },
    { name: "সেটিংস", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* মোবাইল মেনু বাটন */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-slate-900 text-white rounded-md shadow-md"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - বামদিকের মেনু */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* লোগো বা নাম */}
          <div className="mb-10">
            <h1 className="text-xl font-bold text-blue-400 tracking-wider">
              অ্যাডমিন প্যানেল
            </h1>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">
              রাজনীতিবিদ ড্যাশবোর্ড
            </p>
          </div>

          {/* নেভিগেশন লিঙ্ক */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "text-slate-400 hover:bg-slate-900 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* লগআউট বাটন */}
          <div className="mt-auto pt-6 border-t border-slate-800">
            <button
              onClick={() => {/* সুপাবেস সাইন আউট ফাংশন এখানে হবে */}}
              className="flex items-center gap-3 px-4 py-3 w-full text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium text-lg">লগআউট</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area - ডানদিকের অংশ */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="p-4 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* মোবাইল স্ক্রিনে সাইডবার খোলা থাকলে ব্যাকগ্রাউন্ড আবছা করার জন্য */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}