export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-green-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              খালেদ সাইফুল্লাহ জুয়েল
            </h1>
            <p className="text-xl md:text-2xl text-green-700 mb-8">
              রাজনীতিবিদ | সমাজসেবক
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
              জনসেবাই আমার রাজনীতির প্রধান লক্ষ্য। আমি বিশ্বাস করি একটি সুন্দর সমাজ গঠনের জন্য
              সৎ ও নিষ্ঠাবান নেতৃত্বের বিকল্প নেই।
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                আমার সাথে যোগাযোগ করুন
              </button>
              <button className="px-8 py-3 bg-white border-2 border-green-600 text-green-700 font-bold rounded-full hover:bg-green-50 transition-all duration-300">
                আমার কার্যক্রম দেখুন
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            আমার কার্যক্রম
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "রাজনৈতিক কার্যক্রম", desc: "সুশাসন ও স্বচ্ছ রাজনীতির জন্য কাজ করছি" },
              { title: "সামাজিক কার্যক্রম", desc: "সমাজের উন্নয়নে বিভিন্ন সামাজিক কাজ" },
              { title: "সৃজনশীল কার্যক্রম", desc: "তরুণদের সৃজনশীলতা বিকাশে কাজ" },
              { title: "উন্নয়নমূলক কার্যক্রম", desc: "অঞ্চলের উন্নয়নে অবদান" }
            ].map((item, index) => (
              <div key={index} className="bg-green-50 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-bold text-green-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}