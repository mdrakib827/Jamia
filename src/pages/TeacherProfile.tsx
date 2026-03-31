import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useData } from "../context/DataContext";
import { ArrowLeft, BookOpen, GraduationCap, Mail, Phone } from "lucide-react";

export function TeacherProfile() {
  const { id } = useParams();
  const { data, loading } = useData();
  const navigate = useNavigate();

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center font-bengali">লোড হচ্ছে...</div>;

  const teacher = data.teachers.find((t: any) => t.id.toString() === id);

  if (!teacher) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center font-bengali gap-4">
        <h2 className="text-2xl font-bold text-primary">শিক্ষক খুঁজে পাওয়া যায়নি</h2>
        <button 
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft size={20} /> ফিরে যান
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low pb-24">
      {/* Header / Banner */}
      <div className="h-64 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 arabesque-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30"></div>
        <div className="max-w-5xl mx-auto px-8 h-full flex items-end pb-8 relative z-10">
          <button 
            onClick={() => navigate(-1)}
            className="absolute top-8 left-8 bg-white/10 backdrop-blur-md text-white p-2 rounded-full hover:bg-white/20 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 -mt-24 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-outline-variant/20">
          <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Left Column: Image & Basic Info */}
            <div className="flex flex-col items-center text-center gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-48 h-48 rounded-full border-8 border-white shadow-2xl overflow-hidden bg-surface-container"
              >
                <img 
                  src={teacher.image} 
                  alt={teacher.name} 
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bengali font-bold text-primary mb-2">{teacher.name}</h1>
                <p className="text-lg font-bengali text-secondary font-medium">{teacher.designation}</p>
              </div>
              
              <div className="w-full h-px bg-outline-variant/30"></div>
              
              <div className="w-full space-y-4">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <GraduationCap size={20} />
                  </div>
                  <span className="font-bengali text-sm">শিক্ষাগত যোগ্যতা: {teacher.qualification || "তথ্য নেই"}</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <BookOpen size={20} />
                  </div>
                  <span className="font-bengali text-sm">বিশেষজ্ঞ: {teacher.specialization || "তথ্য নেই"}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Details */}
            <div className="md:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-bengali font-bold text-on-surface mb-4 flex items-center gap-2">
                  <div className="w-2 h-8 bg-secondary rounded-full"></div>
                  বিস্তারিত তথ্য
                </h2>
                <div className="prose prose-lg font-bengali text-on-surface-variant leading-relaxed whitespace-pre-line bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/10">
                  {teacher.details || "এই শিক্ষকের বিস্তারিত তথ্য এখনো যুক্ত করা হয়নি।"}
                </div>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-tertiary-fixed/10 border border-tertiary/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-tertiary text-white flex items-center justify-center shadow-lg">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">যোগাযোগ</p>
                    <p className="text-lg font-bold text-primary">{teacher.phone || "তথ্য নেই"}</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-secondary-fixed/10 border border-secondary/10 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center shadow-lg">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">ইমেইল</p>
                    <p className="text-lg font-bold text-primary break-all">{teacher.email || "তথ্য নেই"}</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
