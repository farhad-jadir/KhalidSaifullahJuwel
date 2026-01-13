export default function PoliticalActivitiesPage() {
  const activities = [
    {
      title: "জনসভা ও মতবিনিময়",
      description: "বিভিন্ন এলাকায় জনসভার আয়োজন করে মানুষের সমস্যা শোনা ও সমাধানের চেষ্টা করা।"
    },
    {
      title: "নেতৃত্ব প্রশিক্ষণ",
      description: "তরুণ নেতৃত্ব বিকাশে প্রশিক্ষণ কর্মশালার আয়োজন।"
    },
    {
      title: "রাজনৈতিক সংস্কার",
      description: "স্বচ্ছ ও জবাবদিহিতামূলক রাজনৈতিক সংস্কারে কাজ করা।"
    },
    {
      title: "নীতি নির্ধারণ",
      description: "জনগণের কল্যাণে নীতি নির্ধারণে ভূমিকা পালন।"
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            রাজনৈতিক কর্মকান্ড
          </h1>
          <p className="text-lg text-gray-600">
            সুশাসন ও স্বচ্ছ রাজনীতির মাধ্যমে একটি উন্নত সমাজ গঠনে আমার রাজনৈতিক কার্যক্রম
          </p>
        </div>

        {/* Activities List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {activities.map((activity, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏛️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">{activity.title}</h3>
                  <p className="text-gray-600">{activity.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current Projects */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">বর্তমান প্রকল্পসমূহ</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-gray-700">তরুণ নেতৃত্ব বিকাশ প্রশিক্ষণ</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-gray-700">ডিজিটাল গভর্নেন্স সচেতনতা কার্যক্রম</span>
            </li>
            <li className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-gray-700">স্থানীয় সরকার ব্যবস্থাপনা উন্নয়ন</span>
            </li>
          </ul>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <a 
            href="/activities"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-all duration-300"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            কর্মকান্ড পেইজে ফিরে যান
          </a>
        </div>
      </div>
    </div>
  );
}