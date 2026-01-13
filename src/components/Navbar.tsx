"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Heart, ChevronRight, ChevronDown, ChevronUp, Target, Activity, Lightbulb, TrendingUp, Vote, Calendar, MessageSquare, Mic } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sticky navbar effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 20);
      setScrolled(scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setMobileOpenDropdown(null);
  }, [pathname]);

  // Toggle mobile dropdown
  const toggleMobileDropdown = (label: string) => {
    setMobileOpenDropdown(mobileOpenDropdown === label ? null : label);
  };

  // Activities submenu items
  const activitiesSubmenu = [
    { href: "/activities/political", label: "রাজনৈতিক কর্মকান্ড", icon: <Target className="h-4 w-4" /> },
    { href: "/activities/social", label: "সামাজিক কর্মকান্ড", icon: <Activity className="h-4 w-4" /> },
    { href: "/activities/creative", label: "সৃজনশীল কর্মকান্ড", icon: <Lightbulb className="h-4 w-4" /> },
    { href: "/activities/development", label: "উন্নয়নমূলক কর্মকান্ড", icon: <TrendingUp className="h-4 w-4" /> },
  ];

  // News submenu items
  const newsSubmenu = [
    { href: "/news/election", label: "নির্বাচন", icon: <Vote className="h-4 w-4" /> },
    { href: "/news/events", label: "ইভেন্ট", icon: <Calendar className="h-4 w-4" /> },
    { href: "/news/statements", label: "স্টেটমেন্ট", icon: <MessageSquare className="h-4 w-4" /> },
    { href: "/news/interviews", label: "সাক্ষাৎকার", icon: <Mic className="h-4 w-4" /> },
  ];

  const mainNavLinks = [
    { 
      href: "/activities", 
      label: "কর্মকান্ড", 
      hasSubmenu: true,
      submenu: activitiesSubmenu 
    },
    { 
      href: "/news", 
      label: "সংবাদ", 
      hasSubmenu: true,
      submenu: newsSubmenu 
    },
    { href: "/achievements", label: "অর্জনসমূহ", hasSubmenu: false },
    { href: "/partnerships", label: "পার্টনারশিপ", hasSubmenu: false },
    { href: "/gallery", label: "গ্যালারি", hasSubmenu: false },
    { href: "/contact", label: "যোগাযোগ", hasSubmenu: false },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="w-full bg-gradient-to-r from-green-800 to-green-900 text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center">
          <div className="flex items-center gap-2 text-sm md:text-base">
            <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="font-bangla">জনসেবাই আমার রাজনীতির প্রধান লক্ষ্য</span>
            <div className="h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav
        className={`w-full transition-all duration-500 ${
          isSticky
            ? "fixed top-0 left-0 right-0 shadow-2xl z-50 bg-white/95 backdrop-blur-sm border-b border-green-100"
            : "relative bg-gradient-to-b from-green-50 to-white"
        } ${scrolled ? "py-2" : "py-3"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Logo Section - Clickable to Home */}
            <Link 
              href="/" 
              className="flex items-center gap-3 md:gap-4 group cursor-pointer"
              onClick={() => {
                setIsMenuOpen(false);
                setOpenDropdown(null);
                setMobileOpenDropdown(null);
              }}
            >
              <div className="relative group">
                <div className="absolute -inset-2 bg-gradient-to-r from-green-500 to-green-700 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <img
                  src="/kh.jpg"
                  alt="খালিদ সাইফুল্লাহ জুয়েল"
                  className="relative h-14 w-14 md:h-16 md:w-16 object-cover rounded-full border-4 border-white shadow-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-600 rounded-full border-3 border-white shadow-sm flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="leading-tight">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 font-bangla group-hover:text-green-800 transition-colors duration-300">
                  খালিদ সাইফুল্লাহ জুয়েল
                </h1>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-1 bg-gradient-to-r from-green-500 to-green-700 rounded-full"></div>
                  <span className="text-sm md:text-base text-green-700 font-semibold tracking-wide">
                    রাজনীতিবিদ | সমাজসেবক
                  </span>
                  <div className="w-8 h-1 bg-gradient-to-r from-green-700 to-green-500 rounded-full"></div>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation with Dropdowns */}
            <div className="hidden lg:flex items-center gap-1" ref={dropdownRef}>
              {mainNavLinks.map((link) => (
                <div key={link.href} className="relative">
                  {link.hasSubmenu ? (
                    // Dropdown menu item
                    <div className="relative">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === link.label ? null : link.label)}
                        onMouseEnter={() => setOpenDropdown(link.label)}
                        className={`flex items-center gap-1 px-5 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                          pathname.startsWith(link.href)
                            ? "text-white bg-gradient-to-r from-green-600 to-green-800 shadow-lg"
                            : "text-gray-700 hover:text-green-800 hover:bg-green-50"
                        }`}
                      >
                        {link.label}
                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${
                          openDropdown === link.label ? "rotate-180" : ""
                        }`} />
                      </button>

                      {/* Dropdown Content */}
                      {openDropdown === link.label && (
                        <div 
                          className="absolute top-full left-0 mt-1 w-64 bg-white shadow-2xl rounded-xl border border-green-100 overflow-hidden z-50 animate-fadeIn"
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <div className="py-2">
                            {link.submenu?.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${
                                  pathname === subItem.href
                                    ? "bg-green-50 text-green-800 font-semibold"
                                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                                }`}
                              >
                                <div className={`p-1.5 rounded-md ${
                                  pathname === subItem.href 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-green-50 text-green-600"
                                }`}>
                                  {subItem.icon}
                                </div>
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular menu item
                    <Link
                      href={link.href}
                      className={`px-5 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ${
                        pathname === link.href
                          ? "text-white bg-gradient-to-r from-green-600 to-green-800 shadow-lg"
                          : "text-gray-700 hover:text-green-800 hover:bg-green-50"
                      }`}
                    >
                      {link.label}
                      {pathname === link.href && (
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-green-600 rotate-45"></div>
                      )}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Support Button */}
              <button className="ml-4 px-6 py-3 bg-gradient-to-r from-green-700 to-green-900 text-white font-bold rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center gap-2 group">
                <Heart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>সহযোগিতা করুন</span>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${
                isMenuOpen
                  ? "bg-gradient-to-r from-green-600 to-green-800 text-white shadow-lg"
                  : "bg-white border border-green-200 text-gray-700 hover:bg-green-50 hover:shadow-md"
              }`}
              aria-label="মেনু টগল করুন"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu with Dropdowns */}
        {isMenuOpen && (
          <div className="lg:hidden animate-slideDown bg-gradient-to-b from-white to-green-50 border-t border-green-100 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-4">
              {/* Mobile Navigation Links */}
              <div className="grid grid-cols-1 gap-2 mb-4">
                {mainNavLinks.map((link) => (
                  <div key={link.href} className="mb-1">
                    {link.hasSubmenu ? (
                      // Mobile dropdown item
                      <div className="mb-2 overflow-hidden rounded-lg border border-green-200">
                        {/* Dropdown header */}
                        <button
                          onClick={() => toggleMobileDropdown(link.label)}
                          className={`w-full flex items-center justify-between px-4 py-4 text-base font-semibold transition-all duration-300 ${
                            mobileOpenDropdown === link.label || pathname.startsWith(link.href)
                              ? "bg-gradient-to-r from-green-50 to-green-100 text-green-800"
                              : "bg-white text-gray-700 hover:bg-green-50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                              mobileOpenDropdown === link.label || pathname.startsWith(link.href)
                                ? "bg-green-100 text-green-700"
                                : "bg-green-50 text-green-600"
                            }`}>
                              {link.label === "কর্মকান্ড" ? (
                                <Activity className="h-5 w-5" />
                              ) : (
                                <Calendar className="h-5 w-5" />
                              )}
                            </div>
                            {link.label}
                          </div>
                          <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${
                            mobileOpenDropdown === link.label ? "rotate-180" : ""
                          }`} />
                        </button>

                        {/* Dropdown content with smooth animation */}
                        <div 
                          className={`overflow-hidden transition-all duration-300 ${
                            mobileOpenDropdown === link.label ? "max-h-96" : "max-h-0"
                          }`}
                        >
                          <div className="bg-white border-t border-green-100 py-2">
                            {link.submenu?.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                onClick={() => setIsMenuOpen(false)}
                                className={`flex items-center gap-3 px-6 py-3 text-sm transition-all duration-200 ${
                                  pathname === subItem.href
                                    ? "text-green-800 bg-green-50 border-r-4 border-green-600 font-semibold"
                                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                                }`}
                              >
                                <div className={`p-1.5 rounded-md ${
                                  pathname === subItem.href 
                                    ? "bg-green-100 text-green-700" 
                                    : "bg-green-50 text-green-600"
                                }`}>
                                  {subItem.icon}
                                </div>
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Regular mobile menu item
                      <Link
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-4 text-base font-semibold rounded-lg transition-all duration-300 ${
                          pathname === link.href
                            ? "text-white bg-gradient-to-r from-green-600 to-green-800 shadow-lg"
                            : "text-gray-700 hover:bg-green-50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${
                          pathname === link.href
                            ? "bg-green-100 text-white"
                            : "bg-green-50 text-green-600"
                        }`}>
                          {link.label === "অর্জনসমূহ" ? (
                            <TrendingUp className="h-5 w-5" />
                          ) : link.label === "পার্টনারশিপ" ? (
                            <Activity className="h-5 w-5" />
                          ) : link.label === "গ্যালারি" ? (
                            <Lightbulb className="h-5 w-5" />
                          ) : (
                            <MessageSquare className="h-5 w-5" />
                          )}
                        </div>
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Mobile Support Section */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-white rounded-xl border border-green-200">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 font-bangla">আপনার সহযোগিতা</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    আপনার সহযোগিতা আমাদেরকে আরও ভালোভাবে জনসেবা করতে সাহায্য করবে
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 px-4 py-3 bg-gradient-to-r from-green-700 to-green-900 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                    <Heart className="h-4 w-4" />
                    <span>সহযোগিতা করুন</span>
                  </button>
                  <button className="flex-1 px-4 py-3 bg-white border-2 border-green-600 text-green-700 font-bold rounded-lg hover:bg-green-50 transition-all duration-300">
                    স্বেচ্ছাসেবক হোন
                  </button>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="mt-6 pt-4 border-t border-green-100 text-center">
                <p className="text-xs text-gray-500">
                  © {new Date().getFullYear()} খালিদ সাইফুল্লাহ জুয়েল। সকল অধিকার সংরক্ষিত।
                </p>
              </div>
            </div>
          </div>
        )}
      </nav>
      
      {/* Spacer for fixed navbar */}
      {isSticky && <div className="h-20"></div>}
    </>
  );
}