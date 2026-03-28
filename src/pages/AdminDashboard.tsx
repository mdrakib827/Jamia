import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Settings, Bell, Users, GraduationCap, LogOut, Upload, Plus, Trash2, Save, Check, X } from "lucide-react";
import { useData } from "../context/DataContext";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("settings");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { refreshData } = useData();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      navigate("/secret-admin");
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/data");
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/secret-admin");
  };

  const handleSave = async (type: string, payload: any) => {
    try {
      const res = await fetch(`/api/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        alert("সফলভাবে সংরক্ষিত হয়েছে!");
        fetchData();
        
        // Update the global context if in the same tab
        refreshData();

        // Broadcast to other tabs to refresh
        const channel = new BroadcastChannel("app_data_sync");
        channel.postMessage("refresh");
        channel.close();

        // Also trigger storage event for cross-tab sync
        localStorage.setItem("last_data_update", Date.now().toString());
      }
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const { url } = await res.json();
      setData({ ...data, settings: { ...data.settings, [field]: url } });
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  if (loading || !data) return <div className="min-h-screen flex items-center justify-center font-bengali">লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white p-6 flex flex-col gap-8 shadow-2xl z-20">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Settings size={24} />
          </div>
          <h1 className="text-xl font-bengali font-bold">অ্যাডমিন প্যানেল</h1>
        </div>

        <nav className="flex flex-col gap-2">
          {[
            { id: "settings", label: "সেটিংস", icon: Settings },
            { id: "notices", label: "নোটিশ বোর্ড", icon: Bell },
            { id: "teachers", label: "শিক্ষক তালিকা", icon: Users },
            { id: "admission", label: "ভর্তি তথ্য", icon: Plus },
            { id: "results", label: "ফলাফল ব্যবস্থাপনা", icon: GraduationCap },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bengali text-sm transition-all ${
                activeTab === tab.id ? "bg-white/20 font-bold" : "hover:bg-white/10"
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-lg font-bengali text-sm text-red-200 hover:bg-red-500/20 transition-all"
        >
          <LogOut size={18} />
          লগ আউট
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto max-h-screen">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bengali font-bold text-primary">
            {activeTab === "settings" && "সাইট সেটিংস"}
            {activeTab === "notices" && "নোটিশ বোর্ড ব্যবস্থাপনা"}
            {activeTab === "teachers" && "শিক্ষক তালিকা ব্যবস্থাপনা"}
            {activeTab === "admission" && "ভর্তি তথ্য ব্যবস্থাপনা"}
            {activeTab === "results" && "ফলাফল ব্যবস্থাপনা"}
          </h2>
          <div className="text-sm font-sans text-on-surface-variant bg-white px-4 py-2 rounded-full shadow-sm">
            Welcome, Administrator
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-outline-variant/10">
          {activeTab === "settings" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-bengali font-bold text-on-surface mb-2">মাদরাসার নাম (বাংলা)</label>
                  <input
                    type="text"
                    value={data.settings.siteTitle}
                    onChange={(e) => setData({ ...data, settings: { ...data.settings, siteTitle: e.target.value } })}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bengali font-bold text-on-surface mb-2">মাদরাসার ঠিকানা (বাংলা)</label>
                  <input
                    type="text"
                    value={data.settings.address || ""}
                    onChange={(e) => setData({ ...data, settings: { ...data.settings, address: e.target.value } })}
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                    placeholder="কড়ৈয়াবারী, বারপাড়া, বন্দর, নারায়াণগঞ্জ।"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bengali font-bold text-on-surface mb-2">মাদরাসা লোগো</label>
                  <div className="flex items-center gap-4">
                    <img src={data.settings.logo} alt="Logo" className="w-16 h-16 object-contain rounded border p-1" />
                    <label className="cursor-pointer bg-primary-container text-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/10 transition-all">
                      <Upload size={16} /> আপলোড
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "logo")} />
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-2">হিরো ইমেজ (ব্যানার)</label>
                <div className="space-y-4">
                  <img src={data.settings.heroImage} alt="Hero" className="w-full h-48 object-cover rounded-xl border" />
                  <label className="cursor-pointer bg-primary-container text-primary px-4 py-2 rounded-lg text-sm font-bold inline-flex items-center gap-2 hover:bg-primary/10 transition-all">
                    <Upload size={16} /> নতুন ব্যানার আপলোড
                    <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "heroImage")} />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-2">গ্যালারি ইমেজ (ইভেন্ট ফটো)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {data.settings.gallery?.map((img: string, idx: number) => (
                    <div key={idx} className="relative group">
                      <img src={img} alt="Gallery" className="w-full h-32 object-cover rounded-lg border" />
                      <button
                        onClick={() => {
                          const newGallery = [...data.settings.gallery];
                          newGallery.splice(idx, 1);
                          setData({ ...data, settings: { ...data.settings, gallery: newGallery } });
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="cursor-pointer border-2 border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center h-32 hover:bg-surface-container-high transition-all">
                    <Plus size={24} className="text-on-surface-variant" />
                    <span className="text-xs font-bengali text-on-surface-variant">নতুন ছবি</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const formData = new FormData();
                        formData.append("file", file);
                        const res = await fetch("/api/upload", { method: "POST", body: formData });
                        const { url } = await res.json();
                        const newGallery = [...(data.settings.gallery || []), url];
                        setData({ ...data, settings: { ...data.settings, gallery: newGallery } });
                      }}
                    />
                  </label>
                </div>
              </div>
              <button
                onClick={() => handleSave("settings", data.settings)}
                className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bengali font-bold text-lg flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Save size={20} /> সেটিংস সেভ করুন
              </button>

              <div className="pt-10 border-t border-outline-variant/20">
                <h3 className="text-xl font-bengali font-bold text-primary mb-6">পাসওয়ার্ড পরিবর্তন</h3>
                <div className="max-w-md space-y-4">
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">নতুন পাসওয়ার্ড</label>
                    <input
                      type="password"
                      id="new-password-input"
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                      placeholder="নতুন পাসওয়ার্ড লিখুন"
                    />
                  </div>
                  <button
                    onClick={async () => {
                      const input = document.getElementById("new-password-input") as HTMLInputElement;
                      const newPassword = input.value;
                      if (!newPassword) return alert("পাসওয়ার্ড লিখুন!");
                      
                      try {
                        const res = await fetch("/api/change-password", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ newPassword }),
                        });
                        if (res.ok) {
                          alert("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!");
                          input.value = "";
                        }
                      } catch (err) {
                        console.error("Error changing password:", err);
                      }
                    }}
                    className="bg-secondary text-on-secondary px-6 py-2 rounded-lg font-bengali font-bold hover:bg-secondary/90 transition-all"
                  >
                    পাসওয়ার্ড আপডেট করুন
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notices" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setData({ ...data, notices: [{ id: Date.now(), date: "০১", month: "Jan", title: "নতুন নোটিশ", desc: "বিস্তারিত এখানে লিখুন..." }, ...data.notices] })}
                  className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-secondary-container/80 transition-all"
                >
                  <Plus size={16} /> নতুন নোটিশ যোগ করুন
                </button>
              </div>
              <div className="space-y-4">
                {data.notices.map((notice: any, idx: number) => (
                  <div key={notice.id} className="p-6 rounded-xl border border-outline-variant/20 bg-surface-container-lowest flex gap-6 items-start">
                    <div className="flex-shrink-0 w-16 h-16 bg-primary-container rounded-lg flex flex-col items-center justify-center text-white">
                      <input
                        className="bg-transparent text-center w-full font-bold text-xs uppercase outline-none"
                        value={notice.month}
                        onChange={(e) => {
                          const newNotices = [...data.notices];
                          newNotices[idx].month = e.target.value;
                          setData({ ...data, notices: newNotices });
                        }}
                      />
                      <input
                        className="bg-transparent text-center w-full font-bold text-xl outline-none"
                        value={notice.date}
                        onChange={(e) => {
                          const newNotices = [...data.notices];
                          newNotices[idx].date = e.target.value;
                          setData({ ...data, notices: newNotices });
                        }}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <input
                        className="w-full text-xl font-bengali font-bold text-primary outline-none border-b border-transparent focus:border-primary/20"
                        value={notice.title}
                        onChange={(e) => {
                          const newNotices = [...data.notices];
                          newNotices[idx].title = e.target.value;
                          setData({ ...data, notices: newNotices });
                        }}
                      />
                      <textarea
                        className="w-full text-on-surface-variant font-bengali outline-none border-b border-transparent focus:border-primary/20 resize-none"
                        rows={2}
                        value={notice.desc}
                        onChange={(e) => {
                          const newNotices = [...data.notices];
                          newNotices[idx].desc = e.target.value;
                          setData({ ...data, notices: newNotices });
                        }}
                      />
                    </div>
                    <button
                      onClick={() => setData({ ...data, notices: data.notices.filter((n: any) => n.id !== notice.id) })}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleSave("notices", data.notices)}
                className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bengali font-bold text-lg flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Save size={20} /> নোটিশ বোর্ড আপডেট করুন
              </button>
            </div>
          )}

          {activeTab === "admission" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-2">ভর্তি সংক্রান্ত তথ্য</label>
                <textarea
                  className="w-full px-4 py-4 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  rows={6}
                  value={data.admissionInfo}
                  onChange={(e) => setData({ ...data, admissionInfo: e.target.value })}
                />
              </div>
              <button
                onClick={() => handleSave("admission", { info: data.admissionInfo })}
                className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bengali font-bold text-lg flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Save size={20} /> ভর্তি তথ্য আপডেট করুন
              </button>
            </div>
          )}

          {activeTab === "results" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bengali text-on-surface-variant italic">* মার্কস ইনপুট দিলে টোটাল এবং পজিশন অটো-ক্যালকুলেট হবে</p>
                <button
                  onClick={() => {
                    const newResult = {
                      id: Date.now(),
                      roll: "",
                      name: "নতুন ছাত্র",
                      exam: "বার্ষিক পরীক্ষা ২০২৪",
                      year: "২০২৪",
                      marks: { quran: 0, hadith: 0, fiqh: 0, bangla: 0 },
                      total: 0,
                      position: 0,
                      published: false,
                    };
                    setData({ ...data, results: [newResult, ...data.results] });
                  }}
                  className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-secondary-container/80 transition-all"
                >
                  <Plus size={16} /> নতুন রেজাল্ট যোগ করুন
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
                <table className="w-full text-left border-collapse font-bengali">
                  <thead className="bg-surface-container-high text-on-surface text-sm uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 border-b">রোল</th>
                      <th className="px-4 py-3 border-b">নাম</th>
                      <th className="px-4 py-3 border-b">কুরআন</th>
                      <th className="px-4 py-3 border-b">হাদীস</th>
                      <th className="px-4 py-3 border-b">ফিকহ</th>
                      <th className="px-4 py-3 border-b">বাংলা</th>
                      <th className="px-4 py-3 border-b">মোট</th>
                      <th className="px-4 py-3 border-b">মেধা</th>
                      <th className="px-4 py-3 border-b">অবস্থা</th>
                      <th className="px-4 py-3 border-b">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {data.results.map((res: any, idx: number) => (
                      <tr key={res.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-4 py-2 border-b">
                          <input
                            className="w-16 bg-transparent outline-none focus:ring-1 focus:ring-primary rounded px-1"
                            value={res.roll}
                            onChange={(e) => {
                              const newResults = [...data.results];
                              newResults[idx].roll = e.target.value;
                              setData({ ...data, results: newResults });
                            }}
                          />
                        </td>
                        <td className="px-4 py-2 border-b">
                          <input
                            className="w-32 bg-transparent outline-none focus:ring-1 focus:ring-primary rounded px-1"
                            value={res.name}
                            onChange={(e) => {
                              const newResults = [...data.results];
                              newResults[idx].name = e.target.value;
                              setData({ ...data, results: newResults });
                            }}
                          />
                        </td>
                        {Object.keys(res.marks).map((subject) => (
                          <td key={subject} className="px-4 py-2 border-b">
                            <input
                              type="number"
                              className="w-16 bg-transparent outline-none focus:ring-1 focus:ring-primary rounded px-1"
                              value={res.marks[subject]}
                              onChange={(e) => {
                                const newResults = [...data.results];
                                const val = parseInt(e.target.value) || 0;
                                newResults[idx].marks[subject] = val;
                                
                                // Auto-calculate total
                                const total = Object.values(newResults[idx].marks).reduce((a: any, b: any) => a + b, 0) as number;
                                newResults[idx].total = total;

                                // Auto-calculate positions
                                const sorted = [...newResults].sort((a, b) => b.total - a.total);
                                sorted.forEach((item, sIdx) => {
                                  const originalIdx = newResults.findIndex(r => r.id === item.id);
                                  newResults[originalIdx].position = sIdx + 1;
                                });

                                setData({ ...data, results: newResults });
                              }}
                            />
                          </td>
                        ))}
                        <td className="px-4 py-2 border-b font-bold text-primary">{res.total}</td>
                        <td className="px-4 py-2 border-b font-bold text-secondary">{res.position}</td>
                        <td className="px-4 py-2 border-b">
                          <button
                            onClick={() => {
                              const newResults = [...data.results];
                              newResults[idx].published = !newResults[idx].published;
                              setData({ ...data, results: newResults });
                            }}
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-all ${
                              res.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {res.published ? <Check size={12} /> : <X size={12} />}
                            {res.published ? "পাবলিশড" : "হিডেন"}
                          </button>
                        </td>
                        <td className="px-4 py-2 border-b">
                          <button
                            onClick={() => setData({ ...data, results: data.results.filter((r: any) => r.id !== res.id) })}
                            className="text-red-500 hover:bg-red-50 p-1 rounded transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                onClick={() => handleSave("results", data.results)}
                className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bengali font-bold text-lg flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Save size={20} /> ফলাফল পাবলিশ করুন
              </button>
            </div>
          )}

          {activeTab === "teachers" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setData({ ...data, teachers: [{ id: Date.now(), name: "নতুন শিক্ষক", designation: "পদবি", image: "https://picsum.photos/seed/new/200/200" }, ...data.teachers] })}
                  className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-secondary-container/80 transition-all"
                >
                  <Plus size={16} /> নতুন শিক্ষক যোগ করুন
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.teachers.map((teacher: any, idx: number) => (
                  <div key={teacher.id} className="p-6 rounded-xl border border-outline-variant/20 bg-surface-container-lowest flex flex-col items-center text-center gap-4">
                    <div className="relative group">
                      <img src={teacher.image} alt={teacher.name} className="w-24 h-24 rounded-full object-cover border-4 border-primary/10" />
                      <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                        <Upload className="text-white" size={20} />
                        <input
                          type="file"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append("file", file);
                            const res = await fetch("/api/upload", { method: "POST", body: formData });
                            const { url } = await res.json();
                            const newTeachers = [...data.teachers];
                            newTeachers[idx].image = url;
                            setData({ ...data, teachers: newTeachers });
                          }}
                        />
                      </label>
                    </div>
                    <div className="w-full space-y-2">
                      <input
                        className="w-full text-lg font-bengali font-bold text-primary text-center outline-none border-b border-transparent focus:border-primary/20"
                        value={teacher.name}
                        onChange={(e) => {
                          const newTeachers = [...data.teachers];
                          newTeachers[idx].name = e.target.value;
                          setData({ ...data, teachers: newTeachers });
                        }}
                      />
                      <input
                        className="w-full text-on-surface-variant font-bengali text-sm text-center outline-none border-b border-transparent focus:border-primary/20"
                        value={teacher.designation}
                        onChange={(e) => {
                          const newTeachers = [...data.teachers];
                          newTeachers[idx].designation = e.target.value;
                          setData({ ...data, teachers: newTeachers });
                        }}
                      />
                    </div>
                    <button
                      onClick={() => setData({ ...data, teachers: data.teachers.filter((t: any) => t.id !== teacher.id) })}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all mt-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => handleSave("teachers", data.teachers)}
                className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bengali font-bold text-lg flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Save size={20} /> শিক্ষক তালিকা আপডেট করুন
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
