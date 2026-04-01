import { motion } from "motion/react";
import { useData } from "../context/DataContext";
import { Wallet, TrendingUp, TrendingDown, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export function Hisab() {
  const { data, loading } = useData();

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center font-bengali">লোড হচ্ছে...</div>;

  const totalIncome = data.transactions?.filter((t: any) => t.type === "income").reduce((acc: number, t: any) => acc + Number(t.amount), 0) || 0;
  const totalExpense = data.transactions?.filter((t: any) => t.type === "expense").reduce((acc: number, t: any) => acc + Number(t.amount), 0) || 0;
  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-surface-container-low py-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-primary font-bengali font-bold mb-4 hover:gap-3 transition-all">
              <ArrowLeft size={20} /> হোমপেজে ফিরুন
            </Link>
            <h1 className="text-4xl font-bengali font-bold text-on-surface">আর্থিক স্বচ্ছতা ও হিসাব রিপোর্ট</h1>
            <p className="text-on-surface-variant font-bengali mt-2">মাদরাসার আয়-ব্যয়ের স্বচ্ছ হিসাব সবার জন্য উন্মুক্ত</p>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Wallet size={48} />
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-lg font-bengali font-bold text-on-surface-variant mb-2">মোট আয়</h3>
            <p className="text-3xl font-bold text-green-600 font-sans">৳ {totalIncome.toLocaleString()}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6">
              <TrendingDown size={32} />
            </div>
            <h3 className="text-lg font-bengali font-bold text-on-surface-variant mb-2">মোট ব্যয়</h3>
            <p className="text-3xl font-bold text-red-600 font-sans">৳ {totalExpense.toLocaleString()}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/10 flex flex-col items-center text-center"
          >
            <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6">
              <Wallet size={32} />
            </div>
            <h3 className="text-lg font-bengali font-bold text-on-surface-variant mb-2">বর্তমান ব্যালেন্স</h3>
            <p className="text-3xl font-bold text-primary font-sans">৳ {balance.toLocaleString()}</p>
          </motion.div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
          <div className="p-8 border-b border-outline-variant/10 flex justify-between items-center">
            <h2 className="text-2xl font-bengali font-bold text-on-surface">সাম্প্রতিক লেনদেনসমূহ</h2>
            <span className="bg-primary/10 text-primary px-4 py-1 rounded-full text-sm font-bengali font-bold">সর্বশেষ আপডেট</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="py-5 px-8 font-bengali font-bold text-on-surface">তারিখ</th>
                  <th className="py-5 px-8 font-bengali font-bold text-on-surface">ক্যাটাগরি</th>
                  <th className="py-5 px-8 font-bengali font-bold text-on-surface">বিবরণ</th>
                  <th className="py-5 px-8 font-bengali font-bold text-on-surface text-right">পরিমাণ</th>
                </tr>
              </thead>
              <tbody>
                {data.transactions?.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20).map((t: any) => (
                  <tr key={t.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                    <td className="py-5 px-8 font-sans text-sm">{t.date}</td>
                    <td className="py-5 px-8">
                      <span className={`px-4 py-1 rounded-full text-xs font-bengali font-bold ${
                        t.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {t.category}
                      </span>
                    </td>
                    <td className="py-5 px-8 font-bengali text-sm text-on-surface-variant">{t.description}</td>
                    <td className={`py-5 px-8 font-sans font-bold text-right ${
                      t.type === "income" ? "text-green-600" : "text-red-600"
                    }`}>
                      {t.type === "income" ? "+" : "-"} ৳ {Number(t.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {(!data.transactions || data.transactions.length === 0) && (
                  <tr>
                    <td colSpan={4} className="py-20 text-center text-on-surface-variant font-bengali">কোনো লেনদেন পাওয়া যায়নি।</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-8 bg-surface-container-low/30 text-center">
            <p className="text-on-surface-variant font-bengali text-sm">
              * এটি মাদরাসার সাধারণ হিসাবের একটি সংক্ষিপ্ত রূপ। বিস্তারিত তথ্যের জন্য মাদরাসা অফিসে যোগাযোগ করুন।
            </p>
          </div>
        </div>

        {/* Donation Info Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-6 text-primary">
              <span className="material-symbols-outlined">account_balance</span>
              <h3 className="text-2xl font-bengali font-bold">ব্যাংক একাউন্ট তথ্য</h3>
            </div>
            <div className="space-y-4 font-bengali">
              <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                <span className="text-on-surface-variant">ব্যাংকের নাম:</span>
                <span className="font-bold text-on-surface">{data.donationInfo?.bankName}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                <span className="text-on-surface-variant">একাউন্ট নাম:</span>
                <span className="font-bold text-on-surface">{data.donationInfo?.accountName}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                <span className="text-on-surface-variant">একাউন্ট নম্বর:</span>
                <span className="font-bold text-on-surface font-sans">{data.donationInfo?.accountNumber}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant/10 pb-2">
                <span className="text-on-surface-variant">শাখা:</span>
                <span className="font-bold text-on-surface">{data.donationInfo?.branch}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-6 text-secondary">
              <span className="material-symbols-outlined">smartphone</span>
              <h3 className="text-2xl font-bengali font-bold">মোবাইল ব্যাংকিং</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-100 text-center">
                <p className="text-pink-600 font-bold text-xs mb-1">বিকাশ</p>
                <p className="font-bold text-on-surface font-sans">{data.donationInfo?.bkash}</p>
              </div>
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-center">
                <p className="text-orange-600 font-bold text-xs mb-1">নগদ</p>
                <p className="font-bold text-on-surface font-sans">{data.donationInfo?.nagad}</p>
              </div>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                <p className="text-blue-600 font-bold text-xs mb-1">রকেট</p>
                <p className="font-bold text-on-surface font-sans">{data.donationInfo?.rocket}</p>
              </div>
            </div>
            <div className="mt-8 p-4 bg-tertiary/5 rounded-xl border border-tertiary/10">
              <p className="text-on-surface-variant font-bengali text-sm text-center">
                আপনার দান মাদরাসার উন্নয়ন ও এতিম ছাত্রদের কল্যাণে ব্যয় করা হয়। জাযাকাল্লাহু খাইরান।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
