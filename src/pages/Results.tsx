import React, { useState } from "react";
import { motion } from "motion/react";
import { Search, Download, Share2, Printer, GraduationCap, Calendar, User, Hash } from "lucide-react";
import { useData } from "../context/DataContext";

export function Results() {
  const { data, loading } = useData();
  const [searchParams, setSearchParams] = useState({
    exam: "বার্ষিক পরীক্ষা ২০২৪",
    year: "২০২৪",
    roll: "",
  });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.roll) {
      setError("দয়া করে রোল নম্বর প্রদান করুন।");
      return;
    }

    const found = data.results.find(
      (r: any) =>
        r.roll === searchParams.roll &&
        r.exam === searchParams.exam &&
        r.year === searchParams.year &&
        r.published === true
    );

    if (found) {
      setResult(found);
      setError("");
    } else {
      setResult(null);
      setError("দুঃখিত! এই রোল নম্বরের কোনো ফলাফল পাওয়া যায়নি অথবা এখনো পাবলিশ হয়নি।");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center font-bengali">লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-surface-container-low py-12 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-4xl font-bengali font-bold text-primary mb-2">পরীক্ষার ফলাফল</h1>
          <p className="text-on-surface-variant font-bengali">আপনার রোল নম্বর দিয়ে ফলাফল অনুসন্ধান করুন</p>
        </div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl border border-outline-variant/20 mb-12"
        >
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <label className="text-sm font-bengali font-bold text-on-surface">পরীক্ষার নাম</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali"
                value={searchParams.exam}
                onChange={(e) => setSearchParams({ ...searchParams, exam: e.target.value })}
              >
                <option>বার্ষিক পরীক্ষা ২০২৪</option>
                <option>অর্ধ-বার্ষিক পরীক্ষা ২০২৪</option>
                <option>নির্বাচনী পরীক্ষা ২০২৪</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bengali font-bold text-on-surface">শিক্ষাবর্ষ</label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali"
                value={searchParams.year}
                onChange={(e) => setSearchParams({ ...searchParams, year: e.target.value })}
              >
                <option>২০২৪</option>
                <option>২০২৩</option>
                <option>২০২২</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bengali font-bold text-on-surface">রোল নম্বর</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="উদা: ১০১"
                  className="w-full px-4 py-3 pl-10 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={searchParams.roll}
                  onChange={(e) => setSearchParams({ ...searchParams, roll: e.target.value })}
                />
                <Hash className="absolute left-3 top-3.5 text-on-surface-variant" size={18} />
              </div>
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                className="w-full bg-primary text-on-primary py-4 rounded-lg font-bengali font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg"
              >
                <Search size={20} /> ফলাফল দেখুন
              </button>
            </div>
          </form>
          {error && <p className="mt-4 text-red-500 text-center font-bengali">{error}</p>}
        </motion.div>

        {/* Result Display */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20 print:shadow-none print:border-none"
            id="printable-result"
          >
            {/* Result Header */}
            <div className="bg-primary p-8 text-white text-center relative">
              <div className="absolute top-0 left-0 w-full h-full arabesque-pattern opacity-10"></div>
              <h2 className="text-3xl font-bengali font-bold mb-2 relative z-10">{data.settings.siteTitle}</h2>
              <p className="text-on-primary-container font-bengali relative z-10">{result.exam} - {result.year}</p>
              <div className="mt-6 flex justify-center gap-8 relative z-10">
                <div className="flex flex-col items-center">
                  <span className="text-xs uppercase opacity-70 mb-1">Roll No</span>
                  <span className="text-xl font-bold">{result.roll}</span>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div className="flex flex-col items-center">
                  <span className="text-xs uppercase opacity-70 mb-1">Merit Position</span>
                  <span className="text-xl font-bold">{result.position}</span>
                </div>
              </div>
            </div>

            {/* Student Info Grid */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-lowest border-b border-outline-variant/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">Student Name</p>
                  <p className="text-xl font-bengali font-bold text-on-surface">{result.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant uppercase font-bold">Academic Year</p>
                  <p className="text-xl font-bengali font-bold text-on-surface">{result.year}</p>
                </div>
              </div>
            </div>

            {/* Marks Table */}
            <div className="p-8">
              <h3 className="text-xl font-bengali font-bold text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">analytics</span> বিষয়ভিত্তিক নম্বরপত্র
              </h3>
              <div className="overflow-hidden rounded-xl border border-outline-variant/20">
                <table className="w-full text-left border-collapse font-bengali">
                  <thead className="bg-surface-container-high text-on-surface text-sm uppercase">
                    <tr>
                      <th className="px-6 py-4 border-b">বিষয়</th>
                      <th className="px-6 py-4 border-b text-center">পূর্ণমান</th>
                      <th className="px-6 py-4 border-b text-center">প্রাপ্ত নম্বর</th>
                      <th className="px-6 py-4 border-b text-center">গ্রেড</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "আল-কুরআন", full: 100, marks: result.marks.quran },
                      { name: "আল-হাদীস", full: 100, marks: result.marks.hadith },
                      { name: "আল-ফিকহ", full: 100, marks: result.marks.fiqh },
                      { name: "বাংলা ও সাহিত্য", full: 100, marks: result.marks.bangla },
                    ].map((subject, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-6 py-4 border-b font-bold">{subject.name}</td>
                        <td className="px-6 py-4 border-b text-center text-on-surface-variant">{subject.full}</td>
                        <td className="px-6 py-4 border-b text-center font-bold text-primary">{subject.marks}</td>
                        <td className="px-6 py-4 border-b text-center">
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                            {subject.marks >= 80 ? "A+" : subject.marks >= 70 ? "A" : subject.marks >= 60 ? "A-" : "B"}
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-primary/5">
                      <td className="px-6 py-4 font-bold text-primary">সর্বমোট নম্বর</td>
                      <td className="px-6 py-4 text-center font-bold text-on-surface-variant">৪০০</td>
                      <td className="px-6 py-4 text-center font-bold text-primary text-xl">{result.total}</td>
                      <td className="px-6 py-4 text-center font-bold text-secondary">পাস</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-wrap gap-4 no-print">
                <button
                  onClick={handlePrint}
                  className="flex-1 bg-surface-container-high text-on-surface py-3 rounded-lg font-bengali font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all"
                >
                  <Printer size={18} /> প্রিন্ট করুন
                </button>
                <button className="flex-1 bg-secondary text-on-secondary py-3 rounded-lg font-bengali font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all">
                  <Download size={18} /> পিডিএফ ডাউনলোড
                </button>
                <button className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center hover:bg-primary/20 transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Footer Note */}
            <div className="p-6 bg-surface-container-lowest border-t border-outline-variant/10 text-center">
              <p className="text-xs text-on-surface-variant font-bengali italic">
                * এটি একটি কম্পিউটার জেনারেটেড কপি। কোনো ভুল পরিলক্ষিত হলে মাদরাসা কর্তৃপক্ষের সাথে যোগাযোগ করুন।
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
