import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, User, ChevronRight, X, Calendar, BookOpen, GraduationCap, Phone, MapPin, Hash } from "lucide-react";
import { useData } from "../context/DataContext";

export function StudentList() {
  const { data, loading } = useData();
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [filterParams, setFilterParams] = useState({
    year: "",
    dept: "",
    jamat: "",
    search: "",
  });

  if (loading || !data) {
    return <div className="min-h-screen flex items-center justify-center font-bengali">লোড হচ্ছে...</div>;
  }

  // Generate a range of years for the dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from(new Set(data.admissions.filter((a: any) => a.status === "approved" && a.year).map((a: any) => a.year))).sort().reverse();
  if (years.length === 0) {
    // Fallback if no years found in data
    for(let i=0; i<5; i++) {
        const y = (currentYear - i).toString();
        if(!years.includes(y)) years.push(y);
    }
  }

  const filteredStudents = data.admissions.filter((app: any) => {
    const isApproved = app.status === "approved";
    const matchesYear = filterParams.year ? app.year === filterParams.year : true;
    const matchesDept = filterParams.dept ? app.department === filterParams.dept : true;
    const matchesJamat = filterParams.jamat ? app.classToAdmit === filterParams.jamat : true;
    const matchesSearch = filterParams.search 
      ? app.studentNameBn.includes(filterParams.search) || 
        app.fatherName.includes(filterParams.search) || 
        (app.roll && app.roll.includes(filterParams.search))
      : true;
    
    return isApproved && matchesYear && matchesDept && matchesJamat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-surface-container-low py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <Users size={32} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bengali font-bold text-primary mb-2">ছাত্র তালিকা</h1>
          <p className="text-on-surface-variant font-bengali">মাদরাসার সকল ছাত্রের তালিকা এখান থেকে দেখুন</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-bengali font-bold text-on-surface">শিক্ষাবর্ষ</label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali"
                value={filterParams.year}
                onChange={(e) => setFilterParams({ ...filterParams, year: e.target.value })}
              >
                <option value="">সকল শিক্ষাবর্ষ</option>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bengali font-bold text-on-surface">বিভাগ</label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali"
                value={filterParams.dept}
                onChange={(e) => setFilterParams({ ...filterParams, dept: e.target.value, jamat: "" })}
              >
                <option value="">সকল বিভাগ</option>
                <option value="হিফজ বিভাগ">হিফজ বিভাগ</option>
                <option value="কিতাব বিভাগ">কিতাব বিভাগ</option>
                <option value="মক্তব বিভাগ">মক্তব বিভাগ</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bengali font-bold text-on-surface">জামাত</label>
              <select
                className="w-full px-4 py-2.5 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali disabled:opacity-50"
                value={filterParams.jamat}
                onChange={(e) => setFilterParams({ ...filterParams, jamat: e.target.value })}
                disabled={!filterParams.dept}
              >
                <option value="">সকল জামাত</option>
                {filterParams.dept === "হিফজ বিভাগ" && (
                  <>
                    <option value="মক্কী">মক্কী</option>
                    <option value="মাদানী">মাদানী</option>
                  </>
                )}
                {filterParams.dept === "কিতাব বিভাগ" && (
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
                {filterParams.dept === "মক্তব বিভাগ" && (
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
              <label className="text-sm font-bengali font-bold text-on-surface">খুঁজুন</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="নাম বা রোল..."
                  className="w-full px-4 py-2.5 pl-10 rounded-lg border border-outline-variant bg-surface-container-lowest outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={filterParams.search}
                  onChange={(e) => setFilterParams({ ...filterParams, search: e.target.value })}
                />
                <Search className="absolute left-3 top-3 text-on-surface-variant" size={18} />
              </div>
            </div>
          </div>
        </div>

        {/* Student Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-outline-variant">
              <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant opacity-20">
                <User size={32} />
              </div>
              <p className="text-on-surface-variant font-bengali">কোন ছাত্র পাওয়া যায়নি।</p>
            </div>
          ) : (
            filteredStudents.map((student: any) => (
              <motion.div
                key={student.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden cursor-pointer group"
                onClick={() => setSelectedStudent(student)}
              >
                <div className="p-5">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center text-primary overflow-hidden border border-primary/10">
                      {student.photoUrl ? (
                        <img src={student.photoUrl} alt={student.studentNameBn} className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bengali font-bold text-lg group-hover:text-primary transition-colors">{student.studentNameBn}</h3>
                      <p className="text-sm text-on-surface-variant font-bengali">{student.classToAdmit}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <Hash size={14} />
                      <span className="font-bengali">রোল:</span>
                      <span className="font-sans font-bold text-primary">{student.roll || "প্রদান করা হয়নি"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant">
                      <User size={14} />
                      <span className="font-bengali">পিতা:</span>
                      <span className="font-bengali">{student.fatherName}</span>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 bg-surface-container-lowest border-t border-outline-variant/5 flex justify-between items-center">
                  <span className="text-xs text-primary font-bold font-bengali">বিস্তারিত দেখুন</span>
                  <ChevronRight size={16} className="text-primary" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute right-4 top-4 p-2 hover:bg-surface-container rounded-full transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-primary/5 flex items-center justify-center text-primary overflow-hidden border-4 border-white shadow-lg">
                    {selectedStudent.photoUrl ? (
                      <img src={selectedStudent.photoUrl} alt={selectedStudent.studentNameBn} className="w-full h-full object-cover" />
                    ) : (
                      <User size={64} />
                    )}
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-bengali font-bold text-primary mb-2">{selectedStudent.studentNameBn}</h2>
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold font-bengali">
                        {selectedStudent.classToAdmit}
                      </span>
                      <span className="px-4 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-bold font-bengali">
                        রোল: {selectedStudent.roll || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bengali font-bold text-on-surface border-b border-outline-variant/10 pb-2 flex items-center gap-2">
                      <User size={20} className="text-primary" /> ব্যক্তিগত তথ্য
                    </h3>
                    <div className="space-y-4">
                      <InfoItem label="পিতার নাম" value={selectedStudent.fatherName} />
                      <InfoItem label="মাতার নাম" value={selectedStudent.motherName} />
                      <InfoItem label="জন্ম তারিখ" value={selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString() : "N/A"} />
                      <InfoItem label="জাতীয়তা" value={selectedStudent.nationality} />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-lg font-bengali font-bold text-on-surface border-b border-outline-variant/10 pb-2 flex items-center gap-2">
                      <GraduationCap size={20} className="text-primary" /> শিক্ষা সংক্রান্ত
                    </h3>
                    <div className="space-y-4">
                      <InfoItem label="বিভাগ" value={selectedStudent.department} />
                      <InfoItem label="শিক্ষাবর্ষ" value={selectedStudent.year} />
                      <InfoItem label="পূর্বের মাদরাসা" value={selectedStudent.previousMadrasa} />
                    </div>
                  </div>

                  <div className="md:col-span-2 space-y-6">
                    <h3 className="text-lg font-bengali font-bold text-on-surface border-b border-outline-variant/10 pb-2 flex items-center gap-2">
                      <MapPin size={20} className="text-primary" /> ঠিকানা ও যোগাযোগ
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoItem label="গ্রাম" value={selectedStudent.village} />
                      <InfoItem label="ডাকঘর" value={selectedStudent.postOffice} />
                      <InfoItem label="উপজেলা" value={selectedStudent.upazila} />
                      <InfoItem label="জেলা" value={selectedStudent.district} />
                      <InfoItem label="মোবাইল" value={selectedStudent.contactNumber} isSans />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoItem({ label, value, isSans = false }: { label: string, value: string, isSans?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-on-surface-variant font-bengali font-bold uppercase tracking-wider">{label}</span>
      <span className={`text-base text-on-surface font-bold ${isSans ? 'font-sans' : 'font-bengali'}`}>{value || "N/A"}</span>
    </div>
  );
}

function Users({ size }: { size: number }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )
}
