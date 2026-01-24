import "./globals.css";
import { Noto_Serif_Bengali } from "next/font/google";
import Navbar from "@/components/Navbar";

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "খালেদ সাইফুল্লাহ জুয়েল - রাজনীতিবিদ",
  description: "জনসেবাই আমার রাজনীতির প্রধান লক্ষ্য",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className={`${notoSerifBengali.className} bg-gray-50`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-gradient-to-r from-green-800 to-green-900 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-sm">© {new Date().getFullYear()} খালেদ সাইফুল্লাহ জুয়েল। সকল অধিকার সংরক্ষিত।</p>
              <p className="text-sm mt-2">জনসেবাই আমার রাজনীতির প্রধান লক্ষ্য</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}