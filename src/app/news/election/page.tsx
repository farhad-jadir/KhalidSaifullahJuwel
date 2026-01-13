export default function ElectionNewsPage() {
  const electionNews = [
    {
      title: "স্থানীয় সরকার নির্বাচন প্রস্তুতি",
      date: "১৫ মার্চ, ২০২৪",
      description: "আসন্ন স্থানীয় সরকার নির্বাচনের প্রস্তুতি নিয়ে মতবিনিময় সভা"
    },
    {
      title: "নির্বাচনী ইশতেহার প্রকাশ",
      date: "১০ মার্চ, ২০২৪",
      description: "জনগণের জন্য প্রণীত নির্বাচনী ইশতেহার প্রকাশ"
    },
    {
      title: "ভোটার সচেতনতা কার্যক্রম",
      date: "৫ মার্চ, ২০২৪",
      description: "ভোটারদের মধ্যে সচেতনতা বৃদ্ধিতে বিশেষ কার্যক্রম"
    },
    {
      title: "নির্বাচনী প্রচারণা",
      date: "১ মার্চ, ২০২৪",
      description: "বিভিন্ন এলাকায় নির্বাচনী প্রচারণা কার্যক্রম"
    }
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            নির্বাচন সংবাদ
          </h1>
          <p className="text-lg text-gray-600">
            বিভিন্ন নির্বাচন সম্পর্কিত আমার কার্যক্রম ও সংবাদ
          </p>
        </div>

        {/* News List */}
        <div className="space-y-6 mb-12">
          {electionNews.map((news, index) => (
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{news.title}</h3>
                <span className="text-green-600 font-medium mt-2 md:mt-0">{news.date}</span>
              </div>
              <p className="text-gray-600">{news.description}</p>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <a 
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-all duration-300"
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