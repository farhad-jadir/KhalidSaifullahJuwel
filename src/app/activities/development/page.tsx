//khalid/src/app/activiities/development/page/tsx
import { Building, Lightbulb, School, Hospital, Droplets } from "lucide-react";

export default function DevelopmentActivitiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-800 to-green-900 text-white py-20">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-bangla">উন্নয়নমূলক কার্যক্রম</h1>
          <p className="text-xl max-w-3xl mx-auto font-bangla">
            এলাকার সার্বিক উন্নয়নে বাস্তবমুখী উদ্যোগ
          </p>
        </div>
      </section>

      {/* Progress Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">১৫০+</div>
              <div className="text-gray-600 font-bangla">উন্নয়ন প্রকল্প</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">৫০কি.মি.</div>
              <div className="text-gray-600 font-bangla">রাস্তা নির্মাণ</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">২০টি</div>
              <div className="text-gray-600 font-bangla">শিক্ষাপ্রতিষ্ঠান</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">১০০%</div>
              <div className="text-gray-600 font-bangla">বিদ্যুতায়ন</div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 font-bangla">সম্পাদিত উন্নয়ন কর্মকাণ্ড</h2>
        <div className="space-y-8">
          {developmentProjects.map((project, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/4">
                  <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white text-center">
                    <div className="text-4xl mb-2">{project.icon}</div>
                    <div className="text-lg font-semibold">{project.category}</div>
                  </div>
                </div>
                <div className="md:w-3/4">
                  <h3 className="text-2xl font-bold mb-3 font-bangla">{project.title}</h3>
                  <p className="text-gray-600 mb-4 font-bangla">{project.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {project.details.map((detail, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-semibold text-green-600">{detail.label}:</span>
                        <span className="text-gray-700 ml-2">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-green-600 h-2.5 rounded-full" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-right text-sm text-gray-500 mt-1">অগ্রগতি {project.progress}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Future Plans */}
      <section className="bg-gradient-to-r from-green-800 to-green-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 font-bangla">ভবিষ্যৎ পরিকল্পনা</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 font-bangla">ডিজিটাল সেন্টার</h3>
              <p className="text-green-100 mb-4">প্রতিটি ইউনিয়নে ডিজিটাল সার্ভিস সেন্টার স্থাপন</p>
              <p className="text-sm text-green-300">সম্ভাব্য সময়: ২০২৫</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 font-bangla">শিল্প পার্ক</h3>
              <p className="text-green-100 mb-4">ক্ষুদ্র ও মাঝারি শিল্পের জন্য শিল্প পার্ক নির্মাণ</p>
              <p className="text-sm text-green-300">সম্ভাব্য সময়: ২০২৬</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3 font-bangla">মেডিকেল কলেজ</h3>
              <p className="text-green-100 mb-4">আধুনিক মেডিকেল কলেজ ও হাসপাতাল স্থাপন</p>
              <p className="text-sm text-green-300">সম্ভাব্য সময়: ২০২৭</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const developmentProjects = [
  {
    title: "আঞ্চলিক সড়ক উন্নয়ন",
    description: "৫০ কিলোমিটার আঞ্চলিক সড়ক প্রশস্তকরণ ও পুনঃনির্মাণ",
    category: "যোগাযোগ",
    icon: "🛣️",
    progress: 85,
    details: [
      { label: "দৈর্ঘ্য", value: "৫০ কিমি" },
      { label: "ব্যয়", value: "৫০ কোটি টাকা" },
      { label: "মেয়াদ", value: "২০২৪" }
    ]
  },
  {
    title: "মডেল মসজিদ কমপ্লেক্স",
    description: "আধুনিক সুবিধাসম্পন্ন মডেল মসজিদ ও ইসলামিক সাংস্কৃতিক কেন্দ্র",
    category: "ধর্মীয়",
    icon: "🕌",
    progress: 70,
    details: [
      { label: "আয়তন", value: "১০ কাঠা" },
      { label: "অর্থায়ন", value: "সরকারি" },
      { label: "অগ্রগতি", value: "চলমান" }
    ]
  },
  {
    title: "নদী খনন প্রকল্প",
    description: "বর্ষা মৌসুমে বন্যা নিয়ন্ত্রণে নদী খনন ও পুনরুদ্ধার",
    category: "পানি সম্পদ",
    icon: "💧",
    progress: 60,
    details: [
      { label: "দৈর্ঘ্য", value: "১৫ কিমি" },
      { label: "মাটি কাটা", value: "১০ লক্ষ ঘনমিটার" },
      { label: "সম্ভাব্য সমাপ্তি", value: "জুন ২০২৫" }
    ]
  },
  {
    title: "সৌর বিদ্যুৎ প্রকল্প",
    description: "গ্রামীণ এলাকায় সৌর প্যানেল স্থাপন ও বিদ্যুৎ সংযোগ",
    category: "বিদ্যুৎ",
    icon: "☀️",
    progress: 100,
    details: [
      { label: "ক্ষমতা", value: "৫ মেগাওয়াট" },
      { label: "পরিবার", value: "১০০০+" },
      { label: "অবস্থা", value: "সম্পন্ন" }
    ]
  }
];