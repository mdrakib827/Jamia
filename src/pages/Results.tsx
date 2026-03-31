import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Download, Share2, Printer, GraduationCap, Calendar, User, Hash, Users, ChevronRight, FileText } from "lucide-react";
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

  const handleDownloadPdf = (elementId: string, filename: string) => {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Temporarily hide elements with print:hidden class for PDF generation
    const hiddenElements = element.querySelectorAll('.print\\:hidden');
    hiddenElements.forEach((el: any) => el.style.display = 'none');

    const opt = {
      margin:       0.5,
      filename:     filename,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
      // Restore hidden elements
      hiddenElements.forEach((el: any) => el.style.display = '');
    });
  };

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center font-bengali">লোড হচ্ছে...</div>;

  // Get unique jamats from results
  const jamats = Array.from(new Set(data.results.map((r: any) => r.class))).filter(Boolean);
  const exams = Array.from(new Set(data.results.map((r: any) => r.exam))).filter(Boolean);
  const years = Array.from(new Set(data.results.map((r: any) => r.year))).filter(Boolean);

  const filteredJamatResults = data.results.filter(
    (r: any) => 
      r.class === searchParams.jamat && 
      r.exam === searchParams.exam && 
      r.year === searchParams.year &&
      r.published === true
  );

  return (
    <div className="min-h-screen bg-surface-container-low py-12 px-4 md:px-8 print:bg-transparent print:py-0 print:px-0">
      <div className="max-w-5xl mx-auto print:max-w-none">
        {/* Header */}
        <div className="text-center mb-10 print:hidden">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bengali font-bold text-primary mb-2">পরীক্ষার ফলাফল</h1>
          <p className="text-on-surface-variant font-bengali">আপনার কাঙ্ক্ষিত ফলাফলটি এখান থেকে খুঁজে নিন</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8 print:hidden">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-outline-variant/20 flex gap-1">
            <button
              onClick={() => { setActiveTab("individual"); setResult(null); setError(""); }}
              className={`px-6 py-2.5 rounded-lg font-bengali font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === "individual" ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:bg-surface-container"
              }`}
            >
              <User size={18} /> ব্যক্তিগত ফলাফল
            </button>
            <button
              onClick={() => { setActiveTab("jamat"); setResult(null); setError(""); }}
              className={`px-6 py-2.5 rounded-lg font-bengali font-bold text-sm transition-all flex items-center gap-2 ${
                activeTab === "jamat" ? "bg-primary text-on-primary shadow-md" : "text-on-surface-variant hover:bg-surface-container"
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
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-outline-variant/20 print:hidden">
                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
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
                    <label className="text-sm font-bengali font-bold text-on-surface">জামাত</label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali disabled:opacity-50 disabled:cursor-not-allowed"
                      value={searchParams.jamat}
                      onChange={(e) => setSearchParams({ ...searchParams, jamat: e.target.value })}
                      disabled={!searchParams.exam}
                    >
                      <option value="">নির্বাচন করুন</option>
                      {jamats.map(jamat => <option key={jamat}>{jamat}</option>)}
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
                  <div className="md:col-span-2 lg:col-span-4">
                    <button
                      type="submit"
                      className="w-full bg-primary text-on-primary py-4 rounded-lg font-bengali font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg"
                    >
                      <Search size={20} /> ফলাফল দেখুন
                    </button>
                  </div>
                </form>
                {error && <p className="mt-4 text-red-500 text-center font-bengali">{error}</p>}
              </div>

              {/* Individual Result Display */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-outline-variant/20 print:shadow-none print:border-none"
                  id="printable-result"
                >
                  {/* Result Header */}
                  <div className="bg-primary p-8 text-white text-center relative print:bg-transparent print:text-black print:border-b print:border-outline-variant/20">
                    <div className="absolute top-0 left-0 w-full h-full arabesque-pattern opacity-10 print:hidden"></div>
                    <h2 className="text-3xl font-bengali font-bold mb-2 relative z-10 print:text-black">{data.settings.siteTitle}</h2>
                    <p className="text-on-primary-container font-bengali relative z-10 print:text-black">{result.exam} - {result.year}</p>
                    <div className="mt-6 flex justify-center gap-8 relative z-10">
                      <div className="flex flex-col items-center">
                        <span className="text-xs uppercase opacity-70 mb-1 print:text-black">Roll No</span>
                        <span className="text-xl font-bold print:text-black">{result.roll}</span>
                      </div>
                      <div className="w-px h-10 bg-white/20 print:bg-black/20"></div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs uppercase opacity-70 mb-1 print:text-black">Merit Position</span>
                        <span className="text-xl font-bold print:text-black">{result.position}</span>
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
                    <div className="overflow-hidden rounded-xl border border-outline-variant/20 print:border-black/20">
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
                                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                                  {marks >= 80 ? "A+" : marks >= 70 ? "A" : marks >= 60 ? "A-" : "B"}
                                </span>
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-primary/5">
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
                        className="flex-1 bg-secondary text-on-secondary py-3 rounded-lg font-bengali font-bold flex items-center justify-center gap-2 hover:bg-secondary/90 transition-all"
                      >
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
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-outline-variant/20 print:hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
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
                    <label className="text-sm font-bengali font-bold text-on-surface">জামাত নির্বাচন করুন</label>
                    <select
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali disabled:opacity-50 disabled:cursor-not-allowed"
                      value={searchParams.jamat}
                      onChange={(e) => setSearchParams({ ...searchParams, jamat: e.target.value })}
                      disabled={!searchParams.exam}
                    >
                      <option value="">নির্বাচন করুন</option>
                      {jamats.map(jamat => <option key={jamat}>{jamat}</option>)}
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
                  className="bg-white rounded-2xl shadow-xl border border-outline-variant/20 overflow-hidden print:shadow-none print:border-none"
                >
                  <div className="p-6 bg-primary/5 border-b border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4 print:bg-transparent print:border-none print:p-0 print:mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary text-on-primary rounded-lg flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
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
                        className="bg-secondary text-on-secondary px-4 py-2 rounded-lg text-sm font-bengali font-bold flex items-center gap-2 hover:bg-secondary/90 transition-all"
                      >
                        <Download size={16} /> পিডিএফ ডাউনলোড
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto print:overflow-visible">
                    <table className="w-full text-left border-collapse font-bengali print:border print:border-black/20">
                      <thead className="bg-surface-container-high text-on-surface text-base uppercase print:bg-transparent print:text-black">
                        <tr>
                          <th className="px-6 py-4 border-b">রোল</th>
                          <th className="px-6 py-4 border-b">নাম</th>
                          <th className="px-6 py-4 border-b text-center">মোট নম্বর</th>
                          <th className="px-6 py-4 border-b text-center">অবস্থান</th>
                          <th className="px-6 py-4 border-b text-center">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredJamatResults.length > 0 ? (
                          filteredJamatResults
                            .sort((a, b) => parseInt(a.roll) - parseInt(b.roll))
                            .map((res, idx) => (
                              <tr key={idx} className="hover:bg-surface-container-lowest transition-colors group">
                                <td className="px-6 py-4 border-b font-sans font-bold">{res.roll}</td>
                                <td className="px-6 py-4 border-b font-bold text-on-surface">{res.name}</td>
                                <td className="px-6 py-4 border-b text-center font-bold text-primary">{res.total}</td>
                                <td className="px-6 py-4 border-b text-center">
                                  <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-xs font-bold">
                                    {res.position}
                                  </span>
                                </td>
                                <td className="px-6 py-4 border-b text-center">
                                  <button 
                                    onClick={() => {
                                      setResult(res);
                                      setActiveTab("individual");
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="text-primary hover:underline text-sm font-bold flex items-center justify-center gap-1 mx-auto"
                                  >
                                    বিস্তারিত <ChevronRight size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant font-bengali">
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
