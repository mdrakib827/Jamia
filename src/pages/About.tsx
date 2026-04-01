import React from "react";
import { motion } from "motion/react";
import { useData } from "../context/DataContext";
import { BookOpen, Target, Heart, Award, Users, MapPin, Phone, Mail, Clock } from "lucide-react";

export function About() {
  const { data, loading } = useData();

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center font-bengali">লোড হচ্ছে...</div>;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-8 relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bengali font-bold text-white mb-6"
          >
            {data.about?.heroTitle || "আমাদের সম্পর্কে"}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/80 max-w-2xl mx-auto font-bengali"
          >
            {data.about?.heroSubtitle || "দ্বীনি শিক্ষার এক নির্ভরযোগ্য প্রতিষ্ঠান, যেখানে কুরআন ও সুন্নাহর আলোকে আদর্শ মানুষ গড়া হয়।"}
          </motion.p>
        </div>
      </section>

      {/* History Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 text-secondary font-bold mb-4">
              <BookOpen size={24} />
              <span className="uppercase tracking-widest text-sm font-sans">Our History</span>
            </div>
            <h2 className="text-4xl font-bengali font-bold text-primary mb-6">{data.about?.historyTitle || "প্রতিষ্ঠানের ইতিহাস"}</h2>
            <div className="w-20 h-1 bg-secondary mb-8 rounded-full"></div>
            <div className="prose prose-lg font-bengali text-on-surface-variant leading-relaxed space-y-4">
              {(data.about?.historyContent || "জামি‘আ ইসলামিয়া শামসুল উলূম কড়ৈয়াবাড়ী একটি ঐতিহ্যবাহী দ্বীনি শিক্ষা প্রতিষ্ঠান। এটি বন্দর, নারায়ণগঞ্জের এক নিভৃত ও শান্ত পরিবেশে অবস্থিত। বহু বছর আগে একদল নিবেদিতপ্রাণ আলেম ও স্থানীয় ধর্মপ্রাণ মানুষের ঐকান্তিক প্রচেষ্টায় এই মাদরাসাটি প্রতিষ্ঠিত হয়।\n\nপ্রতিষ্ঠালগ্ন থেকেই এই প্রতিষ্ঠানটি কুরআন ও সুন্নাহর সঠিক জ্ঞান বিতরণে অগ্রণী ভূমিকা পালন করে আসছে। এখানে হিফজুল কুরআন থেকে শুরু করে দাওরায়ে হাদীস (মাস্টার্স) পর্যন্ত উচ্চতর ইসলামী শিক্ষার ব্যবস্থা রয়েছে।\n\nবর্তমানে এই মাদরাসাটি অত্র অঞ্চলের অন্যতম শ্রেষ্ঠ বিদ্যাপীঠ হিসেবে পরিচিতি লাভ করেছে, যেখান থেকে প্রতি বছর শত শত আলেম ও হাফেজ কামিয়াব হয়ে দেশ ও জাতির সেবায় নিয়োজিত হচ্ছেন।").split('\n').map((para: string, i: number) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-3xl rotate-3"></div>
            <img 
              src="https://picsum.photos/seed/history/800/600" 
              alt="Madrasa History" 
              className="relative rounded-2xl shadow-2xl w-full h-[450px] object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-10 rounded-3xl shadow-xl border border-outline-variant/10"
            >
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
                <Target size={32} />
              </div>
              <h3 className="text-3xl font-bengali font-bold text-primary mb-4">{data.about?.missionTitle || "আমাদের লক্ষ্য (Mission)"}</h3>
              <p className="text-on-surface-variant font-bengali text-lg leading-relaxed">
                {data.about?.missionContent || "আমাদের মূল লক্ষ্য হলো শিক্ষার্থীদের মধ্যে কুরআন ও সুন্নাহর গভীর জ্ঞান সঞ্চার করা এবং তাদের নৈতিক ও আধ্যাত্মিক চরিত্র গঠন করা। আমরা চাই এমন এক প্রজন্ম তৈরি করতে যারা ইসলামের সঠিক বার্তা বিশ্বব্যাপী ছড়িয়ে দেবে।"}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-10 rounded-3xl shadow-xl border border-outline-variant/10"
            >
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6">
                <Heart size={32} />
              </div>
              <h3 className="text-3xl font-bengali font-bold text-secondary mb-4">{data.about?.visionTitle || "আমাদের উদ্দেশ্য (Vision)"}</h3>
              <p className="text-on-surface-variant font-bengali text-lg leading-relaxed">
                {data.about?.visionContent || "একটি আদর্শ ইসলামী সমাজ বিনির্মাণে দক্ষ ও যোগ্য আলেম তৈরি করা। আধুনিক বিশ্বের চ্যালেঞ্জ মোকাবেলায় সক্ষম এবং দ্বীনি মূল্যবোধে অটল একদল দাঈ তৈরি করা যারা সমাজের সকল স্তরে হেদায়েতের আলো জ্বালাবেন।"}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Muhtamim Message */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-primary rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
              <div className="w-48 h-48 rounded-full border-4 border-white/20 overflow-hidden flex-shrink-0">
                <img 
                  src={data.teachers?.[0]?.image || "https://picsum.photos/seed/muhtamim/200/200"} 
                  alt="Muhtamim" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6">
                <span className="material-symbols-outlined text-secondary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
                <p className="text-xl font-bengali italic leading-relaxed">
                  {data.about?.principalQuote || "\"দ্বীনি শিক্ষা কেবল একটি পেশা নয়, এটি একটি আমানত। আমাদের মাদরাসা সেই আমানত রক্ষার জন্য নিরলস কাজ করে যাচ্ছে। আমরা চাই আমাদের ছাত্ররা কেবল কিতাবী বিদ্যায় পারদর্শী না হয়ে বরং আমলী জিন্দেগীতেও আদর্শ হবে।\""}
                </p>
                <div>
                  <h4 className="text-2xl font-bengali font-bold text-secondary">{data.teachers?.[0]?.name || "মুফতী মুহাম্মদ ফয়জুল্লাহ দা. বা."}</h4>
                  <p className="text-white/60 font-bengali">মুহতামিম, জামি‘আ ইসলামিয়া শামসুল উলূম</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bengali font-bold text-on-surface mb-4">আমাদের সুযোগ-সুবিধাসমূহ</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(data.about?.facilities || [
              { title: "বিশাল লাইব্রেরি", icon: "book", desc: "হাজারো কিতাবের সংগ্রহশালা" },
              { title: "আবাসিক ব্যবস্থা", icon: "group", desc: "নিরাপদ ও উন্নত ছাত্রাবাস" },
              { title: "মসজিদ কমপ্লেক্স", icon: "mosque", desc: "ইবাদত ও আমলের সুন্দর পরিবেশ" },
              { title: "খাবার হল", icon: "restaurant", desc: "স্বাস্থ্যসম্মত খাবারের ব্যবস্থা" },
            ]).map((item: any, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl text-center shadow-sm border border-outline-variant/10"
              >
                <div className="w-16 h-16 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-outlined">{item.icon}</span>
                </div>
                <h4 className="text-xl font-bengali font-bold text-on-surface mb-2">{item.title}</h4>
                <p className="text-on-surface-variant font-bengali text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <h2 className="text-4xl font-bengali font-bold text-primary">যোগাযোগ করুন</h2>
              <p className="text-on-surface-variant font-bengali text-lg">যেকোনো তথ্য বা জিজ্ঞাসার জন্য আমাদের সাথে যোগাযোগ করুন।</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface font-sans">Address</h5>
                    <p className="text-on-surface-variant font-bengali">{data.settings.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface font-sans">Phone</h5>
                    <p className="text-on-surface-variant font-sans">{data.settings.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h5 className="font-bold text-on-surface font-sans">Email</h5>
                    <p className="text-on-surface-variant font-sans">{data.settings.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="w-full h-[450px] rounded-3xl overflow-hidden shadow-xl border border-outline-variant/20 bg-surface-container flex items-center justify-center">
                {data.settings.mapUrl && data.settings.mapUrl.includes("google.com/maps/embed") ? (
                  <iframe 
                    src={data.settings.mapUrl} 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy"
                    title="Madrasa Location"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                ) : data.settings.mapUrl ? (
                  <div className="text-center p-8">
                    <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="material-symbols-outlined text-4xl">map</span>
                    </div>
                    <h4 className="text-xl font-bengali font-bold text-on-surface mb-4">মাদরাসার অবস্থান ম্যাপে দেখুন</h4>
                    <a 
                      href={data.settings.mapUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3 rounded-xl font-bengali font-bold hover:shadow-lg transition-all"
                    >
                      গুগল ম্যাপে ওপেন করুন
                      <span className="material-symbols-outlined">open_in_new</span>
                    </a>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant font-bengali">
                    ম্যাপ লোড করা সম্ভব হয়নি।
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
