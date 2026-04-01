import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Download, Share2, Printer, GraduationCap, Calendar, User, Hash, Users, ChevronRight, FileText, BookOpen } from "lucide-react";
import { useData } from "../context/DataContext";
// @ts-ignore
import html2pdf from "html2pdf.js";

export function Results() {
  const { data, loading } = useData();
  const [activeTab, setActiveTab] = useState<"individual" | "jamat">("individual");
  const [searchParams, setSearchParams] = useState({
    exam: "",
    year: "",
    roll: "",
    dept: "",
    jamat: "",
  });
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.year) {
      setError("দয়া করে শিক্ষাবর্ষ নির্বাচন করুন।");
      return;
    }
    if (!searchParams.exam) {
      setError("দয়া করে পরীক্ষার নাম নির্বাচন করুন।");
      return;
    }
    if (!searchParams.jamat) {
      setError("দয়া করে জামাত নির্বাচন করুন।");
      return;
    }
    if (!searchParams.roll) {
      setError("দয়া করে রোল নম্বর প্রদান করুন।");
      return;
    }

    const found = data.results.find(
      (r: any) =>
        r.roll === searchParams.roll &&
        r.exam === searchParams.exam &&
        r.year === searchParams.year &&
        r.class === searchParams.jamat &&
        r.published === true
    );

    if (found) {
      // Try to find photoUrl and updated names from admissions if not present in result
      let photoUrl = found.photoUrl;
      let name = found.name;
      let fatherName = found.fatherName;
      if (data.admissions) {
        const student = data.admissions.find((a: any) => a.id === found.admissionId || (!found.admissionId && a.studentNameBn === found.name && a.classToAdmit === found.class));
        if (student) {
          if (student.photoUrl) photoUrl = student.photoUrl;
          if (student.studentNameBn) name = student.studentNameBn;
          if (student.fatherName) fatherName = student.fatherName;
        }
      }
      setResult({ ...found, photoUrl, name, fatherName });
      setError("");
    } else {
      setResult(null);
      setError("দুঃখিত! এই রোল নম্বরের কোনো ফলাফল পাওয়া যায়নি অথবা এখনো পাবলিশ হয়নি।");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Temporarily hide elements with print:hidden class for PDF generation
    const hiddenElements = element.querySelectorAll('.print\\:hidden');
    hiddenElements.forEach((el: any) => el.style.display = 'none');

    const opt = {
      margin:       0.5,
      filename:     filename,
      image:        { type: 'jpeg' as const, quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in' as const, format: 'a4', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Restore hidden elements
      hiddenElements.forEach((el: any) => el.style.display = '');
    });
  };

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center font-bengali">লোড হচ্ছে...</div>;

  // Generate a range of years for the dropdown (past and future)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => (currentYear - 5 + i).toString());
  const exams = Array.from(new Set(data.results.map((r: any) => r.exam))).filter(Boolean);

  const filteredJamatResults = data.results.filter(
    (r: any) => 
      r.class === searchParams.jamat && 
      r.exam === searchParams.exam && 
      r.year === searchParams.year &&
      r.published === true
  ).map((r: any) => {
    let photoUrl = r.photoUrl;
    let name = r.name;
    let fatherName = r.fatherName;
    if (data.admissions) {
      const student = data.admissions.find((a: any) => a.id === r.admissionId || (!r.admissionId && a.studentNameBn === r.name && a.classToAdmit === r.class));
      if (student) {
        if (student.photoUrl) photoUrl = student.photoUrl;
        if (student.studentNameBn) name = student.studentNameBn;
        if (student.fatherName) fatherName = student.fatherName;
      }
    }
    return { ...r, photoUrl, name, fatherName };
  });

  return (
    <div className="min-h-screen bg-surface-container-low py-12 px-4 md:px-8 print:bg-transparent print:py-0 print:px-0">
      <div className="max-w-5xl mx-auto print:max-w-none">
        {/* Header */}
        <div className="text-center mb-10 print:hidden">
          <div className="w-16 h-16 bg-[#005d421a] rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bengali font-bold text-primary mb-2">পরীক্ষার ফলাফল</h1>
          <p className="text-on-surface-variant font-bengali">আপনার কাঙ্ক্ষিত ফলাফলটি এখান থেকে খুঁজে নিন</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8 print:hidden">
          <div className="bg-white p-1 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] border border-[#bdc9c133] flex gap-1">
            <button
              onClick={() => { setActiveTab("individual"); setResult(null); setError(""); }}
              className={`px-6 py-2.5 rounded-lg font-bengali font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === "individual" ? "bg-primary text-on-primary shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]" : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <User size={18} /> ব্যক্তিগত ফলাফল
            </button>
            <button
              onClick={() => { setActiveTab("jamat"); setResult(null); setError(""); }}
              className={`px-6 py-2.5 rounded-lg font-bengali font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === "jamat" ? "bg-primary text-on-primary shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]" : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <Users size={18} /> জামাত ভিত্তিক ফলাফল
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "individual" ? (
            <motion.div
              key="individual"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              {/* Individual Search Form */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-[#bdc9c133] print:hidden">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-bengali font-bold text-on-surface">শিক্ষাবর্ষ</label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali"
                      value={searchParams.year}
                      onChange={(e) => setSearchParams({ ...searchParams, year: e.target.value })}
                    >
                      <option value="">নির্বাচন করুন</option>
                      {years.map(year => <option key={year}>{year}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bengali font-bold text-on-surface">পরীক্ষার নাম</label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali disabled:opacity-50 disabled:cursor-not-allowed"
                      value={searchParams.exam}
                      onChange={(e) => setSearchParams({ ...searchParams, exam: e.target.value })}
                      disabled={!searchParams.year}
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="প্রথম সাময়িক পরীক্ষা">প্রথম সাময়িক পরীক্ষা</option>
                      <option value="দ্বিতীয় সাময়িক পরীক্ষা">দ্বিতীয় সাময়িক পরীক্ষা</option>
                      <option value="বার্ষিক পরীক্ষা">বার্ষিক পরীক্ষা</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bengali font-bold text-on-surface">বিভাগ</label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali disabled:opacity-50 disabled:cursor-not-allowed"
                      value={searchParams.dept}
                      onChange={(e) => setSearchParams({ ...searchParams, dept: e.target.value, jamat: "" })}
                      disabled={!searchParams.exam}
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="হিফজ বিভাগ">হিফজ বিভাগ</option>
                      <option value="কিতাব বিভাগ">কিতাব বিভাগ</option>
                      <option value="মক্তব বিভাগ">মক্তব বিভাগ</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bengali font-bold text-on-surface">জামাত</label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali disabled:opacity-50 disabled:cursor-not-allowed"
                      value={searchParams.jamat}
                      onChange={(e) => setSearchParams({ ...searchParams, jamat: e.target.value })}
                      disabled={!searchParams.dept}
                    >
                      <option value="">নির্বাচন করুন</option>
                      {searchParams.dept === "হিফজ বিভাগ" && (
                        <>
                          <option value="মক্কী">মক্কী</option>
                          <option value="মাদানী">মাদানী</option>
                        </>
                      )}
                      {searchParams.dept === "কিতাব বিভাগ" && (
                        <>
                          <option value="খুসূসী">খুসূসী</option>
                          <option value="ইবতেদায়ী">ইবতেদায়ী</option>
                          <option value="মিজান">মিজান</option>
                          <option value="মুতাওয়াসসিতাহ">মুতাওয়াসসিতাহ</option>
                          <option value="হেদায়াতুন নাহু">হেদায়াতুন নাহু</option>
                          <option value="সানাবিয়া">সানাবিয়া</option>
                          <option value="সানাবিয়া উলিয়া">সানাবিয়া উলিয়া</option>
                          <option value="ফজীলত ১">ফজীলত ১</option>
                          <option value="ফজীলত ২">ফজীলত ২</option>
                          <option value="তাকমীল">তাকমীল</option>
                        </>
                      )}
                      {searchParams.dept === "মক্তব বিভাগ" && (
                        <>
                          <option value="নার্সারী">নার্সারী</option>
                          <option value="প্রথম">প্রথম</option>
                          <option value="দ্বিতীয়">দ্বিতীয়</option>
                          <option value="তৃতীয়">তৃতীয়</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bengali font-bold text-on-surface">রোল নম্বর</label>
                    <div className="relative">
                        <input
                          type="text"
                          placeholder="উদা: ১০১"
                          className="w-full px-4 py-3 pl-10 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali disabled:opacity-50 disabled:cursor-not-allowed"
                          value={searchParams.roll}
                          onChange={(e) => setSearchParams({ ...searchParams, roll: e.target.value })}
                          disabled={!searchParams.jamat}
                        />
                      <Hash className="absolute left-3 top-3.5 text-on-surface-variant" size={18} />
                    </div>
                  </div>
                  <div className="md:col-span-2 lg:col-span-5">
                    <button
                      type="submit"
                      className="w-full bg-primary text-on-primary py-4 rounded-lg font-bengali font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#005d42e6] transition-all shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]"
                    >
                      <Search size={20} /> ফলাফল দেখুন
                    </button>
                  </div>
                </form>
                {error && <p className="mt-4 text-[#ef4444] text-center font-bengali">{error}</p>}
              </div>

              {/* Individual Result Display */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden border border-[#bdc9c133] print:shadow-none print:border-none"
                  id="printable-result"
                >
                  {/* Result Header */}
                  <div className="bg-primary p-8 text-white text-center relative print:bg-transparent print:text-black print:border-b print:border-[#bdc9c133]">
                    <div className="absolute top-0 left-0 w-full h-full arabesque-pattern opacity-10 print:hidden"></div>
                    <h2 className="text-3xl font-bengali font-bold mb-2 relative z-10 print:text-black">{data.settings.siteTitle}</h2>
                    <p className="text-on-primary-container font-bengali relative z-10 print:text-black">{result.exam} - {result.year}</p>
                    <div className="mt-6 flex justify-center gap-8 relative z-10">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase opacity-70 print:text-black">Roll No:</span>
                        <span className="text-xl font-bold print:text-black">{result.roll}</span>
                      </div>
                      <div className="w-px h-10 bg-[#ffffff33] print:bg-[#00000033]"></div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase opacity-70 print:text-black">Merit Position:</span>
                        <span className="text-xl font-bold print:text-black">{result.position}</span>
                      </div>
                    </div>
                  </div>

                  {/* Student Info Grid */}
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-surface-container-lowest border-b border-[#bdc9c11a]">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#005d421a] flex items-center justify-center text-primary overflow-hidden border border-[#005d4233]">
                        {result.photoUrl ? (
                          <img src={result.photoUrl} alt={result.name} className="w-full h-full object-cover" />
                        ) : (
                          <User size={24} />
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant uppercase font-bold">ছাত্রের নাম</p>
                        <p className="text-xl font-bengali font-bold text-on-surface">{result.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#005d421a] flex items-center justify-center text-primary">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant uppercase font-bold">পিতার নাম</p>
                        <p className="text-xl font-bengali font-bold text-on-surface">{result.fatherName || "অজানা"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#904d001a] flex items-center justify-center text-secondary">
                        <BookOpen size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant uppercase font-bold">জামাত</p>
                        <p className="text-xl font-bengali font-bold text-on-surface">{result.class}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#904d001a] flex items-center justify-center text-secondary">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <p className="text-xs text-on-surface-variant uppercase font-bold">শিক্ষাবর্ষ</p>
                        <p className="text-xl font-bengali font-bold text-on-surface">{result.year}</p>
                      </div>
                    </div>
                  </div>

                  {/* Marks Table */}
                  <div className="p-8">
                    <h3 className="text-xl font-bengali font-bold text-primary mb-6 flex items-center gap-2">
                      <span className="material-symbols-outlined">analytics</span> বিষয়ভিত্তিক নম্বরপত্র
                    </h3>
                    <div className="overflow-hidden rounded-xl border border-[#bdc9c133] print:border-[#00000033]">
                      <table className="w-full text-left border-collapse font-bengali">
                        <thead className="bg-surface-container-high text-on-surface text-base uppercase print:bg-transparent print:text-black">
                          <tr>
                            <th className="px-6 py-4 border-b">বিষয়</th>
                            <th className="px-6 py-4 border-b text-center">পূর্ণমান</th>
                            <th className="px-6 py-4 border-b text-center">প্রাপ্ত নম্বর</th>
                            <th className="px-6 py-4 border-b text-center">গ্রেড</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(result.marks).map(([subject, marks]: [string, any], idx) => (
                            <tr key={idx} className="hover:bg-surface-container-lowest transition-colors">
                              <td className="px-6 py-4 border-b font-bold capitalize">{subject}</td>
                              <td className="px-6 py-4 border-b text-center text-on-surface-variant">100</td>
                              <td className="px-6 py-4 border-b text-center font-bold text-primary">{marks}</td>
                              <td className="px-6 py-4 border-b text-center">
                                <span className="px-3 py-1 bg-[#005d421a] text-primary rounded-full text-xs font-bold">
                                  {marks >= 80 ? "A+" : marks >= 70 ? "A" : marks >= 60 ? "A-" : "B"}
                                </span>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-[#005d420d]">
                            <td className="px-6 py-4 font-bold text-primary">সর্বমোট নম্বর</td>
                            <td className="px-6 py-4 text-center font-bold text-on-surface-variant">-</td>
                            <td className="px-6 py-4 text-center font-bold text-primary text-xl">{result.total}</td>
                            <td className="px-6 py-4 text-center font-bold text-secondary">পাস</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-10 flex flex-wrap gap-4 print:hidden">
                      <button
                        onClick={handlePrint}
                        className="flex-1 bg-surface-container-high text-on-surface py-3 rounded-lg font-bengali font-bold flex items-center justify-center gap-2 hover:bg-surface-container-highest transition-all"
                      >
                        <Printer size={18} /> প্রিন্ট করুন
                      </button>
                      <button 
                        onClick={() => handleDownloadPdf('printable-result', `Result_${result.roll}_${result.exam}.pdf`)}
                        className="flex-1 bg-secondary text-on-secondary py-3 rounded-lg font-bengali font-bold flex items-center justify-center gap-2 hover:bg-[#904d00e6] transition-all"
                      >
                        <Download size={18} /> পিডিএফ ডাউনলোড
                      </button>
                      <button className="w-12 h-12 bg-[#005d421a] text-primary rounded-lg flex items-center justify-center hover:bg-[#005d4233] transition-all">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Footer Note */}
                  <div className="p-6 bg-surface-container-lowest border-t border-[#bdc9c11a] text-center">
                    <p className="text-xs text-on-surface-variant font-bengali italic">
                      * এটি একটি কম্পিউটার জেনারেটেড কপি। কোনো ভুল পরিলক্ষিত হলে মাদরাসা কর্তৃপক্ষের সাথে যোগাযোগ করুন।
                    </p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="jamat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Jamat Selection Form */}
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-[#bdc9c133] print:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                  <div className="space-y-2">
                    <label className="text-sm font-bengali font-bold text-on-surface">শিক্ষাবর্ষ</label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali"
                      value={searchParams.year}
                      onChange={(e) => setSearchParams({ ...searchParams, year: e.target.value })}
                    >
                      <option value="">নির্বাচন করুন</option>
                      {years.map(year => <option key={year}>{year}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bengali font-bold text-on-surface">পরীক্ষার নাম</label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali disabled:opacity-50 disabled:cursor-not-allowed"
                      value={searchParams.exam}
                      onChange={(e) => setSearchParams({ ...searchParams, exam: e.target.value })}
                      disabled={!searchParams.year}
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="প্রথম সাময়িক পরীক্ষা">প্রথম সাময়িক পরীক্ষা</option>
                      <option value="দ্বিতীয় সাময়িক পরীক্ষা">দ্বিতীয় সাময়িক পরীক্ষা</option>
                      <option value="বার্ষিক পরীক্ষা">বার্ষিক পরীক্ষা</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bengali font-bold text-on-surface">বিভাগ</label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali disabled:opacity-50 disabled:cursor-not-allowed"
                      value={searchParams.dept}
                      onChange={(e) => setSearchParams({ ...searchParams, dept: e.target.value, jamat: "" })}
                      disabled={!searchParams.exam}
                    >
                      <option value="">নির্বাচন করুন</option>
                      <option value="হিফজ বিভাগ">হিফজ বিভাগ</option>
                      <option value="কিতাব বিভাগ">কিতাব বিভাগ</option>
                      <option value="মক্তব বিভাগ">মক্তব বিভাগ</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bengali font-bold text-on-surface">জামাত নির্বাচন করুন</label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali disabled:opacity-50 disabled:cursor-not-allowed"
                      value={searchParams.jamat}
                      onChange={(e) => setSearchParams({ ...searchParams, jamat: e.target.value })}
                      disabled={!searchParams.dept}
                    >
                      <option value="">নির্বাচন করুন</option>
                      {searchParams.dept === "হিফজ বিভাগ" && (
                        <>
                          <option value="মক্কী">মক্কী</option>
                          <option value="মাদানী">মাদানী</option>
                        </>
                      )}
                      {searchParams.dept === "কিতাব বিভাগ" && (
                        <>
                          <option value="খুসূসী">খুসূসী</option>
                          <option value="ইবতেদায়ী">ইবতেদায়ী</option>
                          <option value="মিজান">মিজান</option>
                          <option value="মুতাওয়াসসিতাহ">মুতাওয়াসসিতাহ</option>
                          <option value="হেদায়াতুন নাহু">হেদায়াতুন নাহু</option>
                          <option value="সানাবিয়া">সানাবিয়া</option>
                          <option value="সানাবিয়া উলিয়া">সানাবিয়া উলিয়া</option>
                          <option value="ফজীলত ১">ফজীলত ১</option>
                          <option value="ফজীলত ২">ফজীলত ২</option>
                          <option value="তাকমীল">তাকমীল</option>
                        </>
                      )}
                      {searchParams.dept === "মক্তব বিভাগ" && (
                        <>
                          <option value="নার্সারী">নার্সারী</option>
                          <option value="প্রথম">প্রথম</option>
                          <option value="দ্বিতীয়">দ্বিতীয়</option>
                          <option value="তৃতীয়">তৃতীয়</option>
                        </>
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {/* Jamat Results Display */}
              {searchParams.year && searchParams.exam && searchParams.jamat && (
                <motion.div
                  id="printable-jamat-result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-[#bdc9c133] overflow-hidden print:shadow-none print:border-none"
                >
                  <div className="p-6 bg-[#005d420d] border-b border-[#bdc9c11a] flex flex-col md:flex-row justify-between items-center gap-4 print:bg-transparent print:border-none print:p-0 print:mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center print:hidden">
                        <FileText size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bengali font-bold text-primary mb-1 hidden print:block">{data.settings.siteTitle}</h2>
                        <h3 className="text-lg font-bengali font-bold text-primary">{searchParams.jamat} - ফলাফল তালিকা</h3>
                        <p className="text-xs text-on-surface-variant font-bengali">{searchParams.exam} | {searchParams.year}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 print:hidden">
                      <button 
                        onClick={handlePrint}
                        className="bg-white px-4 py-2 rounded-lg border border-outline-variant text-sm font-bengali font-bold flex items-center gap-2 hover:bg-surface-container transition-all"
                      >
                        <Printer size={16} /> তালিকা প্রিন্ট করুন
                      </button>
                      <button 
                        onClick={() => handleDownloadPdf('printable-jamat-result', `Jamat_Result_${searchParams.jamat}_${searchParams.exam}.pdf`)}
                        className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bengali font-bold flex items-center gap-2 hover:bg-[#904d00e6] transition-all"
                      >
                        <Download size={16} /> পিডিএফ ডাউনলোড
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full text-left border-collapse font-bengali print:border print:border-[#00000033]">
                      <thead className="bg-surface-container-high text-on-surface text-xs uppercase print:bg-transparent print:text-black">
                        <tr>
                          <th className="px-4 py-4 border-b">রোল</th>
                          <th className="px-4 py-4 border-b">নাম</th>
                          <th className="px-4 py-4 border-b">পিতার নাম</th>
                          {/* Dynamic Subject Headers */}
                          {filteredJamatResults.length > 0 && 
                            Object.keys(filteredJamatResults[0].marks || {}).map(subject => (
                              <th key={subject} className="px-2 py-4 border-b text-center">{subject}</th>
                            ))
                          }
                          <th className="px-4 py-4 border-b text-center">মোট নম্বর</th>
                          <th className="px-4 py-4 border-b text-center">অবস্থান</th>
                          <th className="px-4 py-4 border-b text-center print:hidden">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJamatResults.length > 0 ? (
                          filteredJamatResults
                            .sort((a, b) => parseInt(a.roll) - parseInt(b.roll))
                            .map((res, idx) => (
                              <tr key={idx} className="hover:bg-surface-container-lowest transition-colors group text-sm">
                                <td className="px-4 py-4 border-b font-sans font-bold">{res.roll}</td>
                                <td className="px-4 py-4 border-b font-bold text-on-surface">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden border border-outline-variant flex-shrink-0 print:hidden">
                                      {res.photoUrl ? (
                                        <img src={res.photoUrl} alt={res.name} className="w-full h-full object-cover" />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <User size={14} className="text-on-surface-variant" />
                                        </div>
                                      )}
                                    </div>
                                    <span>{res.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 border-b text-on-surface">{res.fatherName || "অজানা"}</td>
                                
                                {/* Dynamic Subject Marks */}
                                {Object.entries(res.marks || {}).map(([subject, mark]: [string, any]) => (
                                  <td key={subject} className="px-2 py-4 border-b text-center font-sans text-xs">{mark}</td>
                                ))}

                                <td className="px-4 py-4 border-b text-center font-bold text-primary">{res.total}</td>
                                <td className="px-4 py-4 border-b text-center">
                                  <span className="px-2 py-0.5 bg-[#904d001a] text-secondary rounded-full text-[10px] font-bold">
                                    {res.position}
                                  </span>
                                </td>
                                <td className="px-4 py-4 border-b text-center print:hidden">
                                  <button 
                                    onClick={() => {
                                      setResult(res);
                                      setActiveTab("individual");
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="text-primary hover:underline text-xs font-bold flex items-center justify-center gap-1 mx-auto"
                                  >
                                    বিস্তারিত <ChevronRight size={12} />
                                  </button>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={10} className="px-6 py-12 text-center text-on-surface-variant font-bengali">
                              দুঃখিত! এই জামাতের কোনো ফলাফল পাওয়া যায়নি।
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
