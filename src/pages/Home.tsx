import { motion, AnimatePresence } from "motion/react";
import { useData } from "../context/DataContext";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";
import { Link } from "react-router-dom";

export function Home() {
  const { data, loading } = useData();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center font-bengali">লোড হচ্ছে...</div>;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[800px] flex items-center overflow-hidden bg-primary-container">
        <div className="absolute inset-0 arabesque-pattern z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-container/90 to-tertiary/80 z-10"></div>
        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            {data.settings.logo ? (
              <div className="mb-6 opacity-90">
                <div className="bg-white rounded-lg p-4 shadow-2xl inline-block">
                  <img
                    alt="Madrasa Logo"
                    className="w-32 h-32 object-contain"
                    src={data.settings.logo}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuCMu0I0-nAJDaXwovvUL2h5E0lfJb2QiBph-NR8_oAyRv1Q3-fJBW3M1dnre4ZITR4zaTtV4uH14LW4Aqk26VWtc3leQbr6yRmlC4bZSBoV73fFaesFfXvjrQApCQWVTSW7pLrZy3Uw4MC27721dCQ9dcwyIxngTJrcVUISP_unAq58uXY1KWjGj-7sOnZA_CMs6rJPvuqIojqLt15Che6qnY2rl6rj2v-u9LtK8Ne_L4mQZSUZ3pf9MRJWgeYnSMid82DodR7LaKA7";
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="mb-6 opacity-90">
                <div className="bg-white rounded-lg p-4 shadow-2xl inline-block">
                  <div className="w-32 h-32 flex items-center justify-center text-primary/20">
                    <span className="material-symbols-outlined text-4xl">school</span>
                  </div>
                </div>
              </div>
            )}
            <h1 className="text-display-lg font-bengali font-bold text-6xl lg:text-7xl leading-tight mb-4">
              {data.settings.siteTitle}
            </h1>
            <p className="text-xl md:text-2xl font-bengali text-white/90 mb-10 max-w-xl font-medium">
              {data.settings.address}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/admission" className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-md font-bold text-lg hover:shadow-xl transition-all font-bengali">
                ভর্তি ফরম
              </Link>
              <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-white/20 transition-all font-bengali">
                বিস্তারিত জানুন
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="w-full h-[600px] rounded-t-full overflow-hidden border-8 border-white/10 shadow-2xl bg-white/5">
              {data.settings.heroImage ? (
                <img
                  alt="Madrasa Architecture"
                  className="w-full h-full object-cover"
                  src={data.settings.heroImage}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuBJcxE_WaNYk8wxz2Me4i9AQSv8iDrQualK7rRMUDTazl5k_4TdRwpFgNEVGvtc-wlzxpLmwlgITaQGqaNAhpZjavwNuWIM_-HYT-dBEVean4UsaYe6JgEivd4m7S9FlvixPIoFZhMdyeyhLl6yVBJKI4dv0WsDJNl-rdEbH5JN0Z-WETzTJRJgW03FfmwLaTOa4H-zq7fROrsW0PH1HqEWEIk6-aF98dsPt4bj1cB9FRrm4j-PSEanPh-bsOSUV4LTfoAukUxHTyRf";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <span className="material-symbols-outlined text-6xl">image</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-8 rounded-xl shadow-2xl max-w-xs">
              <div className="flex items-center gap-4 mb-2">
                <span className="material-symbols-outlined text-secondary text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>mosque</span>
                <div className="font-headline font-bold text-2xl text-primary">500+</div>
              </div>
              <p className="text-on-surface-variant font-bengali text-sm font-medium">প্রতি বছর কৃতি ছাত্ররা কামিয়াব হয়ে দেশ ও জাতির সেবা করছে</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-12 -mt-16 relative z-30 max-w-5xl mx-auto px-8 w-full">
        <div className="bg-white rounded-2xl shadow-[0_32px_64px_-12px_rgba(0,93,66,0.12)] p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center border border-outline-variant/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-tertiary-fixed flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">edit_note</span>
            </div>
            <div>
              <h3 className="font-bengali font-bold text-lg text-on-surface">অনলাইন আবেদন</h3>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-sans">Apply Online</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div>
              <h3 className="font-bengali font-bold text-lg text-on-surface">ভর্তি নির্দেশিকা</h3>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider font-sans">Admission Guide</p>
            </div>
          </div>
          <div>
            <Link to="/admission" className="w-full bg-primary text-on-primary py-3 rounded-md font-bengali font-bold text-lg hover:bg-tertiary transition-colors flex items-center justify-center">
              এখনই আবেদন করুন
            </Link>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section id="departments" className="py-24 bg-surface-container-low relative overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="text-center mb-16">
            <span className="text-secondary font-bold tracking-widest uppercase text-sm font-sans">Our Departments</span>
            <h2 className="text-4xl font-bengali font-bold text-on-surface mt-2 mb-4">শিক্ষা বিভাগসমূহ</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(data.departments || [
              { title: "হিফজুল কুরআন বিভাগ", desc: "সহীহ ও সুন্দর তিলাওয়াতের মাধ্যমে পবিত্র কুরআন হিফজ করার অনন্য বিভাগ।", icon: "menu_book" },
              { title: "মাওলানা কোর্স (দাওরায়ে হাদীস)", desc: "কুরআন, সুন্নাহ ও ইসলামী ফিকহ-এর উপর উচ্চতর গবেষণামূলক মাস্টার্স সমমানের কোর্স।", icon: "school" },
              { title: "ইফতা ও গবেষণা বিভাগ", desc: "সমসাময়িক মাসআলা-মাসায়েল ও ফতোয়া প্রদানের বিশেষ প্রশিক্ষণ বিভাগ।", icon: "gavel" },
            ]).map((dept: any, idx: number) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-surface-container-lowest p-8 rounded-xl shadow-sm hover:shadow-xl transition-all group border border-outline-variant/10"
              >
                <div className="w-16 h-16 mihrab-shape bg-tertiary-fixed/30 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <span className="material-symbols-outlined text-3xl">{dept.icon}</span>
                </div>
                <h3 className="text-2xl font-bengali font-bold text-on-surface mb-3">{dept.title}</h3>
                <p className="text-on-surface-variant leading-relaxed mb-6 font-bengali">{dept.desc}</p>
                <a className="inline-flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all" href="#">
                  বিস্তারিত দেখুন <span className="material-symbols-outlined">arrow_right_alt</span>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notice Board & Quote Section */}
      <section id="notices" className="py-24 max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bengali font-bold text-on-surface">নোটিশ বোর্ড</h2>
              <p className="text-on-surface-variant font-sans text-sm mt-1">Latest Academic Announcements</p>
            </div>
            <a className="text-primary font-bold text-sm border-b-2 border-primary/20 hover:border-primary transition-all" href="#">সকল নোটিশ</a>
          </div>
          <div className="space-y-4">
            {data.notices.map((notice: any, idx: number) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-outline-variant/20 hover:bg-tertiary-fixed/10 transition-colors flex gap-6">
                <div className="flex-shrink-0 w-16 h-16 bg-primary-container rounded-lg flex flex-col items-center justify-center text-white">
                  <span className="text-xs uppercase font-bold opacity-80">{notice.month}</span>
                  <span className="text-xl font-bold">{notice.date}</span>
                </div>
                <div>
                  <h4 className="text-xl font-bengali font-bold text-primary mb-1">{notice.title}</h4>
                  <p className="text-on-surface-variant font-bengali">{notice.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-secondary-fixed rounded-t-full p-8 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-secondary"></div>
          <span className="material-symbols-outlined text-secondary text-5xl mt-12 mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
          <h3 className="text-2xl font-bengali font-bold text-on-secondary-fixed mb-6 leading-relaxed">
            "তোমাদের মধ্যে সেই ব্যক্তি সর্বোত্তম যে কুরআন শিক্ষা করে এবং অন্যকে শিক্ষা দেয়।"
          </h3>
          <div className="w-12 h-0.5 bg-secondary/30 mb-4"></div>
          <p className="text-on-secondary-fixed-variant font-sans font-bold italic">— আল-হাদিস (বুখারী)</p>
          <div className="mt-12 w-full">
            <img
              alt="Students Reading"
              className="w-full h-48 object-cover rounded-xl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBj3Sz0eKsw_lYyv7E8WXudu0gxlCO7I2HC8cD02aO-FEk9Gb_CyRV6h8QCQllyfMlpfLExl3Wu3DLILRVEx36a3J44lpzKUFucEs21_lVLSEvNgZgaqU183PcNCz2fRjH5QofQBaRjigtvhQcRQSVyQJgUzHc8uod78jVTLkkAzue6yDVuCVIS3nsdi2UOuM0ZIqvN9v6HATtujr3Y5kPO0_gCtFUiBemeH1Z-5YTyO_JeHMTus4E6ro6MRC8bCd9xcWFpX2F1OIfp"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bengali font-bold text-on-surface mb-4">আমাদের শিক্ষকবৃন্দ</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.teachers.map((teacher: any) => (
              <Link key={teacher.id} to={`/teacher/${teacher.id}`} className="text-center group block">
                <div className="relative mb-4 inline-block">
                  <img src={teacher.image} alt={teacher.name} className="w-40 h-40 rounded-full object-cover border-4 border-primary/10 group-hover:border-primary transition-all duration-300" />
                  <div className="absolute inset-0 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-primary/60 px-2 py-1 rounded-full backdrop-blur-sm">বিস্তারিত দেখুন</span>
                  </div>
                </div>
                <h3 className="text-xl font-bengali font-bold text-primary">{teacher.name}</h3>
                <p className="text-on-surface-variant font-bengali text-sm">{teacher.designation}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Students Section */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bengali font-bold text-on-surface mb-4">আমাদের ছাত্রবৃন্দ</h2>
            <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
            <p className="mt-4 text-on-surface-variant font-bengali">মাদরাসার কৃতি ও নিয়মিত ছাত্রদের তালিকা</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-12">
            {data.admissions
              ?.filter((a: any) => a.status === "approved")
              .slice(0, 6)
              .map((student: any) => (
                <div key={student.id} className="bg-white p-4 rounded-xl shadow-sm border border-outline-variant/10 text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-surface-container overflow-hidden border-2 border-primary/10">
                    {student.photoUrl ? (
                      <img src={student.photoUrl} alt={student.studentNameBn} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-primary/20">
                        <span className="material-symbols-outlined text-3xl">person</span>
                      </div>
                    )}
                  </div>
                  <h4 className="font-bengali font-bold text-primary text-sm line-clamp-1">{student.studentNameBn}</h4>
                  <p className="text-[10px] text-on-surface-variant font-bengali">{student.classToAdmit}</p>
                </div>
              ))}
          </div>

          <div className="flex justify-center">
            <Link 
              to="/students" 
              className="group relative inline-flex items-center gap-3 bg-primary text-on-primary px-8 py-4 rounded-xl font-bengali font-bold text-xl hover:bg-tertiary transition-all duration-300 shadow-xl hover:shadow-primary/20"
            >
              <span className="material-symbols-outlined">groups</span>
              সম্পূর্ণ ছাত্র তালিকা দেখুন
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_right_alt</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {data.settings.gallery && data.settings.gallery.length > 0 && (
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bengali font-bold text-on-surface mb-4">ফটো গ্যালারি</h2>
              <div className="w-24 h-1 bg-secondary mx-auto rounded-full"></div>
              <p className="mt-4 text-on-surface-variant font-bengali">ছবির ওপর ক্লিক করে বড় করে দেখুন</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {data.settings.gallery.map((img: string, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedImage(img)}
                  className="relative group cursor-pointer aspect-[4/3] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-4 border-white bg-surface-container-highest"
                >
                  <img 
                    src={img} 
                    alt={`Gallery ${idx}`} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <ZoomIn size={28} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Lightbox */}
          <AnimatePresence>
            {selectedImage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
                className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
              >
                <button 
                  className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 bg-white/10 rounded-full"
                  onClick={() => setSelectedImage(null)}
                >
                  <X size={32} />
                </button>
                <motion.img
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  src={selectedImage}
                  alt="Full view"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bengali font-bold text-on-surface mb-4">যোগাযোগ</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            <p className="mt-6 text-on-surface-variant font-bengali text-lg max-w-2xl mx-auto">
              যেকোনো তথ্য বা জিজ্ঞাসার জন্য আমাদের সাথে যোগাযোগ করুন।
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/10">
                <div className="space-y-8">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">location_on</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-on-surface font-bengali mb-1">ঠিকানা</h4>
                      <p className="text-on-surface-variant font-bengali leading-relaxed">{data.settings.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">call</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-on-surface font-bengali mb-1">ফোন নম্বর</h4>
                      <p className="text-on-surface-variant font-sans leading-relaxed">{data.settings.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">mail</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-on-surface font-bengali mb-1">ইমেইল</h4>
                      <p className="text-on-surface-variant font-sans leading-relaxed">{data.settings.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="w-full h-full min-h-[400px] rounded-3xl overflow-hidden shadow-xl border border-outline-variant/20 bg-surface-container flex items-center justify-center">
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

      {/* Admission Section */}
      <section id="admission" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bengali font-bold text-primary mb-6">ভর্তি সংক্রান্ত তথ্য</h2>
              <div className="w-20 h-1 bg-secondary mb-8 rounded-full"></div>
              <div className="prose prose-lg font-bengali text-on-surface-variant leading-relaxed whitespace-pre-line">
                {data.admissionInfo}
              </div>
              <div className="mt-10 flex gap-4">
                <Link to="/admission" className="bg-primary text-on-primary px-8 py-4 rounded-md font-bold text-lg hover:shadow-xl transition-all font-bengali">
                  অনলাইন আবেদন করুন
                </Link>
                <button className="border-2 border-primary text-primary px-8 py-4 rounded-md font-bold text-lg hover:bg-primary/5 transition-all font-bengali">
                  ভর্তি নির্দেশিকা ডাউনলোড
                </button>
              </div>
            </motion.div>
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/5 rounded-3xl -rotate-3"></div>
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuALBdelbkjrAtF6DXj735PznCUji09M01q9UIuTtNDhsvd7ui1fpuDch-VR_Pvlkl_XwNrqXQm_xOk-DDk6RKS7K8P6bfIo_bi6VrhIlPZadxV-e7LQJSjyAMM5WJdsEe5jz4bhRiVOd-XjkbpelogvzTJqxZT-iJeanPG7Mn1EEHh6nHmb5pywZR2o8mRlPNiUaUC4kzI0tPmGTV9hBmBq_p3n1_V0duTD9sHk18OlRWT8EvR7c7xoYaUnPgiXRoWxpd8BuhoQL9i8"
                alt="Admission"
                className="relative rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Donation CTA Section */}
      <section className="py-20 bg-primary-container text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary -skew-x-12 translate-x-1/2 opacity-50"></div>
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bengali font-bold mb-6">দ্বীনি শিক্ষার আলো ছড়িয়ে দিতে আপনার অংশগ্রহণ আমাদের কাম্য</h2>
            <p className="text-on-primary-container/80 mb-8 text-lg font-bengali leading-relaxed">{data.admissionInfo}</p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setIsDonationModalOpen(true)}
                className="bg-secondary-container text-on-secondary-container px-10 py-4 rounded-md font-bold text-xl hover:bg-secondary-container/80 transition-all font-bengali shadow-lg"
              >
                অনলাইন দান করুন
              </button>
              <Link to="/hisab" className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-md font-bold text-lg hover:bg-white/20 transition-all font-bengali flex items-center gap-2">
                <span className="material-symbols-outlined">account_balance_wallet</span>
                আর্থিক স্বচ্ছতা ও হিসাব
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img alt="Library" className="rounded-xl w-40 h-40 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALBdelbkjrAtF6DXj735PznCUji09M01q9UIuTtNDhsvd7ui1fpuDch-VR_Pvlkl_XwNrqXQm_xOk-DDk6RKS7K8P6bfIo_bi6VrhIlPZadxV-e7LQJSjyAMM5WJdsEe5jz4bhRiVOd-XjkbpelogvzTJqxZT-iJeanPG7Mn1EEHh6nHmb5pywZR2o8mRlPNiUaUC4kzI0tPmGTV9hBmBq_p3n1_V0duTD9sHk18OlRWT8EvR7c7xoYaUnPgiXRoWxpd8BuhoQL9i8" referrerPolicy="no-referrer" />
              <img alt="Student" className="rounded-xl w-40 h-60 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCmQuV9U9PZN3KHleOHMgLT2l1UE0CM5Vm2rhnm37zac2MGUQIIEcjPzll8Q5Uan41UlA4DgW0cTz_aMKX7vnYBuuMTv-vTB0LwTf91-Vuvr8ll4kJcBT9VWbdbqGaYWwyKqGFjII49zyiUt_n6QAzgs4swd3CjBl_eux1-cUHIBMx5ehiV6DCQ2qwxjn1itGYb1pa3FQZ_Ky-4Kz-IH7JOMDgJL5dyhs39M0588YAEyHKAw6S_i41giPs91o5rzcJxRfxTfjNI4Dv4" referrerPolicy="no-referrer" />
            </div>
            <div className="space-y-4 pt-8">
              <img alt="Prayer" className="rounded-xl w-40 h-60 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCMdueizx6Sncz4O5AXVS0PN7HsGwJWwzW0FHEVdRYklJ7Se2A293Li1cXvTWH8PG-c-vNtIByqY-oIgCETzSNklhKGGCGxhJLdVpYL42Yz468v56IC4PpMx1G4M2k3SgjhOgn1rEI8ofsrK2WRqfVeDy12dF857_nKpXPCx6B5FahwrTi3TWNJyuJmm_YZzFCxthtDNGN_Q08aqSDqFOLz891ciCCWX9Y08btx7bgOvYl52WhmMkh7I38DLxvr2Ina4fhrhH4J0Ect" referrerPolicy="no-referrer" />
              <img alt="Campus" className="rounded-xl w-40 h-40 object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIAUF4n_iThVqwd0Kmig7Gmm-VWlLRiIABU2gxdG6M8IH89kCLTVBJho-qFoliPpqiwhLV5mGcQyQIqmHquKMk0is5Uc1tG2M1uxy_k0Nyui_mMCEab01sdNNN292tQt8C611cqR3YXWgzPbKKcja81Nmz1OlRBJz-QxdwzX_wtmbttFD8tT6vV6S9cXvTI5Rw6zRdcUAc0RnXoA23i5xeRlF10nAInvcg6jp9qqhqZN-cDrFj-GoMKbXDp0HisoVG1sta6fTfh1RX" referrerPolicy="no-referrer" />
            </div>
          </div>
        </div>
      </section>

      {/* Donation Modal */}
      <AnimatePresence>
        {isDonationModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsDonationModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-primary p-8 text-white relative">
                <button 
                  onClick={() => setIsDonationModalOpen(false)}
                  className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
                >
                  <X size={28} />
                </button>
                <h3 className="text-3xl font-bengali font-bold mb-2">অনলাইন দান করুন</h3>
                <p className="text-white/80 font-bengali">মাদরাসার দ্বীনি কাজে আপনার অংশগ্রহণ সদকায়ে জারিয়া হিসেবে গণ্য হবে।</p>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Bank Info */}
                <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/20">
                  <div className="flex items-center gap-3 mb-4 text-primary">
                    <span className="material-symbols-outlined">account_balance</span>
                    <h4 className="text-xl font-bengali font-bold">ব্যাংক একাউন্ট তথ্য</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-on-surface-variant font-bengali">ব্যাংকের নাম:</p>
                      <p className="font-bold text-on-surface font-bengali">{data.donationInfo?.bankName}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant font-bengali">একাউন্ট নাম:</p>
                      <p className="font-bold text-on-surface font-bengali">{data.donationInfo?.accountName}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant font-bengali">একাউন্ট নম্বর:</p>
                      <p className="font-bold text-on-surface font-sans text-lg tracking-wider">{data.donationInfo?.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant font-bengali">শাখা:</p>
                      <p className="font-bold text-on-surface font-bengali">{data.donationInfo?.branch}</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Banking */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 flex flex-col items-center text-center">
                    <img src="https://www.logo.wine/a/logo/BKash/BKash-Logo.wine.svg" alt="bKash" className="h-10 mb-2" />
                    <p className="text-xs text-pink-600 font-bold mb-1">বিকাশ (পার্সোনাল)</p>
                    <p className="font-bold text-on-surface font-sans">{data.donationInfo?.bkash}</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex flex-col items-center text-center">
                    <img src="https://www.logo.wine/a/logo/Nagad/Nagad-Logo.wine.svg" alt="Nagad" className="h-10 mb-2" />
                    <p className="text-xs text-orange-600 font-bold mb-1">নগদ (পার্সোনাল)</p>
                    <p className="font-bold text-on-surface font-sans">{data.donationInfo?.nagad}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center text-center">
                    <div className="h-10 flex items-center justify-center mb-2">
                      <span className="text-blue-600 font-bold text-xl">Rocket</span>
                    </div>
                    <p className="text-xs text-blue-600 font-bold mb-1">রকেট (পার্সোনাল)</p>
                    <p className="font-bold text-on-surface font-sans">{data.donationInfo?.rocket}</p>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <p className="text-on-surface-variant font-bengali text-sm">
                    * টাকা পাঠানোর পর নিশ্চিত করতে মাদরাসা অফিসে যোগাযোগ করুন।
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
