import { Calendar } from "lucide-react";

export default function CreativeActivitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">সৃজনশীল কার্যক্রম</h1>
          <p className="text-xl max-w-3xl mx-auto font-bangla">
            সংস্কৃতি ও সৃজনশীলতার বিকাশে নানামুখী উদ্যোগ
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {creativePrograms.map((program, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <div className="text-7xl transform group-hover:scale-110 transition-transform">
                  {program.icon}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 font-bangla">{program.title}</h3>
                <p className="text-gray-600 mb-3 font-bangla">{program.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-semibold">{program.participants}+ অংশগ্রহণকারী</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{program.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="bg-green-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 font-bangla">আসন্ন সৃজনশীল আয়োজন</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="bg-white rounded-xl p-6 flex items-start gap-4">
                <div className="bg-green-100 rounded-lg p-3">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1 font-bangla">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 font-bangla">{event.description}</p>
                  <p className="text-green-600 font-semibold text-sm">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const creativePrograms = [
  {
    title: "চিত্রাঙ্কন প্রতিযোগিতা",
    description: "তরুণ শিল্পীদের জন্য বার্ষিক চিত্রাঙ্কন প্রতিযোগিতা",
    participants: "৫০০",
    status: "চলমান",
    icon: "🎨"
  },
  {
    title: "সাংস্কৃতিক উৎসব",
    description: "বিভিন্ন সাংস্কৃতিক অনুষ্ঠান ও উৎসব আয়োজন",
    participants: "২০০০",
    status: "আসন্ন",
    icon: "🎭"
  },
  {
    title: "সংগীত প্রতিযোগিতা",
    description: "আধুনিক ও রবীন্দ্রসংগীত প্রতিযোগিতা",
    participants: "৩০০",
    status: "চলমান",
    icon: "🎵"
  },
  {
    title: "কবিতা আবৃত্তি",
    description: "কবিতা আবৃত্তি ও লেখনী প্রতিযোগিতা",
    participants: "২০০",
    status: "সমাপ্ত",
    icon: "📝"
  },
  {
    title: "নাট্যোৎসব",
    description: "তরুণ নাট্যকারদের নাটক মঞ্চায়ন",
    participants: "১৫০",
    status: "আসন্ন",
    icon: "🎪"
  },
  {
    title: "হস্তশিল্প মেলা",
    description: "স্থানীয় হস্তশিল্প পণ্যের মেলা ও প্রদর্শনী",
    participants: "১০০০",
    status: "বার্ষিক",
    icon: "🏺"
  }
];

const upcomingEvents = [
  {
    title: "বার্ষিক সাংস্কৃতিক সন্ধ্যা",
    description: "শিল্পী ও সংস্কৃতিকর্মীদের নিয়ে মনোজ্ঞ সাংস্কৃতিক সন্ধ্যা",
    date: "১৫ ডিসেম্বর, ২০২৪"
  },
  {
    title: "তরুণ শিল্পী সম্মাননা",
    description: "গুণী তরুণ শিল্পীদের সম্মাননা প্রদান",
    date: "২০ জানুয়ারি, ২০২৫"
  },
  {
    title: "বইমেলা ও পাঠচক্র",
    description: "স্থানীয় লেখকদের বই নিয়ে বইমেলা ও আলোচনা সভা",
    date: "৫ ফেব্রুয়ারি, ২০২৫"
  },
  {
    title: "ঐতিহ্যবাহী নৃত্যানুষ্ঠান",
    description: "লোকজ ও ক্লাসিক্যাল নৃত্যের আয়োজন",
    date: "১০ মার্চ, ২০২৫"
  }
];