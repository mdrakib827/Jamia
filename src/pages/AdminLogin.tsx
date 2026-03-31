import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, HelpCircle } from "lucide-react";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        navigate("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "ভুল ইমেইল বা পাসওয়ার্ড! আবার চেষ্টা করুন।");
      }
    } catch (err) {
      setError("সার্ভারে সমস্যা হচ্ছে। পরে চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const userEmail = prompt("আপনার নিবন্ধিত ইমেইল অ্যাড্রেসটি লিখুন:");
    if (!userEmail) return;

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await res.json();
      alert(data.message || data.error);
    } catch (err) {
      alert("অনুরোধটি পাঠানো সম্ভব হয়নি। পরে চেষ্টা করুন।");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-container relative overflow-hidden">
      <div className="absolute inset-0 arabesque-pattern opacity-20"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-primary/10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-bengali font-bold text-primary">অ্যাডমিন লগইন</h1>
          <p className="text-on-surface-variant font-bengali text-sm mt-2">আপনার তথ্য দিয়ে প্রবেশ করুন</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bengali font-bold text-on-surface mb-2">ইমেইল অ্যাড্রেস</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="admin@gmail.com"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-bengali font-bold text-on-surface mb-2">পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-12"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Link
              to="/admin/register"
              className="text-sm font-bengali text-primary hover:underline"
            >
              নতুন অ্যাডমিন রেজিস্ট্রেশন
            </Link>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-bengali text-primary hover:underline flex items-center gap-1"
            >
              <HelpCircle size={14} /> পাসওয়ার্ড ভুলে গেছেন?
            </button>
          </div>

          {error && <p className="text-red-500 text-sm font-bengali text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-primary text-on-primary py-3 rounded-lg font-bengali font-bold text-lg hover:bg-primary/90 transition-all shadow-lg ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "প্রবেশ করা হচ্ছে..." : "প্রবেশ করুন"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
