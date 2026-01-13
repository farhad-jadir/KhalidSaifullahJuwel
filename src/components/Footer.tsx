import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="/kh.jpg"
                  alt="খালিদ সাইফুল্লাহ জুয়েল"
                  className="h-12 w-12 object-cover rounded-full border-2 border-primary-500"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold font-bangla">খালিদ সাইফুল্লাহ জুয়েল</h3>
                <p className="text-sm text-gray-300">রাজনীতিবিদ</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              জনগণের সেবা ও দেশের উন্নয়নে নিবেদিত একজন রাজনৈতিক ব্যক্তিত্ব। 
              সমাজের উন্নতি এবং মানুষের অধিকার প্রতিষ্ঠায় কাজ করে যাচ্ছি।
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-l-4 border-primary-500 pl-3">দ্রুত লিংক</h4>
            <ul className="space-y-2">
              <li><a href="/activities" className="text-gray-400 hover:text-white transition-colors">কর্মকান্ড</a></li>
              <li><a href="/news" className="text-gray-400 hover:text-white transition-colors">সংবাদ</a></li>
              <li><a href="/achievements" className="text-gray-400 hover:text-white transition-colors">অর্জনসমূহ</a></li>
              <li><a href="/gallery" className="text-gray-400 hover:text-white transition-colors">গ্যালারি</a></li>
              <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">যোগাযোগ</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-l-4 border-primary-500 pl-3">যোগাযোগ</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="h-5 w-5 text-primary-400" />
                <span className="text-sm">ঢাকা, বাংলাদেশ</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 text-primary-400" />
                <a href="tel:+880XXXXXXXXXX" className="text-sm hover:text-white">
                  +৮৮০ XXXX-XXXXXX
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5 text-primary-400" />
                <a href="mailto:contact@khalidsaifullah.com" className="text-sm hover:text-white">
                  contact@khalidsaifullah.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 border-l-4 border-primary-500 pl-3">সামাজিক যোগাযোগ</h4>
            <p className="text-gray-400 text-sm mb-4">
              সামাজিক যোগাযোগ মাধ্যমে আমার সাথে যুক্ত থাকুন
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-lg hover:bg-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2">নিউজলেটার সাবস্ক্রাইব</h5>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="আপনার ইমেইল"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                >
                  সাবস্ক্রাইব
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-left">
            © {currentYear} খালিদ সাইফুল্লাহ জুয়েল। সর্বস্বত্ব সংরক্ষিত।
          </p>
          <div className="flex gap-6 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition-colors">গোপনীয়তা নীতি</a>
            <a href="/terms" className="hover:text-white transition-colors">সেবার শর্তাবলী</a>
            <a href="/sitemap" className="hover:text-white transition-colors">সাইটম্যাপ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}