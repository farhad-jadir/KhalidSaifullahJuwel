export default function ActivitiesPage() {
  const activities = [
    {
      title: "রাজনৈতিক কর্মকান্ড",
      description: "সুশাসন, স্বচ্ছতা ও জবাবদিহিতার মাধ্যমে একটি উন্নত রাজনৈতিক সংস্কৃতি গঠনে কাজ করছি।",
      link: "/activities/political"
    },
    {
      title: "সামাজিক কর্মকান্ড",
      description: "সমাজের সকল স্তরের মানুষের কল্যাণে বিভিন্ন সামাজিক উন্নয়নমূলক কাজে অংশগ্রহণ।",
      link: "/activities/social"
    },
    {
      title: "সৃজনশীল কর্মকান্ড",
      description: "তরুণ প্রজন্মের মাঝে সৃজনশীলতা বিকাশে কর্মশালা, সেমিনার ও প্রশিক্ষণের আয়োজন।",
      link: "/activities/creative"
    },
    {
      title: "উন্নয়নমূলক কর্মকান্ড",
      description: "অঞ্চলের অবকাঠামো উন্নয়ন, শিক্ষা ব্যবস্থার উন্নতি ও অর্থনৈতিক উন্নয়নে ভূমিকা।",
      link: "/activities/development"
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            কর্মকান্ড
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            জনসেবার লক্ষ্যে বিভিন্ন ক্ষেত্রে আমার পরিচালিত কার্যক্রমসমূহ
          </p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {activities.map((activity, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="p-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">{activity.title}</h2>
                <p className="text-gray-600 mb-6">{activity.description}</p>
                <a 
                  href={activity.link}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-300"
                >
                  বিস্তারিত দেখুন
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activities */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">সাম্প্রতিক কার্যক্রম</h2>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <p className="text-gray-600 text-center">
              শীঘ্রই সাম্প্রতিক কার্যক্রমের বিবরণ যোগ করা হবে
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}