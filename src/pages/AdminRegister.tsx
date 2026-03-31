import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Mail, User, FileText, ArrowLeft, CheckCircle } from "lucide-react";

export function AdminRegister() {
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    documents_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const data = await res.json();
        setError(data.error || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
      }
    } catch (err) {
      setError("সার্ভারে সমস্যা হচ্ছে।");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary-container p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-2xl font-bengali font-bold text-primary mb-4">আবেদন জমা হয়েছে!</h1>
          <p className="text-on-surface-variant font-bengali mb-8">
            আপনার আবেদনটি সুপার অ্যাডমিনের কাছে পাঠানো হয়েছে। তিনি অনুমোদন করলে আপনার ইমেইলে পাসওয়ার্ড পাঠানো হবে।
          </p>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 text-primary font-bengali font-bold hover:underline"
          >
            <ArrowLeft size={20} /> লগইন পেজে ফিরে যান
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-container p-4 relative overflow-hidden">
      <div className="absolute inset-0 arabesque-pattern opacity-10"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-primary/10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <UserPlus size={32} />
          </div>
          <h1 className="text-2xl font-bengali font-bold text-primary">অ্যাডমিন রেজিস্ট্রেশন</h1>
          <p className="text-on-surface-variant font-bengali text-sm mt-2">অ্যাডমিন হওয়ার জন্য আবেদন করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bengali font-bold text-on-surface mb-2">
              <div className="flex items-center gap-2">
                <User size={16} /> পূর্ণ নাম
              </div>
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="আপনার নাম লিখুন"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bengali font-bold text-on-surface mb-2">
              <div className="flex items-center gap-2">
                <Mail size={16} /> ইমেইল অ্যাড্রেস
              </div>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="example@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bengali font-bold text-on-surface mb-2">
              <div className="flex items-center gap-2">
                <FileText size={16} /> ডকুমেন্ট লিঙ্ক (ঐচ্ছিক - Google Drive/NID)
              </div>
            </label>
            <input
              type="url"
              value={formData.documents_url}
              onChange={(e) => setFormData({ ...formData, documents_url: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary outline-none transition-all"
              placeholder="https://drive.google.com/..."
            />
          </div>

          {error && <p className="text-red-500 text-sm font-bengali text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-lg font-bengali font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {loading ? "প্রসেসিং..." : "আবেদন জমা দিন"}
          </button>

          <div className="text-center">
            <Link to="/admin/login" className="text-sm font-bengali text-primary hover:underline">
              ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
