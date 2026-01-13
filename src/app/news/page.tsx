export default function NewsPage() {
  const newsCategories = [
    {
      title: "নির্বাচন",
      description: "বিভিন্ন নির্বাচন সম্পর্কিত সংবাদ ও কার্যক্রম",
      link: "/news/election"
    },
    {
      title: "ইভেন্ট",
      description: "আমার অংশগ্রহণকৃত বিভিন্ন ইভেন্ট ও অনুষ্ঠান",
      link: "/news/events"
    },
    {
      title: "স্টেটমেন্ট",
      description: "বিভিন্ন বিষয়ে আমার ব্যক্তিগত বক্তব্য ও বিবৃতি",
      link: "/news/statements"
    },
    {
      title: "সাক্ষাৎকার",
      description: "বিভিন্ন মিডিয়ায় প্রদত্ত সাক্ষাৎকারসমূহ",
      link: "/news/interviews"
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            সংবাদ
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            আমার কার্যক্রম, বক্তব্য ও বিভিন্ন ইভেন্ট সম্পর্কিত সর্বশেষ সংবাদ
          </p>
        </div>

        {/* News Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {newsCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">{category.title}</h2>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <a 
                  href={category.link}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300"
                >
                  দেখুন
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Latest News */}
        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">সর্বশেষ সংবাদ</h2>
          <p className="text-gray-600 text-center py-8">
            শীঘ্রই সর্বশেষ সংবাদ যুক্ত করা হবে
          </p>
        </div>
      </div>
    </div>
  );
}