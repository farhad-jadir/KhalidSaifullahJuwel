export default function EventsPage() {
  const eventCategories = [
    {
      id: "political",
      name: "রাজনৈতিক ইভেন্ট",
      events: [
        {
          id: 1,
          title: "জাতীয় নির্বাচনী সম্মেলন ২০২৪",
          date: "৩০ মে, ২০২৪",
          location: "নরসিংদী স্টেডিয়াম",
          description: "আসন্ন জাতীয় নির্বাচনকে সামনে রেখে বিশাল সমাবেশ ও জনসভা। হাজার হাজার সমর্থকের উপস্থিতিতে সফল অনুষ্ঠান।",
          images: 25,
          category: "রাজনৈতিক",
          featured: true
        },
        {
          id: 2,
          title: "স্থানীয় সরকার নির্বাচন প্রচারণা",
          date: "২৫ ফেব্রুয়ারি, ২০২৪",
          location: "বেলাবো উপজেলা",
          description: "স্থানীয় সরকার নির্বাচনের জন্য ব্যাপক প্রচারণা কার্যক্রম। প্রতিটি ওয়ার্ডে সরাসরি জনসংযোগ।",
          images: 18,
          category: "রাজনৈতিক"
        },
        {
          id: 3,
          title: "যুব নেতৃত্ব সম্মেলন",
          date: "১৫ মার্চ, ২০২৪",
          location: "স্থানীয় কলেজ অডিটোরিয়াম",
          description: "তরুণ নেতৃত্ব বিকাশে বিশেষ সম্মেলন। ৫০০+ তরুণ নেতার অংশগ্রহণে সফল আয়োজন।",
          images: 12,
          category: "রাজনৈতিক"
        }
      ]
    },
    {
      id: "social",
      name: "সামাজিক ইভেন্ট",
      events: [
        {
          id: 4,
          title: "ঈদ উৎসব ও গরিবদের মধ্যে উপহার বিতরণ",
          date: "১০ এপ্রিল, ২০২৪",
          location: "বিভিন্ন এলাকা",
          description: "ঈদের আনন্দ ছড়িয়ে দিতে দরিদ্র ও সুবিধাবঞ্চিত পরিবারগুলোর মধ্যে বিশেষ উপহার বিতরণ কার্যক্রম।",
          images: 32,
          category: "সামাজিক",
          featured: true
        },
        {
          id: 5,
          title: "শীতবস্ত্র বিতরণ কর্মসূচি",
          date: "১৫ ডিসেম্বর, ২০২৩",
          location: "নরসিংদী সদর",
          description: "শীতকালে গরিব মানুষের মধ্যে গরম কাপড়, কম্বল ও শীতবস্ত্র বিতরণের বিশেষ আয়োজন।",
          images: 20,
          category: "সামাজিক"
        },
        {
          id: 6,
          title: "বন্যার্তদের ত্রাণ বিতরণ",
          date: "২০ জুলাই, ২০২৩",
          location: "বন্যাকবলিত এলাকা",
          description: "বন্যাদুর্গত মানুষের মধ্যে জরুরি ত্রাণ সহায়তা ও পুনর্বাসন কার্যক্রম।",
          images: 15,
          category: "সামাজিক"
        }
      ]
    },
    {
      id: "development",
      name: "উন্নয়নমূলক ইভেন্ট",
      events: [
        {
          id: 7,
          title: "স্কুল ভবন উদ্বোধন",
          date: "৫ জানুয়ারি, ২০২৪",
          location: "স্থানীয় প্রাথমিক বিদ্যালয়",
          description: "নতুন স্কুল ভবন উদ্বোধন ও শিক্ষা উপকরণ বিতরণ অনুষ্ঠান। শতাধিক শিক্ষার্থী উপকৃত।",
          images: 22,
          category: "উন্নয়ন",
          featured: true
        },
        {
          id: 8,
          title: "স্বাস্থ্য ক্যাম্প উদ্বোধন",
          date: "১০ মার্চ, ২০২৪",
          location: "স্থানীয় স্বাস্থ্য কমপ্লেক্স",
          description: "বিনামূল্যে স্বাস্থ্য সেবা প্রদানের জন্য বিশেষ স্বাস্থ্য ক্যাম্পের উদ্বোধনী অনুষ্ঠান।",
          images: 16,
          category: "উন্নয়ন"
        },
        {
          id: 9,
          title: "রাস্তা নির্মাণ কাজের উদ্বোধন",
          date: "২৮ ফেব্রুয়ারি, ২০২৪",
          location: "গ্রামীণ সড়ক",
          description: "গ্রামীণ যোগাযোগ ব্যবস্থার উন্নয়নের জন্য নতুন সড়ক নির্মাণ কাজের শুভ সূচনা।",
          images: 14,
          category: "উন্নয়ন"
        }
      ]
    },
    {
      id: "cultural",
      name: "সাংস্কৃতিক ইভেন্ট",
      events: [
        {
          id: 10,
          title: "বাংলা নববর্ষ উৎসব",
          date: "১৪ এপ্রিল, ২০২৪",
          location: "স্থানীয় মাঠ",
          description: "বাংলা নববর্ষ ১৪৩১ উদযাপনে রংবেরঙের সাংস্কৃতিক অনুষ্ঠান ও মেলার আয়োজন।",
          images: 28,
          category: "সাংস্কৃতিক",
          featured: true
        },
        {
          id: 11,
          title: "জাতীয় দিবস উদযাপন",
          date: "২৬ মার্চ, ২০২৪",
          location: "স্বাধীনতা চত্বর",
          description: "স্বাধীনতা দিবসের শপথ গ্রহণ ও সাংস্কৃতিক অনুষ্ঠানের মাধ্যমে মহান স্বাধীনতা দিবস উদযাপন।",
          images: 19,
          category: "সাংস্কৃতিক"
        },
        {
          id: 12,
          title: "বই মেলা ও সাহিত্য সন্ধ্যা",
          date: "২১ ফেব্রুয়ারি, ২০২৪",
          location: "স্থানীয় লাইব্রেরি",
          description: "আন্তর্জাতিক মাতৃভাষা দিবস উপলক্ষে বই মেলা ও সাহিত্য সন্ধ্যার আয়োজন।",
          images: 13,
          category: "সাংস্কৃতিক"
        }
      ]
    }
  ];

  const upcomingEvents = [
    {
      id: 13,
      title: "যুব উদ্যোক্তা সম্মেলন",
      date: "১৫ জুন, ২০২৪",
      time: "সকাল ১০:০০",
      location: "যুব উন্নয়ন কেন্দ্র",
      description: "তরুণ উদ্যোক্তাদের জন্য বিশেষ সম্মেলন ও নেটওয়ার্কিং ইভেন্ট",
      category: "যুব উন্নয়ন"
    },
    {
      id: 14,
      title: "পরিবেশ দিবস র্যালি",
      date: "৫ জুন, ২০২৪",
      time: "বিকাল ৪:০০",
      location: "নগর ভবন",
      description: "পরিবেশ সুরক্ষার বার্তা নিয়ে বিশাল র্যালি ও সচেতনতা কর্মসূচি",
      category: "পরিবেশ"
    },
    {
      id: 15,
      title: "মহিলা দক্ষতা প্রশিক্ষণ",
      date: "২৫ মে, ২০২৪",
      time: "সকাল ৯:০০",
      location: "মহিলা কমপ্লেক্স",
      description: "মহিলাদের আত্মকর্মসংস্থানের জন্য বিশেষ দক্ষতা উন্নয়ন প্রশিক্ষণ",
      category: "মহিলা উন্নয়ন"
    }
  ];

  const featuredEvents = eventCategories.flatMap(category => 
    category.events.filter(event => event.featured)
  );

  return (
    <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            ইভেন্টস
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            রাজনৈতিক, সামাজিক, উন্নয়নমূলক ও সাংস্কৃতিক বিভিন্ন ইভেন্টের ফটো গ্যালারি ও বিবরণ
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {eventCategories.map(category => (
              <a 
                key={category.id}
                href={`#${category.id}`}
                className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium hover:bg-indigo-200 transition-colors duration-300"
              >
                {category.name}
              </a>
            ))}
          </div>
        </div>

        {/* Featured Events Carousel */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">বিশেষ ইভেন্টসমূহ</h2>
            <div className="flex gap-2">
              <button className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors">
                ←
              </button>
              <button className="p-2 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors">
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.slice(0, 3).map(event => (
              <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 bg-gradient-to-r from-indigo-400 to-purple-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white text-center p-4">
                      <div className="text-4xl mb-2">📷</div>
                      <div className="text-sm opacity-90">{event.images}টি ছবি</div>
                    </div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white text-indigo-700 text-xs font-bold rounded-full shadow-sm">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span>📅 {event.date}</span>
                    <span>📍 {event.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <button className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                    ছবি দেখুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Event Categories Grid */}
        <div className="space-y-16">
          {eventCategories.map(category => (
            <div key={category.id} id={category.id} className="scroll-mt-20">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{category.name}</h2>
                <div className="flex-1 h-px bg-gradient-to-r from-indigo-500 to-transparent"></div>
                <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                  {category.events.length}টি ইভেন্ট
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.events.map(event => (
                  <div key={event.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="relative h-40">
                      <div className={`absolute inset-0 flex items-center justify-center ${
                        event.category === 'রাজনৈতিক' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                        event.category === 'সামাজিক' ? 'bg-gradient-to-r from-green-400 to-green-600' :
                        event.category === 'উন্নয়ন' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                        'bg-gradient-to-r from-purple-400 to-purple-600'
                      }`}>
                        <div className="text-white text-center">
                          <div className="text-3xl">📸</div>
                          <div className="text-sm mt-1 opacity-90">{event.images} ছবি</div>
                        </div>
                      </div>
                      {event.featured && (
                        <div className="absolute top-3 right-3">
                          <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                            ★ বিশেষ
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          event.category === 'রাজনৈতিক' ? 'bg-red-100 text-red-800' :
                          event.category === 'সামাজিক' ? 'bg-green-100 text-green-800' :
                          event.category === 'উন্নয়ন' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {event.category}
                        </span>
                        <span className="text-sm text-gray-500">{event.date}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <span>📍</span>
                          <span className="truncate max-w-[120px]">{event.location}</span>
                        </div>
                        <button className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors text-sm flex items-center gap-1">
                          বিস্তারিত
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Events */}
        <div className="mt-20 mb-16">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">আসন্ন ইভেন্টসমূহ</h2>
                <p className="text-indigo-100">ভবিষ্যতে অনুষ্ঠিতব্য ইভেন্টগুলোর তালিকা</p>
              </div>
              <button className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-lg hover:bg-gray-100 transition-colors duration-300 whitespace-nowrap">
                সব ইভেন্ট দেখুন
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <div key={event.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        event.category.includes('যুব') ? 'bg-yellow-500/20 text-yellow-200' :
                        event.category.includes('পরিবেশ') ? 'bg-green-500/20 text-green-200' :
                        'bg-pink-500/20 text-pink-200'
                      }`}>
                        {event.category}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{event.date.split(',')[0]}</div>
                      <div className="text-sm opacity-80">{event.time}</div>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3">{event.title}</h3>
                  <p className="text-indigo-100 mb-4 text-sm">{event.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm">
                      <span>📍</span>
                      <span>{event.location}</span>
                    </div>
                    <button className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors text-sm">
                      অংশগ্রহণ করুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Photo Gallery Preview */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">ফটো গ্যালারি</h2>
            <button className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors flex items-center gap-2">
              সম্পূর্ণ গ্যালারি দেখুন
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-3xl">📷</div>
                    <div className="text-xs mt-1">ইভেন্ট ছবি {item}</div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
                    <div className="text-lg font-bold mb-1">ইভেন্টের নাম</div>
                    <div className="text-sm">তারিখ: ২০২৪</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: "৫০+", label: "ইভেন্ট সম্পন্ন", color: "text-red-600" },
              { number: "৫০০০+", label: "ছবি সংগ্রহ", color: "text-green-600" },
              { number: "১ লক্ষ+", label: "উপস্থিতি", color: "text-blue-600" },
              { number: "১০+", label: "বছরের অভিজ্ঞতা", color: "text-purple-600" }
            ].map((stat, index) => (
              <div key={index} className="p-4">
                <div className={`text-3xl md:text-4xl font-bold ${stat.color} mb-2`}>{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">ইভেন্ট আপডেট পান</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-6">
              আমাদের সবচেয়ে সাম্প্রতিক ইভেন্ট ও কার্যক্রম সম্পর্কে নোটিফিকেশন পেতে সাবস্ক্রাইব করুন
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="আপনার ইমেইল ঠিকানা"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300">
              সাবস্ক্রাইব করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}