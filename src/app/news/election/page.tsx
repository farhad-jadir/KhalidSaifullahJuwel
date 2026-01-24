//app/news/election/page.tsx
import Image from 'next/image';

export default function ElectionNewsPage() {
  const electionCategories = [
    {
      category: "জাতীয় নির্বাচন",
      news: [
        {
          title: "১২তম জাতীয় সংসদ নির্বাচন: প্রস্তুতি ও প্রত্যাশা",
          date: "১৫ মার্চ, ২০২৪",
          description: "আসন্ন জাতীয় সংসদ নির্বাচনের প্রস্তুতি নিয়ে কেন্দ্রীয় কমিটির সাথে মতবিনিময় সভা। নির্বাচনী প্রস্তুতি ও কৌশল নির্ধারণে আলোচনা চলছে।",
          location: "ঢাকা",
          type: "মতবিনিময়",
          featured: true,
          image: "/news/election-1.jpg",
          author: "রিপোর্টার: মোহাম্মদ আলী",
          views: "২,৫০০+",
          readTime: "৩ মিনিট"
        },
        {
          title: "জাতীয় নির্বাচনী ইশতেহার প্রকাশ: ৫০ পৃষ্ঠার উন্নয়ন রোডম্যাপ",
          date: "১০ মার্চ, ২০২৪",
          description: "জনগণের আশা-আকাঙ্ক্ষার প্রতিফলন ঘটিয়ে ৫০ পৃষ্ঠার পূর্ণাঙ্গ নির্বাচনী ইশতেহার প্রকাশ। শিক্ষা, স্বাস্থ্য, অর্থনীতি ও যুব উন্নয়নে বিশেষ অঙ্গীকার।",
          location: "নরসিংদী",
          type: "ইশতেহার",
          featured: true,
          image: "/news/manifesto.jpg",
          author: "রিপোর্টার: সুমাইয়া আক্তার",
          views: "৩,৮০০+",
          readTime: "৫ মিনিট"
        },
        {
          title: "জাতীয় পর্যায়ে ভোটার সচেতনতা: ডিজিটাল ও মাঠ পর্যায়ে যৌথ অভিযান",
          date: "৫ মার্চ, ২০২৪",
          description: "ভোটারদের মধ্যে সচেতনতা বৃদ্ধিতে বিশেষ কার্যক্রম। ডিজিটাল প্ল্যাটফর্ম ও মাঠ পর্যায়ে গণসচেতনতা প্রচারণা জোরদার।",
          location: "গাজীপুর",
          type: "সচেতনতা",
          featured: false,
          image: "/news/voter-awareness.jpg",
          author: "রিপোর্টার: রফিকুল ইসলাম",
          views: "১,৯০০+",
          readTime: "২ মিনিট"
        }
      ]
    },
    {
      category: "স্থানীয় সরকার নির্বাচন",
      news: [
        {
          title: "উপজেলা পরিষদ নির্বাচন: সরাসরি জনসংযোগ অভিযান",
          date: "২৫ ফেব্রুয়ারি, ২০২৪",
          description: "উপজেলা পর্যায়ের নির্বাচনী প্রচারণা কার্যক্রম শুরু। প্রতিটি ওয়ার্ডে সরাসরি জনসংযোগ ও মতবিনিময় সভা চলছে।",
          location: "বেলাবো",
          type: "প্রচারণা",
          featured: false,
          image: "/news/local-election.jpg",
          author: "স্থানীয় প্রতিনিধি",
          views: "১,২০০+",
          readTime: "৪ মিনিট"
        },
        {
          title: "ইউনিয়ন পরিষদ নির্বাচন প্রস্তুতি: নেতা-কর্মীদের বিশেষ প্রশিক্ষণ",
          date: "২০ ফেব্রুয়ারি, ২০২৪",
          description: "ইউনিয়ন পরিষদ নির্বাচনের প্রস্তুতি নিয়ে স্থানীয় নেতা-কর্মীদের সাথে কর্মশালা ও প্রশিক্ষণ সম্পন্ন।",
          location: "শিবপুর",
          type: "প্রশিক্ষণ",
          featured: false,
          image: "/news/training.jpg",
          author: "রিপোর্টার: কামরুল হাসান",
          views: "৯৫০+",
          readTime: "৩ মিনিট"
        }
      ]
    },
    {
      category: "নির্বাচনী সংস্কার",
      news: [
        {
          title: "ডিজিটাল ভোটিং সিস্টেম: স্বচ্ছ নির্বাচনের নতুন অধ্যায়",
          date: "১০ ফেব্রুয়ারি, ২০২৪",
          description: "স্বচ্ছ ও নির্ভুল ভোটিং নিশ্চিত করতে ডিজিটাল ভোটিং সিস্টেম চালুর প্রস্তাবনা ও পাইলট প্রকল্প শুরু হয়েছে।",
          location: "ঢাকা",
          type: "প্রযুক্তি",
          featured: true,
          image: "/news/digital-voting.jpg",
          author: "টেক রিপোর্টার",
          views: "৪,২০০+",
          readTime: "৬ মিনিট"
        },
        {
          title: "নির্বাচন কমিশনের সাথে বিশেষ সংলাপ: স্বচ্ছতার অঙ্গীকার",
          date: "৫ ফেব্রুয়ারি, ২০২৪",
          description: "স্বচ্ছ ও গ্রহণযোগ্য নির্বাচন নিশ্চিত করতে নির্বাচন কমিশনের সাথে সংলাপ ও মতবিনিময় সভা অনুষ্ঠিত।",
          location: "নির্বাচন কমিশন",
          type: "সংলাপ",
          featured: false,
          image: "/news/ec-meeting.jpg",
          author: "রাজনৈতিক প্রতিবেদক",
          views: "২,১০০+",
          readTime: "৩ মিনিট"
        }
      ]
    }
  ];

  const featuredNews = [
    {
      title: "খালেদ সাইফুল্লাহ জুয়েলের নির্বাচনী রোডম্যাপ: পরিবর্তনের অঙ্গীকার",
      date: "২৮ মার্চ, ২০২৪",
      summary: "২০২৪ সালের নির্বাচনে খালেদ সাইফুল্লাহ জুয়েলের ১০ দফা নির্বাচনী অঙ্গীকার ও উন্নয়ন পরিকল্পনা নিয়ে বিশেষ প্রতিবেদন।",
      image: "/news/featured-1.jpg",
      category: "বিশেষ প্রতিবেদন",
      readTime: "৮ মিনিট",
      featured: true
    },
    {
      title: "যুব ভোটারদের অংশগ্রহণ: রেকর্ড সংখ্যক নিবন্ধন",
      date: "২৫ মার্চ, ২০২৪",
      summary: "নির্বাচনী বছরকে সামনে রেখে যুব ভোটার নিবন্ধনে রেকর্ড সংখ্যক তরুণ ভোটার নিবন্ধিত হয়েছে।",
      image: "/news/featured-2.jpg",
      category: "ভোটার পরিসংখ্যান",
      readTime: "৪ মিনিট",
      featured: true
    }
  ];

  const upcomingElectionEvents = [
    {
      event: "জাতীয় নির্বাচনী সম্মেলন",
      date: "৩০ মে, ২০২৪",
      time: "সকাল ১০:০০",
      location: "নরসিংদী স্টেডিয়াম",
      description: "আসন্ন জাতীয় নির্বাচন নিয়ে বিশাল সমাবেশ ও জনসভা",
      image: "/events/rally.jpg"
    },
    {
      event: "যুব ভোটার সংলাপ",
      date: "৫ জুন, ২০২৪",
      time: "বিকাল ৪:০০",
      location: "স্থানীয় কলেজ অডিটোরিয়াম",
      description: "তরুণ ভোটারদের সাথে সরাসরি সংলাপ ও মতবিনিময়",
      image: "/events/youth-dialogue.jpg"
    }
  ];

  const newspaperColumns = [
    {
      title: "প্রধান সম্পাদকীয়",
      content: "২০২৪ সালের নির্বাচন বাংলাদেশের রাজনীতিতে একটি গুরুত্বপূর্ণ মাইলফলক। এ নির্বাচন শুধু সরকার পরিবর্তনেরই নয়, বরং রাজনৈতিক সংস্কার ও সুশাসন প্রতিষ্ঠারও নির্বাচন। আমাদের দায়িত্ব সচেতন ভোটার হিসেবে সঠিক সিদ্ধান্ত নেওয়া।",
      author: "প্রধান সম্পাদক",
      date: "১ এপ্রিল, ২০২৪"
    },
    {
      title: "রাজনৈতিক বিশ্লেষণ",
      content: "বর্তমান নির্বাচনী প্রেক্ষাপটে বিভিন্ন দলের অবস্থান ও ভবিষ্যৎ কৌশল নিয়ে বিশেষ বিশ্লেষণ। বিশেষজ্ঞদের মতামত ও ভোটারদের মনোভাব নিয়ে বিস্তারিত আলোচনা।",
      author: "রাজনৈতিক বিশ্লেষক",
      date: "২৮ মার্চ, ২০২৪"
    }
  ];

  const photoGallery = [
    { src: "/gallery/election-1.jpg", caption: "জনসভায় উপস্থিত ভোটারদের উদ্দেশ্যে বক্তব্য", date: "১৫ মার্চ" },
    { src: "/gallery/election-2.jpg", caption: "নির্বাচনী ইশতেহার প্রকাশ অনুষ্ঠান", date: "১০ মার্চ" },
    { src: "/gallery/election-3.jpg", caption: "যুব ভোটারদের সাথে সংলাপ", date: "৫ মার্চ" },
    { src: "/gallery/election-4.jpg", caption: "স্থানীয় নেতাদের প্রশিক্ষণ", date: "২০ ফেব্রুয়ারি" }
  ];

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Newspaper Header */}
        <div className="mb-8 text-center border-b-4 border-red-600 pb-6">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <div className="text-left">
              <div className="text-sm text-gray-500">বৃহস্পতিবার, ৪ এপ্রিল ২০২৪</div>
              <div className="text-sm text-gray-500">২১ চৈত্র ১৪৩০</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-serif my-4">
              নির্বাচন সংবাদ
            </h1>
            <div className="text-right">
              <div className="text-sm text-gray-500">প্রথম সংস্করণ</div>
              <div className="text-sm text-gray-500">মূল্য: ২০ টাকা</div>
            </div>
          </div>
          <div className="text-xl text-gray-700 max-w-3xl mx-auto">
            বাংলাদেশের নির্বাচনী রাজনীতি, প্রার্থীদের কার্যক্রম ও ভোটারদের জন্য বিশেষ প্রতিবেদন
          </div>
        </div>

        {/* Featured News Section - Newspaper Style */}
        <div className="mb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {featuredNews[0] && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300">
                <div className="relative h-64 md:h-80">
                  {/* Featured Image */}
                  <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <div className="text-gray-500">ফিচার ছবি: {featuredNews[0].title}</div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded">
                      বিশেষ প্রতিবেদন
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-600 font-bold">✪</span>
                    <span className="text-sm text-gray-500">{featuredNews[0].date}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{featuredNews[0].readTime} পড়ার সময়</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 font-serif">
                    {featuredNews[0].title}
                  </h2>
                  <p className="text-gray-700 mb-4 text-lg leading-relaxed">
                    {featuredNews[0].summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <button className="text-red-700 font-bold hover:text-red-800 transition-colors">
                      সম্পূর্ণ প্রতিবেদন পড়ুন →
                    </button>
                    <div className="text-sm text-gray-500">
                      <span className="mr-4">👁️ ৪,৫০০+</span>
                      <span>💬 ১২৩</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Side Column - Second Featured News */}
          <div>
            {featuredNews[1] && (
              <div className="bg-white rounded-lg shadow-md border border-gray-300 h-full">
                <div className="relative h-40">
                  <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                    <div className="text-gray-500">ছবি: {featuredNews[1].title}</div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                      পরিসংখ্যান
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-500">{featuredNews[1].date}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{featuredNews[1].readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">
                    {featuredNews[1].title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {featuredNews[1].summary}
                  </p>
                  <button className="text-blue-700 font-semibold hover:text-blue-800 transition-colors text-sm">
                    বিস্তারিত →
                  </button>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-300 p-4">
              <h3 className="font-bold text-gray-900 mb-3 border-b pb-2">দ্রুত পরিসংখ্যান</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">নতুন ভোটার</span>
                  <span className="font-bold">২৫,০০০+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">জনসভা</span>
                  <span className="font-bold">৫০+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">মিডিয়া কভারেজ</span>
                  <span className="font-bold">১০০+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* News Categories - Newspaper Columns */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6 border-b-2 border-gray-300 pb-2">
            <h2 className="text-2xl font-bold text-gray-900 font-serif">সর্বশেষ সংবাদ</h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Main News Column */}
            <div>
              {electionCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 bg-red-50 px-4 py-2 rounded-lg">
                      {category.category}
                    </h3>
                    <div className="flex-1 h-px bg-gray-300"></div>
                  </div>

                  <div className="space-y-6">
                    {category.news.map((news, newsIndex) => (
                      <div key={newsIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                        <div className="p-4">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="md:w-1/3">
                              <div className="relative h-40 md:h-32 rounded overflow-hidden bg-gray-200">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-gray-500 text-sm">ছবি: {news.title.substring(0, 20)}...</div>
                                </div>
                                {news.featured && (
                                  <div className="absolute top-2 left-2">
                                    <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                                      বিশেষ
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="md:w-2/3">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs text-gray-500">{news.date}</span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                  {news.type}
                                </span>
                              </div>
                              <h4 className="text-lg font-bold text-gray-900 mb-2 font-serif">
                                {news.title}
                              </h4>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                {news.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="text-xs text-gray-500">
                                  <span className="mr-3">✍️ {news.author}</span>
                                  <span>👁️ {news.views}</span>
                                </div>
                                <button className="text-red-700 font-semibold hover:text-red-800 transition-colors text-sm">
                                  পড়ুন →
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Side Column - Newspaper Style */}
            <div className="space-y-8">
              {/* Editorial Column */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
                <div className="border-l-4 border-red-600 pl-4 mb-4">
                  <h3 className="text-xl font-bold text-gray-900 font-serif">সম্পাদকীয়</h3>
                </div>
                {newspaperColumns.map((column, index) => (
                  <div key={index} className="mb-6 last:mb-0">
                    <h4 className="font-bold text-gray-900 mb-2">{column.title}</h4>
                    <p className="text-gray-700 mb-3 leading-relaxed text-justify">
                      {column.content}
                    </p>
                    <div className="text-right text-sm text-gray-500">
                      - {column.author}, {column.date}
                    </div>
                    {index < newspaperColumns.length - 1 && (
                      <div className="my-4 h-px bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Photo Gallery */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 font-serif">ছবি গ্যালারি</h3>
                  <button className="text-red-700 text-sm font-semibold hover:text-red-800">
                    সব ছবি দেখুন →
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {photoGallery.map((photo, index) => (
                    <div key={index} className="relative rounded overflow-hidden group cursor-pointer">
                      <div className="aspect-square bg-gray-200 flex items-center justify-center">
                        <div className="text-gray-500 text-xs text-center px-2">
                          ছবি: {photo.caption.substring(0, 15)}...
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                        <div className="p-2 text-white text-xs">
                          <div>{photo.caption}</div>
                          <div className="text-gray-300">{photo.date}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6">
                <h3 className="text-xl font-bold text-gray-900 font-serif mb-4">আসন্ন অনুষ্ঠান</h3>
                <div className="space-y-4">
                  {upcomingElectionEvents.map((event, index) => (
                    <div key={index} className="border-l-2 border-blue-500 pl-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-600 font-bold">📅</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-1">{event.event}</h4>
                          <p className="text-gray-600 text-sm mb-2">{event.description}</p>
                          <div className="text-xs text-gray-500 space-y-1">
                            <div>📌 {event.location}</div>
                            <div>⏰ {event.date}, {event.time}</div>
                          </div>
                        </div>
                      </div>
                      {index < upcomingElectionEvents.length - 1 && (
                        <div className="my-4 h-px bg-gray-200"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newspaper Footer */}
        <div className="mt-12 pt-8 border-t-4 border-red-600">
          <div className="text-center text-gray-600 text-sm">
            <p>প্রকাশক: নির্বাচন সংবাদ ডেস্ক | সম্পাদক: রাজনৈতিক সম্পাদক</p>
            <p className="mt-2">ঠিকানা: নরসিংদী, ঢাকা | ইমেইল: election@khaledjewel.com | ফোন: ০১৭XX-XXXXXX</p>
            <p className="mt-2">© ২০২৪ নির্বাচন সংবাদ | সকল অধিকার সংরক্ষিত</p>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <a 
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-red-600 text-red-700 font-semibold rounded-lg hover:bg-red-50 transition-all duration-300 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            সংবাদ পেইজে ফিরে যান
          </a>
        </div>
      </div>
    </div>
  );
}