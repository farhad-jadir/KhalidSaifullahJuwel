// app/about/page.tsx

import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="w-full bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

        {/* Left Side Image */}
        <div className="flex justify-center">
          <div className="relative w-[350px] h-[420px] rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="/jewel.jpg"
              alt="Khaled Saifullah Jewel"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Right Side Content */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            আমার সম্পর্কে
          </h1>

          <p className="text-gray-700 mb-4 leading-relaxed">
            খালেদ সাইফুল্লাহ জুয়েল একজন তরুণ ও দূরদর্শী রাজনৈতিক নেতা,
            যিনি বাঘারপাড়া পৌরসভার উন্নয়ন, শিক্ষা, কর্মসংস্থান এবং
            সামাজিক ন্যায়বিচার প্রতিষ্ঠার জন্য কাজ করে যাচ্ছেন।
          </p>

          <p className="text-gray-700 mb-4 leading-relaxed">
            তিনি বিশ্বাস করেন যে জনগণের অংশগ্রহণ ছাড়া প্রকৃত উন্নয়ন সম্ভব নয়।
            তাই তিনি সবসময় জনগণের পাশে থেকে তাদের সমস্যা সমাধানে কাজ করেন।
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            তার লক্ষ্য হলো একটি আধুনিক, নিরাপদ এবং উন্নত বাঘারপাড়া গড়ে তোলা,
            যেখানে প্রতিটি নাগরিক সমান সুযোগ ও মর্যাদা পাবে।
          </p>

          {/* Highlights */}
          <div className="grid grid-cols-2 gap-4">

            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-bold text-green-600 text-lg">জনসংযোগ</h3>
              <p className="text-sm text-gray-600">
                জনগণের সাথে নিয়মিত যোগাযোগ
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-bold text-green-600 text-lg">উন্নয়ন</h3>
              <p className="text-sm text-gray-600">
                অবকাঠামো ও সামাজিক উন্নয়ন
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-bold text-green-600 text-lg">যুব শক্তি</h3>
              <p className="text-sm text-gray-600">
                যুব সমাজকে নেতৃত্বে আনা
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-bold text-green-600 text-lg">সেবা</h3>
              <p className="text-sm text-gray-600">
                জনগণের কল্যাণে কাজ
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}