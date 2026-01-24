'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Vote, Users, Heart, Brain } from 'lucide-react';
import Link from 'next/link';

export default function AllActivitiesPage() {
  const router = useRouter();

  const activityTypes = [
    {
      id: 'political',
      title: 'রাজনৈতিক কার্যক্রম',
      description: 'রাজনৈতিক সংস্কার, নেতৃত্ব উন্নয়ন ও নীতি প্রণয়ন',
      icon: Vote,
      color: 'bg-red-500',
      count: 24,
    },
    {
      id: 'social',
      title: 'সামাজিক কার্যক্রম',
      description: 'সমাজ সেবা, শিক্ষা ও স্বাস্থ্য বিষয়ক কার্যক্রম',
      icon: Users,
      color: 'bg-blue-500',
      count: 18,
    },
    {
      id: 'humanitarian',
      title: 'মানবিক কার্যক্রম',
      description: 'দুর্যোগ ব্যবস্থাপনা ও মানবিক সাহায্য',
      icon: Heart,
      color: 'bg-green-500',
      count: 15,
    },
    {
      id: 'creative',
      title: 'সৃজনশীল কার্যক্রম',
      description: 'সাংস্কৃতিক ও সৃজনশীল কার্যক্রম',
      icon: Brain,
      color: 'bg-purple-500',
      count: 12,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <Link 
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                ড্যাশবোর্ডে ফিরে যান
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">সকল কার্যক্রম ব্যবস্থাপনা</h1>
              <p className="text-gray-600 mt-2">বিভিন্ন ধরনের কার্যক্রমের ব্যবস্থাপনা প্যানেল</p>
            </div>
          </div>
        </div>

        {/* Activity Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {activityTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div 
                key={type.id}
                onClick={() => router.push(`/admin/activities/${type.id}`)}
                className="cursor-pointer bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${type.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">{type.count}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-blue-600 font-medium text-sm group-hover:text-blue-700">
                    ম্যানেজ করুন →
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">কার্যক্রম সারাংশ</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">৬৯</div>
              <div className="text-gray-600">মোট কার্যক্রম</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">২,৫০০+</div>
              <div className="text-gray-600">সর্বমোট অংশগ্রহণ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">১৫</div>
              <div className="text-gray-600">চলমান প্রকল্প</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">৮</div>
              <div className="text-gray-600">আসন্ন ইভেন্ট</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}