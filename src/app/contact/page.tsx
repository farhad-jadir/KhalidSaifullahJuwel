// khalid/src/app/contact/page.tsx
'use client';

import { useState } from "react";
import { createClient } from '@supabase/supabase-js';
import Image from "next/image";
import { toast } from 'react-hot-toast';

// Supabase ক্লায়েন্ট
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // ডিফল্ট কন্টাক্ট ইনফো (Supabase থেকে লোড করা হবে)
  const [contactInfo, setContactInfo] = useState({
    office: {
      title: "কার্যালয়",
      address: "জাতীয় নাগরিক পার্টি (এনসিপি) কেন্দ্রীয় কার্যালয়",
      location: "২৩/এ, বাংলামোটর, ঢাকা-১০০০",
      hours: "রবি - বৃহস্পতি: সকাল ১০টা - সন্ধ্যা ৭টা",
      phone: "+৮৮০ ১৭XX-XXXXXX",
      email: "office@khaledsaifullah.com"
    },
    personal: {
      title: "ব্যক্তিগত যোগাযোগ",
      phone: "+৮৮০ ১৭XX-XXXXXX",
      email: "k.s.jewel@ncp.org.bd",
      alternative: "+৮৮০ ১৫XX-XXXXXX"
    },
    social: [
      {
        platform: "ফেসবুক",
        handle: "@khaledsaifullah.jewel",
        url: "https://facebook.com/khaledsaifullah.jewel",
        icon: "📘",
        color: "bg-blue-600"
      },
      {
        platform: "টুইটার",
        handle: "@KSJewel_NCP",
        url: "https://twitter.com/KSJewel_NCP",
        icon: "🐦",
        color: "bg-sky-500"
      },
      {
        platform: "ইন্সটাগ্রাম",
        handle: "@ksjewel_official",
        url: "https://instagram.com/ksjewel_official",
        icon: "📷",
        color: "bg-pink-600"
      },
      {
        platform: "লিংকডইন",
        handle: "in/khaledsaifullah",
        url: "https://linkedin.com/in/khaledsaifullah",
        icon: "💼",
        color: "bg-blue-700"
      },
      {
        platform: "ইউটিউব",
        handle: "@KhaledSaifullahTV",
        url: "https://youtube.com/@KhaledSaifullahTV",
        icon: "▶️",
        color: "bg-red-600"
      },
      {
        platform: "টেলিগ্রাম",
        handle: "t.me/KSJewel_NCP",
        url: "https://t.me/KSJewel_NCP",
        icon: "✈️",
        color: "bg-blue-500"
      }
    ]
  });

  const teamMembers = [
    {
      name: "রফিকুল ইসলাম",
      role: "ব্যক্তিগত সহকারী",
      phone: "+৮৮০ ১৭XX-XXXXXX",
      email: "rafiq@khaledsaifullah.com",
      availability: "সকাল ৯টা - রাত ৮টা"
    },
    {
      name: "নাসরিন আক্তার",
      role: "গণসংযোগ কর্মকর্তা",
      phone: "+৮৮০ ১৮XX-XXXXXX",
      email: "nasrin@khaledsaifullah.com",
      availability: "সকাল ১০টা - সন্ধ্যা ৬টা"
    },
    {
      name: "হাসান মাহমুদ",
      role: "সাংগঠনিক সমন্বয়কারী",
      phone: "+৮৮০ ১৯XX-XXXXXX",
      email: "hasan@khaledsaifullah.com",
      availability: "দুপুর ২টা - রাত ৯টা"
    }
  ];

  const offices = [
    {
      city: "ঢাকা (প্রধান কার্যালয়)",
      address: "জাতীয় নাগরিক পার্টি (এনসিপি) কেন্দ্রীয় কার্যালয়, ২৩/এ, বাংলামোটর, ঢাকা-১০০০",
      phone: "+৮৮০ ২-XXX-XXXX",
      hours: "রবি-বৃহস্পতি: সকাল ১০টা - সন্ধ্যা ৭টা",
      map: "https://goo.gl/maps/..."
    },
    {
      city: "চট্টগ্রাম",
      address: "এনসিপি চট্টগ্রাম বিভাগীয় কার্যালয়, ১৫, আগ্রাবাদ কমার্শিয়াল এরিয়া, চট্টগ্রাম",
      phone: "+৮৮০ ৩১-XXXXXX",
      hours: "রবি-বৃহস্পতি: সকাল ১০টা - সন্ধ্যা ৬টা",
      map: "https://goo.gl/maps/..."
    },
    {
      city: "রাজশাহী",
      address: "এনসিপি রাজশাহী বিভাগীয় কার্যালয়, ৫৭, সাহেব বাজার, রাজশাহী",
      phone: "+৮৮০ ৭২১-XXXXXX",
      hours: "রবি-বৃহস্পতি: সকাল ১০টা - সন্ধ্যা ৬টা",
      map: "https://goo.gl/maps/..."
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      
      // ফাইল সাইজ চেক (৫MB এর নিচে)
      const validFiles = selectedFiles.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`${file.name} এর সাইজ ৫MB এর বেশি`);
          return false;
        }
        return true;
      });

      setFiles(prev => [...prev, ...validFiles]);

      // প্রিভিউ তৈরি
      validFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFilePreviews(prev => [...prev, reader.result as string]);
          };
          reader.readAsDataURL(file);
        } else {
          // ভিডিও বা অন্য ফাইলের জন্য আইকন
          setFilePreviews(prev => [...prev, 'file']);
        }
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setUploadProgress(0);

    try {
      // ক্যাটাগরি নির্ধারণ
      let category = formData.subject;
      if (formData.subject === 'meeting') category = 'সাক্ষাৎ';
      else if (formData.subject === 'suggestion') category = 'পরামর্শ';
      else if (formData.subject === 'complaint') category = 'অভিযোগ';
      else if (formData.subject === 'cooperation') category = 'সহযোগিতা';
      else category = 'অন্যান্য';

      // IP Address (আনুমানিক)
      const ip_address = 'client-ip'; // প্রকৃত IP পেতে হলে server-side needed

      // ১. মেসেজ সংরক্ষণ
      const { data: messageData, error: messageError } = await supabase
        .from('contact_messages')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          category: category,
          status: 'pending',
          priority: 'normal',
          ip_address: ip_address,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (messageError) {
        console.error('Message insert error:', messageError);
        throw new Error('বার্তা সংরক্ষণে সমস্যা হয়েছে');
      }

      setUploadProgress(30);

      // ২. ফাইল আপলোড (যদি থাকে)
      if (files.length > 0 && messageData) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const filePath = `messages/${messageData.id}/${fileName}`;

          // ফাইল আপলোড
          const { error: uploadError } = await supabase.storage
            .from('contact')
            .upload(filePath, file);

          if (uploadError) {
            console.error('File upload error:', uploadError);
            continue;
          }

          // পাবলিক URL
          const { data: { publicUrl } } = supabase.storage
            .from('contact')
            .getPublicUrl(filePath);

          // ফাইল তথ্য সংরক্ষণ
          await supabase
            .from('contact_files')
            .insert({
              message_id: messageData.id,
              file_name: file.name,
              file_size: file.size,
              file_type: file.type,
              file_path: filePath,
              file_url: publicUrl,
              created_at: new Date().toISOString()
            });

          // প্রোগ্রেস আপডেট
          setUploadProgress(30 + Math.floor((i + 1) / files.length * 60));
        }
      }

      setUploadProgress(100);

      // ৩. সেটিংস চেক করে অটো-রিপ্লাই
      const { data: settings } = await supabase
        .from('contact_settings')
        .select('*')
        .eq('id', 1)
        .single();

      // সাফল্য বার্তা
      toast.success('আপনার বার্তা সফলভাবে পাঠানো হয়েছে');
      setSubmitStatus('success');
      
      // ফর্ম রিসেট
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
      });
      setFiles([]);
      setFilePreviews([]);

      // ৩ সেকেন্ড পর স্ট্যাটাস ক্লিয়ার
      setTimeout(() => {
        setSubmitStatus(null);
        setUploadProgress(0);
      }, 3000);

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('বার্তা পাঠাতে সমস্যা হয়েছে');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            সরাসরি যোগাযোগ করুন
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            খালেদ সাইফুল্লাহ জুয়েল
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            জাতীয় নাগরিক পার্টির (এনসিপি) কেন্দ্রীয় সদস্য ও গণআন্দোলনের সংগঠক। 
            আপনার মতামত, পরামর্শ বা যে কোনো প্রয়োজনে সরাসরি যোগাযোগ করুন।
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-3">📞</div>
            <h3 className="font-semibold text-gray-900 mb-2">ফোন</h3>
            <p className="text-blue-600 font-medium mb-1">{contactInfo.personal.phone}</p>
            <p className="text-sm text-gray-500">(ব্যক্তিগত)</p>
            <p className="text-blue-600 font-medium mt-2">{contactInfo.personal.alternative}</p>
            <p className="text-sm text-gray-500">(বিকল্প)</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-3">✉️</div>
            <h3 className="font-semibold text-gray-900 mb-2">ইমেইল</h3>
            <p className="text-blue-600 font-medium break-all">{contactInfo.personal.email}</p>
            <p className="text-sm text-gray-500 mt-2">(প্রাতিষ্ঠানিক)</p>
            <p className="text-blue-600 font-medium mt-2 break-all">{contactInfo.office.email}</p>
            <p className="text-sm text-gray-500">(কার্যালয়)</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-3">🏢</div>
            <h3 className="font-semibold text-gray-900 mb-2">কার্যালয়</h3>
            <p className="text-gray-600 text-sm">{contactInfo.office.location}</p>
            <p className="text-blue-600 font-medium mt-2">{contactInfo.office.hours}</p>
          </div>
        </div>

        {/* Contact Form and Info Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">সরাসরি বার্তা পাঠান</h2>
            
            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                আপনার বার্তা সফলভাবে পাঠানো হয়েছে। ধন্যবাদ!
              </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                বার্তা পাঠাতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।
              </div>
            )}

            {/* Upload Progress */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>আপলোড প্রগতি</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="আপনার পূর্ণ নাম"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    আপনার ইমেইল *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="youremail@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    ফোন নম্বর
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="০১XXX-XXXXXX"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    বিষয় *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  >
                    <option value="">বাছাই করুন</option>
                    <option value="meeting">সাক্ষাতের অনুরোধ</option>
                    <option value="suggestion">পরামর্শ</option>
                    <option value="complaint">অভিযোগ</option>
                    <option value="cooperation">সহযোগিতা</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  আপনার বার্তা *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
                />
              </div>

              {/* File Upload Section */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors">
                <div className="text-center">
                  <div className="text-4xl mb-2">📎</div>
                  <p className="text-gray-600 mb-2">
                    ছবি বা ভিডিও সংযুক্ত করুন
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    সর্বোচ্চ ৫টি ফাইল (প্রতি ফাইল সর্বোচ্চ ৫MB)
                  </p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                      <span>📁</span>
                      ফাইল নির্বাচন করুন
                    </span>
                  </label>
                </div>

                {/* File Previews */}
                {filePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        {preview === 'file' ? (
                          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-4xl">📄</span>
                          </div>
                        ) : (
                          <div className="aspect-video relative rounded-lg overflow-hidden">
                            <Image
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                        <p className="text-xs text-gray-500 mt-1 truncate">
                          {files[index]?.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg text-lg ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'পাঠানো হচ্ছে...' : 'বার্তা পাঠান 📨'}
                </button>
              </div>

              <p className="text-sm text-gray-500 text-center">
                * চিহ্নিত ঘরগুলো অবশ্যই পূরণ করতে হবে
              </p>
            </form>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            {/* Emergency Contact */}
            <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">🚨</span>
                <h3 className="text-xl font-bold text-red-800">জরুরি প্রয়োজনে</h3>
              </div>
              <p className="text-red-700 mb-3">২৪/৭ জরুরি যোগাযোগ:</p>
              <p className="text-2xl font-bold text-red-600 mb-2">+৮৮০ ১৭XX-XXXXXX</p>
              <p className="text-sm text-red-600">(শুধুমাত্র জরুরি প্রয়োজনে)</p>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">সোশ্যাল মিডিয়া</h3>
              <div className="space-y-3">
                {contactInfo.social.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`w-10 h-10 ${social.color} rounded-lg flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
                      {social.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{social.platform}</p>
                      <p className="text-sm text-gray-600">{social.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Team Contacts */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">সহযোগী টিম</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600 mb-4 mx-auto">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 text-center mb-1">{member.name}</h3>
                <p className="text-blue-600 text-sm text-center mb-3">{member.role}</p>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <span className="text-gray-500">📞</span>
                    <span className="text-gray-700">{member.phone}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-gray-500">✉️</span>
                    <span className="text-gray-700 break-all">{member.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-gray-500">⏰</span>
                    <span className="text-gray-700">{member.availability}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Offices */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">আঞ্চলিক কার্যালয়</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {offices.map((office, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-blue-600">📍</span>
                  {office.city}
                </h3>
                <p className="text-gray-600 text-sm mb-2">{office.address}</p>
                <p className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                  <span>📞</span>
                  {office.phone}
                </p>
                <p className="text-gray-600 text-sm mb-3 flex items-center gap-2">
                  <span>⏰</span>
                  {office.hours}
                </p>
                <a
                  href={office.map}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  গুগল ম্যাপে দেখুন 🗺️
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ or Additional Info */}
        <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">যোগাযোগের পূর্বে</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">📋</div>
              <h3 className="font-semibold text-gray-900 mb-2">সাক্ষাৎ</h3>
              <p className="text-gray-600 text-sm">পূর্বনির্ধারিত সাক্ষাৎকারের জন্য ফোন অথবা ইমেইলে যোগাযোগ করুন</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">দ্রুত প্রতিক্রিয়া</h3>
              <p className="text-gray-600 text-sm">সাধারণত ২৪-৪৮ ঘন্টার মধ্যে জবাব দেওয়া হয়</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🔒</div>
              <h3 className="font-semibold text-gray-900 mb-2">গোপনীয়তা</h3>
              <p className="text-gray-600 text-sm">আপনার তথ্য সম্পূর্ণ সুরক্ষিত থাকবে</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}