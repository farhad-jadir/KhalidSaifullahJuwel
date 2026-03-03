export default function SocialActivitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">সামাজিক কার্যক্রম</h1>
          <p className="text-xl max-w-3xl mx-auto font-bangla">
            মানবতার সেবায় নিরলস প্রচেষ্টা
          </p>
        </div>
      </section>

      {/* Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statistics.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-bangla">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Activities Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 font-bangla">আমাদের সামাজিক কর্মকাণ্ড</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {socialActivities.map((activity, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                {activity.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 font-bangla">{activity.title}</h3>
              <p className="text-gray-600 mb-4 font-bangla">{activity.description}</p>
              <div className="flex items-center text-sm text-green-600">
                <span className="font-semibold">{activity.beneficiaries} জন উপকৃত</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const statistics = [
  { number: "৫০০০+", label: "উপকৃত পরিবার" },
  { number: "১০০+", label: "চিকিৎসা ক্যাম্প" },
  { number: "৫০০+", label: "বৃত্তি প্রদান" },
  { number: "১০০০+", label: "স্বেচ্ছাসেবক" }
];

const socialActivities = [
  {
    title: "চিকিৎসা সেবা",
    description: "বিনামূল্যে চিকিৎসা ক্যাম্প ও ওষুধ বিতরণ কর্মসূচি",
    beneficiaries: "২৫০০",
    icon: "🏥"
  },
  {
    title: "শিক্ষা বৃত্তি",
    description: "মেধাবী ও দরিদ্র শিক্ষার্থীদের বৃত্তি প্রদান",
    beneficiaries: "৫০০",
    icon: "📚"
  },
  {
    title: "শীতবস্ত্র বিতরণ",
    description: "শীতার্ত মানুষের মাঝে কম্বল ও শীতবস্ত্র বিতরণ",
    beneficiaries: "৩০০০",
    icon: "🧥"
  },
  {
    title: "ঈদ উপহার",
    description: "দরিদ্র পরিবারের মাঝে ঈদ সামগ্রী বিতরণ",
    beneficiaries: "২০০০",
    icon: "🎁"
  },
  {
    title: "রক্তদান কর্মসূচি",
    description: "নিয়মিত রক্তদান ক্যাম্প ও সচেতনতা মূলক কার্যক্রম",
    beneficiaries: "১০০০",
    icon: "🩸"
  },
  {
    title: "বয়স্ক ভাতা",
    description: "বয়স্ক ও অসহায় মানুষের জন্য আর্থিক সহায়তা",
    beneficiaries: "৫০০",
    icon: "👴"
  }
];