"use client";

import { useEffect, useState } from "react";
import { Users, Calendar, MessageSquare, Megaphone, LogOut } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-8 border-b border-slate-700 pb-4">
          অ্যাডমিন প্যানেল
        </h2>
        <nav className="space-y-4">
          <a href="#" className="flex items-center gap-3 text-blue-400 font-medium">
            <Users size={20} /> ড্যাশবোর্ড
          </a>
          <a href="#" className="flex items-center gap-3 hover:text-blue-300 transition">
            <Megaphone size={20} /> প্রচার-প্রচারণা
          </a>
          <a href="#" className="flex items-center gap-3 hover:text-blue-300 transition">
            <Calendar size={20} /> ইভেন্ট লিস্ট
          </a>
          <a href="#" className="flex items-center gap-3 hover:text-blue-300 transition">
            <MessageSquare size={20} /> জনগণের মতামত
          </a>
        </nav>
        <div className="mt-20 border-t border-slate-700 pt-4">
           <button className="flex items-center gap-3 text-red-400 hover:text-red-300">
             <LogOut size={20} /> লগআউট
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">স্বাগতম, জননেতা!</h1>
            <p className="text-gray-500">আপনার আজকের রাজনৈতিক কার্যক্রমের সারসংক্ষেপ এখানে দেখুন।</p>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="মোট কর্মী" count="১,২৫০ জন" icon={<Users className="text-blue-500" />} />
          <StatCard title="আসন্ন ইভেন্ট" count="৫টি" icon={<Calendar className="text-orange-500" />} />
          <StatCard title="নতুন বার্তা" count="১৮টি" icon={<MessageSquare className="text-green-500" />} />
          <StatCard title="মোট এলাকা" count="১২টি" icon={<Megaphone className="text-purple-500" />} />
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">সাম্প্রতিক কার্যক্রম</h2>
          <ul className="space-y-4">
            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>বাঘারপাড়া বাজারে জনসভা</span>
              <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded-full">আগামীকাল</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>গরীবদের মাঝে শীতবস্ত্র বিতরণ</span>
              <span className="text-sm font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full">সম্পন্ন</span>
            </li>
            <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span>উপজেলা কমিটির মাসিক মিটিং</span>
              <span className="text-sm font-medium bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">স্থগিত</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}

// Small Component for Stats
function StatCard({ title, count, icon }: { title: string; count: string; icon: any }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{count}</p>
      </div>
      <div className="bg-gray-50 p-3 rounded-lg">{icon}</div>
    </div>
  );
}