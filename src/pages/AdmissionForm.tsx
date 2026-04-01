import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Save, User, Phone, MapPin, Calendar, BookOpen, GraduationCap, ArrowLeft, ImageIcon, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function AdmissionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    year: new Date().getFullYear().toString(),
    studentNameBn: "",
    studentNameEn: "",
    fatherName: "",
    motherName: "",
    dob: "",
    gender: "male",
    presentAddress: "",
    permanentAddress: "",
    previousInstitute: "",
    department: "",
    classToAdmit: "",
    contactNumber: "",
    guardianName: "",
    guardianContact: "",
    bloodGroup: "",
    photoUrl: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/data")
      .then(res => res.json())
      .then(data => {
        if (data.gallery) {
          setGallery(data.gallery);
        }
      })
      .catch(err => console.error("Failed to fetch gallery", err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("ছবির সাইজ ২ মেগাবাইটের বেশি হতে পারবে না।");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admissions/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("আবেদন জমা দিতে সমস্যা হয়েছে।");

      setSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err: any) {
      setError(err.message || "সার্ভারে সমস্যা হচ্ছে। পরে চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center space-y-6 border border-primary/10"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <Save size={40} />
          </div>
          <h2 className="text-3xl font-bengali font-bold text-primary">আবেদন সফল হয়েছে!</h2>
          <p className="text-on-surface-variant font-bengali leading-relaxed">
            আপনার ভর্তির আবেদনটি আমাদের কাছে পৌঁছেছে। আপনি আপনার মোবাইল নম্বর দিয়ে আবেদনের অবস্থা চেক করতে পারবেন।
          </p>
          <div className="space-y-3">
            <button 
              onClick={() => navigate("/")}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bengali font-bold text-lg hover:shadow-lg transition-all"
            >
              হোম পেজে ফিরে যান
            </button>
            <button 
              onClick={() => navigate("/admission/status")}
              className="w-full bg-secondary-container text-on-secondary-container py-4 rounded-xl font-bengali font-bold text-lg hover:shadow-lg transition-all"
            >
              আবেদনের অবস্থা দেখুন
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low py-12 px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary font-bold hover:underline transition-all"
          >
            <ArrowLeft size={20} /> ফিরে যান
          </button>
          <div className="text-right">
            <h1 className="text-3xl font-bengali font-bold text-primary">ভর্তি ফরম</h1>
            <p className="text-on-surface-variant font-sans text-sm uppercase tracking-wider">Admission Application Form</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 font-bengali">
              {error}
            </div>
          )}
          {/* Personal Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-outline-variant/20 space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <User size={24} />
              </div>
              <h2 className="text-xl font-bengali font-bold text-on-surface">ব্যক্তিগত তথ্য (Personal Information)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">শিক্ষাবর্ষ *</label>
                <select 
                  required
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                >
                  <option value="2024">২০২৪</option>
                  <option value="2025">২০২৫</option>
                  <option value="2026">২০২৬</option>
                  <option value="2027">২০২৭</option>
                  <option value="2028">২০২৮</option>
                </select>
              </div>
              <div className="md:col-span-2 flex items-center gap-6">
                <div className="w-24 h-24 rounded-2xl bg-surface-container border-2 border-dashed border-outline-variant flex items-center justify-center overflow-hidden">
                  {formData.photoUrl ? (
                    <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} className="text-on-surface-variant" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bengali font-bold text-on-surface mb-2">ছাত্রের ছবি (ঐচ্ছিক)</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 font-bengali"
                    />
                    <button
                      type="button"
                      onClick={() => setIsGalleryModalOpen(true)}
                      className="px-4 py-2 bg-surface-container text-on-surface rounded-full text-sm font-bold font-bengali hover:bg-surface-container-high transition-colors whitespace-nowrap"
                    >
                      গ্যালারি থেকে বাছুন
                    </button>
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1 font-bengali">সর্বোচ্চ ২ মেগাবাইট (JPG, PNG)</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">ছাত্রের নাম (বাংলা)</label>
                <input 
                  required
                  type="text"
                  name="studentNameBn"
                  value={formData.studentNameBn}
                  onChange={handleChange}
                  placeholder="যেমন: মোহাম্মদ আব্দুল্লাহ"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">ছাত্রের নাম (ইংরেজি)</label>
                <input 
                  required
                  type="text"
                  name="studentNameEn"
                  value={formData.studentNameEn}
                  onChange={handleChange}
                  placeholder="e.g. Mohammad Abdullah"
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans uppercase"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">পিতার নাম</label>
                <input 
                  required
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">মাতার নাম</label>
                <input 
                  required
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">জন্ম তারিখ</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input 
                    required
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">লিঙ্গ</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                >
                  <option value="male">পুরুষ</option>
                  <option value="female">মহিলা</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Contact & Address */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-outline-variant/20 space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                <MapPin size={24} />
              </div>
              <h2 className="text-xl font-bengali font-bold text-on-surface">যোগাযোগ ও ঠিকানা (Contact & Address)</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">বর্তমান ঠিকানা</label>
                <textarea 
                  required
                  name="presentAddress"
                  value={formData.presentAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">স্থায়ী ঠিকানা</label>
                <textarea 
                  required
                  name="permanentAddress"
                  value={formData.permanentAddress}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="text-sm font-bengali font-bold text-on-surface">মোবাইল নম্বর</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                    <input 
                      required
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bengali font-bold text-on-surface">রক্তের গ্রুপ</label>
                  <select 
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                  >
                    <option value="">নির্বাচন করুন</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Academic Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-outline-variant/20 space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <h2 className="text-xl font-bengali font-bold text-on-surface">শিক্ষাগত তথ্য (Academic Information)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">পূর্ববর্তী প্রতিষ্ঠানের নাম</label>
                <input 
                  type="text"
                  name="previousInstitute"
                  value={formData.previousInstitute}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">বিভাগ নির্বাচন করুন</label>
                <select 
                  name="department"
                  value={formData.department}
                  onChange={(e) => {
                    setFormData({ ...formData, department: e.target.value, classToAdmit: "" });
                  }}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                >
                  <option value="">বিভাগ নির্বাচন করুন</option>
                  <option value="হিফজ বিভাগ">হিফজ বিভাগ</option>
                  <option value="কিতাব বিভাগ">কিতাব বিভাগ</option>
                  <option value="মক্তব বিভাগ">মক্তব বিভাগ</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">যে জামাতে ভর্তি হতে ইচ্ছুক</label>
                <select 
                  name="classToAdmit"
                  value={formData.classToAdmit}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  disabled={!formData.department}
                >
                  <option value="">জামাত নির্বাচন করুন</option>
                  {formData.department === "হিফজ বিভাগ" && (
                    <>
                      <option value="মক্কী">মক্কী</option>
                      <option value="মাদানী">মাদানী</option>
                    </>
                  )}
                  {formData.department === "কিতাব বিভাগ" && (
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
                  {formData.department === "মক্তব বিভাগ" && (
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
          </motion.div>

          {/* Guardian Information */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-outline-variant/20 space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <GraduationCap size={24} />
              </div>
              <h2 className="text-xl font-bengali font-bold text-on-surface">অভিভাবকের তথ্য (Guardian Information)</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">অভিভাবকের নাম</label>
                <input 
                  required
                  type="text"
                  name="guardianName"
                  value={formData.guardianName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bengali font-bold text-on-surface">অভিভাবকের মোবাইল নম্বর</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input 
                    required
                    type="tel"
                    name="guardianContact"
                    value={formData.guardianContact}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex justify-center pt-6 pb-12">
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`bg-primary text-on-primary px-12 py-4 rounded-2xl font-bengali font-bold text-xl hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-3 ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <>লোড হচ্ছে...</>
              ) : (
                <>
                  <Save size={24} /> আবেদন জমা দিন
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Gallery Picker Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-primary text-white">
              <h3 className="font-bengali font-bold text-xl flex items-center gap-2">
                <ImageIcon size={24} /> গ্যালারি থেকে ছবি নির্বাচন করুন
              </h3>
              <button onClick={() => setIsGalleryModalOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-surface-container-low">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {gallery.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, photoUrl: url }));
                      setIsGalleryModalOpen(false);
                    }}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all group shadow-sm hover:shadow-md"
                  >
                    <img src={url} alt="Gallery item" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <div className="bg-white text-primary px-3 py-1 rounded-full text-xs font-bold font-bengali shadow-sm">
                        নির্বাচন করুন
                      </div>
                    </div>
                  </button>
                ))}
                {gallery.length === 0 && (
                  <div className="col-span-full text-center py-10 text-on-surface-variant font-bengali">
                    গ্যালারিতে কোন ছবি পাওয়া যায়নি।
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t bg-white flex justify-end">
              <button
                type="button"
                onClick={() => setIsGalleryModalOpen(false)}
                className="px-6 py-2 rounded-lg border border-outline-variant font-bengali font-bold hover:bg-gray-50 transition-all"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
