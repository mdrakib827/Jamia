import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, CheckCircle2, XCircle, Clock, ArrowLeft, ChevronRight, X, User } from "lucide-react";
import { Link } from "react-router-dom";

export function AdmissionStatus() {
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [selectedJamat, setSelectedJamat] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const res = await fetch("/api/data");
      const data = await res.json();
      if (data.admissions) {
        setAdmissions(data.admissions);
      }
    } catch (err) {
      setError("ডেটা লোড করতে সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  // Group admissions by Jamat
  const departments = [
    { name: "হিফজ বিভাগ", classes: ["মক্কী", "মাদানী"] },
    { name: "কিতাব বিভাগ", classes: ["খুসূসী", "ইবতেদায়ী", "মিজান", "মুতাওয়াসসিতাহ", "হেদায়াতুন নাহু", "সানাবিয়া", "সানাবিয়া উলিয়া", "ফজীলত ১", "ফজীলত ২", "তাকমীল"] },
    { name: "মক্তব বিভাগ", classes: ["নার্সারী", "প্রথম", "দ্বিতীয়", "তৃতীয়"] }
  ];
  
  const filteredAdmissions = admissions.filter(app => {
    const matchesJamat = selectedJamat ? app.classToAdmit === selectedJamat : true;
    const matchesSearch = app.studentNameBn.includes(searchTerm) || app.contactNumber.includes(searchTerm);
    return matchesJamat && matchesSearch;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bengali">লোড হচ্ছে...</div>;
  }

  return (
    <div className="min-h-screen bg-surface-container-lowest py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <Link to="/admission" className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all mb-4 font-bengali">
              <ArrowLeft size={20} /> ভর্তি ফরমে ফিরে যান
            </Link>
            <h1 className="text-4xl font-bengali font-bold text-primary">ভর্তি আবেদনের অবস্থা</h1>
          </div>
          
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="নাম বা মোবাইল দিয়ে খুঁজুন..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant focus:ring-2 focus:ring-primary outline-none font-bengali"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Jamat List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bengali font-bold text-on-surface px-2">জামাত সমূহ</h2>
            <div className="flex flex-col gap-6">
              <button
                onClick={() => setSelectedJamat(null)}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-bengali font-bold ${
                  selectedJamat === null ? "bg-primary text-on-primary shadow-lg" : "bg-white border border-outline-variant/10 hover:bg-surface-container text-on-surface-variant"
                }`}
              >
                সব জামাত
                <ChevronRight size={18} />
              </button>
              
              {departments.map((dept) => (
                <div key={dept.name} className="space-y-2">
                  <h3 className="text-sm font-bengali font-bold text-primary px-2 opacity-70 uppercase tracking-wider">{dept.name}</h3>
                  <div className="flex flex-col gap-2">
                    {dept.classes.map((jamat) => (
                      <button
                        key={jamat}
                        onClick={() => setSelectedJamat(jamat)}
                        className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all font-bengali font-bold ${
                          selectedJamat === jamat ? "bg-primary text-on-primary shadow-lg" : "bg-white border border-outline-variant/10 hover:bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {jamat}
                        <div className="flex items-center gap-2">
                          <span className="text-xs opacity-70">({admissions.filter(a => a.classToAdmit === jamat).length})</span>
                          <ChevronRight size={18} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-outline-variant/10 overflow-hidden">
              <div className="p-6 border-b border-outline-variant/10 bg-surface-container-lowest">
                <h2 className="text-xl font-bengali font-bold text-primary">
                  {selectedJamat || "সকল"} জামাতের আবেদনকারী
                </h2>
              </div>
              
              <div className="divide-y divide-outline-variant/5">
                {filteredAdmissions.length === 0 ? (
                  <div className="p-12 text-center text-on-surface-variant font-bengali">
                    কোন আবেদন পাওয়া যায়নি।
                  </div>
                ) : (
                  filteredAdmissions.map((app) => (
                    <div 
                      key={app.id} 
                      className="p-5 flex items-center justify-between hover:bg-surface-container-lowest transition-colors group cursor-pointer"
                      onClick={() => setSelectedStudent(app)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center text-primary">
                          <User size={24} />
                        </div>
                        <div>
                          <h3 className="font-bengali font-bold text-lg group-hover:text-primary transition-colors">{app.studentNameBn}</h3>
                          <p className="text-sm text-on-surface-variant font-sans">{app.contactNumber}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold font-bengali ${
                          app.status === "approved" ? "bg-green-100 text-green-700" : 
                          app.status === "rejected" ? "bg-red-100 text-red-700" : 
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {app.status === "approved" ? "অনুমোদিত" : app.status === "rejected" ? "বাতিল" : "পেন্ডিং"}
                        </span>
                        <ChevronRight className="text-outline-variant group-hover:text-primary transition-all" size={20} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Modal */}
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
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute right-4 top-4 p-2 hover:bg-surface-container rounded-full transition-colors z-10"
              >
                <X size={24} />
              </button>

              <div className="p-8 md:p-10">
                <div className="flex flex-col items-center text-center">
                  {selectedStudent.status === "approved" ? (
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle2 size={48} />
                    </div>
                  ) : selectedStudent.status === "rejected" ? (
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                      <XCircle size={48} />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-6">
                      <Clock size={48} />
                    </div>
                  )}

                  <h2 className="text-2xl font-bengali font-bold mb-2">
                    {selectedStudent.status === "approved" ? "আবেদনটি অনুমোদিত হয়েছে!" : 
                     selectedStudent.status === "rejected" ? "আবেদনটি বাতিল করা হয়েছে।" : 
                     "আবেদনটি প্রক্রিয়াধীন রয়েছে।"}
                  </h2>
                  
                  <div className="mt-8 w-full space-y-4 text-left bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
                    <div className="flex justify-between border-b border-outline-variant/5 pb-3">
                      <span className="text-on-surface-variant font-bengali">নাম:</span>
                      <span className="font-bold font-bengali text-primary">{selectedStudent.studentNameBn}</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/5 pb-3">
                      <span className="text-on-surface-variant font-bengali">জামাত:</span>
                      <span className="font-bold font-bengali">{selectedStudent.classToAdmit}</span>
                    </div>
                    <div className="flex justify-between border-b border-outline-variant/5 pb-3">
                      <span className="text-on-surface-variant font-bengali">পিতার নাম:</span>
                      <span className="font-bold font-bengali">{selectedStudent.fatherName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-on-surface-variant font-bengali">আবেদনের তারিখ:</span>
                      <span className="font-bold font-sans">{new Date(selectedStudent.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    {selectedStudent.status === "approved" && (
                      <p className="text-green-700 font-bengali text-sm leading-relaxed bg-green-50 p-4 rounded-xl border border-green-100">
                        অভিনন্দন! আপনার আবেদনটি গ্রহণ করা হয়েছে। পরবর্তী নির্দেশনার জন্য মাদরাসা অফিসে যোগাযোগ করুন।
                      </p>
                    )}
                    {selectedStudent.status === "rejected" && (
                      <p className="text-red-700 font-bengali text-sm leading-relaxed bg-red-50 p-4 rounded-xl border border-red-100">
                        দুঃখিত, আপনার আবেদনটি এই মুহূর্তে গ্রহণ করা সম্ভব হয়নি। বিস্তারিত জানতে মাদরাসা অফিসে যোগাযোগ করুন।
                      </p>
                    )}
                    {selectedStudent.status === "pending" && (
                      <p className="text-yellow-700 font-bengali text-sm leading-relaxed bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                        আপনার আবেদনটি আমাদের কাছে পৌঁছেছে। অনুগ্রহ করে ধৈর্য ধরুন, আমরা শীঘ্রই এটি যাচাই করে ফলাফল জানাবো।
                      </p>
                    )}
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
