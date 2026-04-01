import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Settings, Bell, Users, GraduationCap, LogOut, Upload, Plus, Trash2, Save, Check, X, UserPlus, FileText, ExternalLink, Image as ImageIcon, Crop, ZoomIn, Search, Shield, Key, ArrowUp, ArrowDown, User, Download, FileSpreadsheet, BookOpen, LayoutGrid, Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { useData } from "../context/DataContext";
import { ImageEditor } from "../components/ImageEditor";
import * as XLSX from 'xlsx';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("settings");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [gallery, setGallery] = useState<string[]>([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryCallback, setGalleryCallback] = useState<(url: string) => void>(() => {});
  
  const [editingImage, setEditingImage] = useState<{ url: string; field?: string; aspect?: number; callback?: (url: string) => void } | null>(null);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [approvingAdmissionId, setApprovingAdmissionId] = useState<number | null>(null);
  const [approvingRoll, setApprovingRoll] = useState("");
  
  const [isOfflineStudentModalOpen, setIsOfflineStudentModalOpen] = useState(false);
  const [offlineStudentData, setOfflineStudentData] = useState<any>({
    year: new Date().getFullYear().toString(),
    studentNameBn: "",
    fatherName: "",
    department: "",
    classToAdmit: "",
    roll: "",
    contactNumber: "",
    photoUrl: ""
  });
  
  const [isEditStudentModalOpen, setIsEditStudentModalOpen] = useState(false);
  const [editingStudentData, setEditingStudentData] = useState<any>(null);
  
  const [newTransaction, setNewTransaction] = useState({
    date: new Date().toISOString().split('T')[0],
    type: "income",
    category: "",
    amount: "",
    description: ""
  });
  
  const [studentFilterYear, setStudentFilterYear] = useState(new Date().getFullYear().toString());
  const [studentFilterDept, setStudentFilterDept] = useState("");
  const [studentFilterJamat, setStudentFilterJamat] = useState("");
  const [resYear, setResYear] = useState(new Date().getFullYear().toString());
  const [resExam, setResExam] = useState("বার্ষিক পরীক্ষা");
  const [resDept, setResDept] = useState("");
  const [resJamat, setResJamat] = useState("");
  const [resSubjects, setResSubjects] = useState("কুরআন, হাদীস, ফিকহ, বাংলা");
  const [viewResults, setViewResults] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [securityData, setSecurityData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const navigate = useNavigate();
  const { refreshData } = useData();

  useEffect(() => {
    const userStr = localStorage.getItem("adminUser");
    if (userStr) {
      setAdminUser(JSON.parse(userStr));
    }
  }, []);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      navigate("/admin/login");
    } else {
      fetchData();
      fetchGallery();
    }
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setGallery(data);
    } catch (err) {
      console.error("Error fetching gallery:", err);
    }
  };

  useEffect(() => {
    if (adminUser?.role === "super_admin") {
      fetchUsers();
    }
  }, [adminUser]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleApproveUser = async (userId: string) => {
    const password = prompt("এই ইউজারের জন্য একটি পাসওয়ার্ড দিন:");
    if (!password) return;

    try {
      const res = await fetch("/api/admin/approve-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      if (res.ok) {
        alert("ইউজার অ্যাপ্রুভ করা হয়েছে। তাকে পাসওয়ার্ডটি জানিয়ে দিন।");
        fetchUsers();
      }
    } catch (err) {
      alert("অ্যাপ্রুভ করা সম্ভব হয়নি।");
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই ইউজারকে রিমুভ করতে চান?")) return;

    try {
      const res = await fetch("/api/admin/remove-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (err) {
      alert("রিমুভ করা সম্ভব হয়নি।");
    }
  };

  const handleResetUserPassword = async (userId: string) => {
    const newPassword = prompt("নতুন পাসওয়ার্ডটি লিখুন:");
    if (!newPassword) return;
    
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword }),
      });
      if (res.ok) {
        alert("পাসওয়ার্ড সফলভাবে রিসেট হয়েছে।");
      } else {
        alert("পাসওয়ার্ড রিসেট করা সম্ভব হয়নি।");
      }
    } catch (err) {
      console.error("Error resetting password:", err);
      alert("সার্ভারে সমস্যা হচ্ছে।");
    }
  };

  const handleUpdateRoll = async (id: number, roll: string) => {
    try {
      const res = await fetch("/api/admissions/update-roll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, roll }),
      });
      if (res.ok) {
        setAdmissions(prev => prev.map(app => app.id === id ? { ...app, roll } : app));
        alert("রোল নম্বর সফলভাবে আপডেট হয়েছে।");
        
        // Trigger data refresh to update results if needed
        const channel = new BroadcastChannel("app_data_sync");
        channel.postMessage("refresh");
        channel.close();
      } else {
        alert("রোল নম্বর আপডেট করা সম্ভব হয়নি।");
      }
    } catch (err) {
      console.error("Error updating roll:", err);
      alert("সার্ভারে সমস্যা হচ্ছে।");
    }
  };

  const handleUpdatePhoto = async (id: number, photoUrl: string) => {
    try {
      const res = await fetch("/api/admissions/update-photo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, photoUrl }),
      });
      if (res.ok) {
        setAdmissions(prev => prev.map(a => a.id === id ? { ...a, photoUrl } : a));
        alert("ছবি আপডেট করা হয়েছে।");
        
        // Trigger data refresh to update results if needed
        const channel = new BroadcastChannel("app_data_sync");
        channel.postMessage("refresh");
        channel.close();
      } else {
        alert("ছবি আপডেট করা সম্ভব হয়নি।");
      }
    } catch (err) {
      console.error("Error updating photo:", err);
      alert("সার্ভারে সমস্যা হচ্ছে।");
    }
  };

  const handleUpdateStudent = async () => {
    if (!editingStudentData.studentNameBn || !editingStudentData.department || !editingStudentData.classToAdmit) {
      alert("নাম, বিভাগ এবং জামাত আবশ্যক।");
      return;
    }
    try {
      const res = await fetch("/api/admissions/update-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingStudentData.id, studentData: editingStudentData }),
      });
      if (res.ok) {
        setAdmissions(prev => prev.map(a => a.id === editingStudentData.id ? { ...a, ...editingStudentData } : a));
        setIsEditStudentModalOpen(false);
        setEditingStudentData(null);
        alert("ছাত্রের তথ্য আপডেট করা হয়েছে।");
        
        // Trigger data refresh to update results if needed
        const channel = new BroadcastChannel("app_data_sync");
        channel.postMessage("refresh");
        channel.close();
      } else {
        alert("তথ্য আপডেট করা সম্ভব হয়নি।");
      }
    } catch (err) {
      console.error("Error updating student:", err);
      alert("সার্ভারে সমস্যা হচ্ছে।");
    }
  };

  const handleAddOfflineStudent = async () => {
    if (!offlineStudentData.studentNameBn || !offlineStudentData.classToAdmit) {
      alert("নাম এবং জামাত আবশ্যক।");
      return;
    }
    try {
      const res = await fetch("/api/admissions/add-offline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offlineStudentData),
      });
      if (res.ok) {
        const { application } = await res.json();
        setAdmissions(prev => [...prev, application]);
        setIsOfflineStudentModalOpen(false);
        setOfflineStudentData({
          year: new Date().getFullYear().toString(),
          studentNameBn: "",
          fatherName: "",
          department: "",
          classToAdmit: "",
          roll: "",
          contactNumber: "",
          photoUrl: ""
        });
        alert("অফলাইন ছাত্র যোগ করা হয়েছে।");
      }
    } catch (err) {
      console.error("Error adding offline student:", err);
    }
  };

  useEffect(() => {
    if (!resJamat || !data?.results) {
      setViewResults([]);
      return;
    }
    const students = admissions.filter(a => a.status === "approved" && a.classToAdmit === resJamat);
    const subjects = resSubjects.split(',').map(s => s.trim()).filter(Boolean);
    
    const newViewResults: any[] = [];
    const processedResultIds = new Set();
    
    // 1. Process students from admissions
    students.forEach(student => {
      let existing = data.results.find((r: any) => r.year === resYear && r.exam === resExam && r.class === resJamat && (r.admissionId === student.id || (!r.admissionId && r.name === student.studentNameBn)));
      
      if (existing) {
        processedResultIds.add(existing.id);
        const updatedMarks = { ...existing.marks };
        subjects.forEach(sub => {
          if (updatedMarks[sub] === undefined) updatedMarks[sub] = 0;
        });
        newViewResults.push({ ...existing, admissionId: student.id, name: student.studentNameBn, roll: student.roll || existing.roll, fatherName: student.fatherName, photoUrl: student.photoUrl, marks: updatedMarks });
      } else {
        newViewResults.push({
          id: Date.now() + Math.random(),
          admissionId: student.id,
          roll: student.roll || "",
          name: student.studentNameBn,
          fatherName: student.fatherName,
          photoUrl: student.photoUrl,
          class: resJamat,
          exam: resExam,
          year: resYear,
          marks: subjects.reduce((acc: any, sub) => ({ ...acc, [sub]: 0 }), {}),
          total: 0,
          position: 0,
          published: false
        });
      }
    });

    // 2. Add any other results for this year/exam/class that aren't tied to the above students
    const otherResults = data.results.filter((r: any) => 
      r.year === resYear && 
      r.exam === resExam && 
      r.class === resJamat && 
      !processedResultIds.has(r.id)
    );

    otherResults.forEach((r: any) => {
      const updatedMarks = { ...r.marks };
      subjects.forEach(sub => {
        if (updatedMarks[sub] === undefined) updatedMarks[sub] = 0;
      });
      newViewResults.push({ ...r, marks: updatedMarks });
    });
    
    setViewResults(newViewResults);
  }, [resYear, resExam, resJamat, resSubjects, data?.results, admissions]);

  const handleUpdateAdmissionStatus = async (id: number, status: string, roll?: string) => {
    try {
      const payload: any = { id, status };
      if (roll !== undefined) payload.roll = roll;

      const res = await fetch("/api/admissions/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setAdmissions(prev => prev.map(app => app.id === id ? { ...app, status, ...(roll !== undefined && { roll }) } : app));
        alert("স্ট্যাটাস আপডেট করা হয়েছে।");
        
        // Trigger data refresh to update results if needed
        const channel = new BroadcastChannel("app_data_sync");
        channel.postMessage("refresh");
        channel.close();
      }
    } catch (err) {
      alert("আপডেট করা সম্ভব হয়নি।");
    }
  };

  const handleDeleteAdmission = async (id: number) => {
    if (!window.confirm("আপনি কি নিশ্চিতভাবে এই আবেদনটি ডিলিট করতে চান?")) return;
    try {
      const res = await fetch("/api/admissions/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setAdmissions(prev => prev.filter(app => app.id !== id));
        alert("আবেদনটি ডিলিট করা হয়েছে।");
      }
    } catch (err) {
      alert("ডিলিট করা সম্ভব হয়নি।");
    }
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/data");
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json);
      if (json.admissions) {
        setAdmissions(json.admissions);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const handleSaveResults = async () => {
    let allOtherResults = (data.results || []).filter((r: any) => 
      !(r.year === resYear && r.exam === resExam && r.class === resJamat)
    );
    
    let updatedResults = [...allOtherResults, ...viewResults];
    
    setData({ ...data, results: updatedResults });
    await handleSave("results", updatedResults);
  };

  const handleDownloadTemplate = () => {
    if (!resJamat || !resExam || !resYear) {
      alert("দয়া করে বছর, পরীক্ষা এবং জামাত নির্বাচন করুন।");
      return;
    }
    const subjects = resSubjects.split(',').map(s => s.trim()).filter(Boolean);
    const headers = ["Roll", "Name", "Father Name", ...subjects, "Total", "Position"];
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, `${resJamat}_${resExam}_${resYear}_Template.xlsx`);
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!resJamat || !resExam || !resYear) {
      alert("দয়া করে বছর, পরীক্ষা এবং জামাত নির্বাচন করুন।");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const excelData = XLSX.utils.sheet_to_json(ws);

        const subjects = resSubjects.split(',').map(s => s.trim()).filter(Boolean);
        
        const newResults = excelData.map((row: any) => {
          const marks: Record<string, number> = {};
          let total = 0;
          subjects.forEach(sub => {
            const mark = parseInt(row[sub]) || 0;
            marks[sub] = mark;
            total += mark;
          });

          return {
            id: Date.now() + Math.random(),
            roll: String(row["Roll"] || ""),
            name: String(row["Name"] || ""),
            fatherName: String(row["Father Name"] || ""),
            class: resJamat,
            exam: resExam,
            year: resYear,
            marks,
            total: parseInt(row["Total"]) || total,
            position: parseInt(row["Position"]) || 0,
            published: true
          };
        });

        const res = await fetch("/api/results/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newResults })
        });

        if (res.ok) {
          alert("সফলভাবে এক্সেল থেকে রেজাল্ট আপলোড হয়েছে!");
          const channel = new BroadcastChannel("app_data_sync");
          channel.postMessage("refresh");
          channel.close();
          window.location.reload();
        } else {
          alert("আপলোড ব্যর্থ হয়েছে।");
        }
      } catch (err) {
        console.error(err);
        alert("ফাইল প্রসেস করতে সমস্যা হয়েছে। সঠিক টেমপ্লেট ব্যবহার করেছেন কিনা নিশ্চিত করুন।");
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async (type: string, payload: any, silent: boolean = false) => {
    try {
      const res = await fetch(`/api/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        if (!silent) alert("সফলভাবে সংরক্ষিত হয়েছে!");
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
      if (!silent) alert("সংরক্ষণ করা সম্ভব হয়নি।");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, aspect: number = 1) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEditingImage({ 
        url: reader.result as string, 
        field, 
        aspect,
        callback: async (croppedUrl: string) => {
          const updatedSettings = { ...data.settings, [field]: croppedUrl };
          setData({ ...data, settings: updatedSettings });
          
          // Auto-save for logo and heroImage
          if (field === "logo" || field === "heroImage") {
            handleSave("settings", updatedSettings, true);
          }
          
          fetchGallery();
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!editingImage) return;

    const formData = new FormData();
    formData.append("file", croppedBlob, "cropped-image.png");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const { url } = await res.json();
      
      if (editingImage.callback) {
        editingImage.callback(url);
      }
      
      setEditingImage(null);
      fetchGallery();
    } catch (err) {
      console.error("Error uploading cropped image:", err);
    }
  };

  const openGalleryPicker = (callback: (url: string) => void) => {
    setGalleryCallback(() => callback);
    setIsGalleryModalOpen(true);
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
            { id: "about", label: "আমাদের সম্পর্কে", icon: BookOpen },
            { id: "departments", label: "বিভাগসমূহ", icon: LayoutGrid },
            { id: "hisab", label: "হিসাব সেকশন", icon: Wallet },
            { id: "gallery", label: "গ্যালারি", icon: ImageIcon },
            { id: "security", label: "নিরাপত্তা", icon: Shield },
            { id: "notices", label: "নোটিশ বোর্ড", icon: Bell },
            { id: "teachers", label: "শিক্ষক তালিকা", icon: Users },
            { id: "admission", label: "ভর্তি তথ্য", icon: Plus },
            { id: "admissions_list", label: "ভর্তি আবেদন", icon: UserPlus },
            { id: "students_list", label: "ছাত্র তালিকা", icon: GraduationCap },
            { id: "results", label: "ফলাফল ব্যবস্থাপনা", icon: FileText },
            ...(adminUser?.role === "super_admin" ? [{ id: "users", label: "ইউজার ম্যানেজমেন্ট", icon: UserPlus }] : []),
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
            {activeTab === "admissions_list" && "ভর্তি আবেদন তালিকা"}
            {activeTab === "students_list" && "ছাত্র তালিকা"}
            {activeTab === "results" && "ফলাফল ব্যবস্থাপনা"}
            {activeTab === "users" && "ইউজার ম্যানেজমেন্ট"}
            {activeTab === "gallery" && "মিডিয়া গ্যালারি"}
            {activeTab === "security" && "নিরাপত্তা সেটিংস"}
          </h2>
          <div className="text-sm font-sans text-on-surface-variant bg-white px-4 py-2 rounded-full shadow-sm">
            Welcome, {adminUser?.name || "Administrator"}
          </div>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-outline-variant/10">
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bengali text-on-surface-variant">আপনার আপলোড করা সকল ছবি এখানে পাবেন।</p>
                <label className="cursor-pointer bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md">
                  <Upload size={18} /> নতুন ছবি আপলোড
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        setEditingImage({ 
                          url: reader.result as string, 
                          aspect: 1,
                          callback: () => fetchGallery()
                        });
                      };
                      reader.readAsDataURL(file);
                    }} 
                  />
                </label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {gallery.map((url, idx) => (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-outline-variant/20 shadow-sm hover:shadow-md transition-all">
                    <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                       <button 
                         onClick={() => setEditingImage({ url, aspect: 1, callback: () => fetchGallery() })}
                         className="p-2 bg-white text-primary rounded-full hover:bg-primary hover:text-white transition-all"
                         title="ক্রপ করুন"
                       >
                         <Crop size={16} />
                       </button>
                       <a 
                         href={url} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="p-2 bg-white text-primary rounded-full hover:bg-primary hover:text-white transition-all"
                         title="বড় করে দেখুন"
                       >
                         <Search size={16} />
                       </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "users" && adminUser?.role === "super_admin" && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-bengali">
                  <thead>
                    <tr className="border-b border-outline-variant">
                      <th className="py-4 px-4">নাম</th>
                      <th className="py-4 px-4">ইমেইল</th>
                      <th className="py-4 px-4">ডকুমেন্ট</th>
                      <th className="py-4 px-4">স্ট্যাটাস</th>
                      <th className="py-4 px-4">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-outline-variant/50 hover:bg-surface-container-lowest transition-colors">
                        <td className="py-4 px-4 font-bold">{user.full_name}</td>
                        <td className="py-4 px-4 text-sm">{user.email}</td>
                        <td className="py-4 px-4">
                          {user.documents_url && (
                            <a href={user.documents_url} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1 hover:underline">
                              <ExternalLink size={14} /> দেখুন
                            </a>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            user.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {user.status === "approved" ? "অ্যাপ্রুভড" : "পেন্ডিং"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            {user.status === "pending" && (
                              <button
                                onClick={() => handleApproveUser(user.id)}
                                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                title="অ্যাপ্রুভ করুন"
                              >
                                <Check size={16} />
                              </button>
                            )}
                            {user.role !== "super_admin" && (
                              <button
                                onClick={() => handleRemoveUser(user.id)}
                                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                title="রিমুভ করুন"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                            {user.status === "approved" && (
                              <button
                                onClick={() => handleResetUserPassword(user.id)}
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                title="পাসওয়ার্ড রিসেট"
                              >
                                <Key size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
                    <div className="bg-white rounded-lg p-1 border border-outline-variant">
                      <img 
                        src={data.settings.logo} 
                        alt="Logo" 
                        className="w-16 h-16 object-contain" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuCMu0I0-nAJDaXwovvUL2h5E0lfJb2QiBph-NR8_oAyRv1Q3-fJBW3M1dnre4ZITR4zaTtV4uH14LW4Aqk26VWtc3leQbr6yRmlC4bZSBoV73fFaesFfXvjrQApCQWVTSW7pLrZy3Uw4MC27721dCQ9dcwyIxngTJrcVUISP_unAq58uXY1KWjGj-7sOnZA_CMs6rJPvuqIojqLt15Che6qnY2rl6rj2v-u9LtK8Ne_L4mQZSUZ3pf9MRJWgeYnSMid82DodR7LaKA7";
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-primary/90 transition-all">
                        <Upload size={14} /> আপলোড
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "logo", 1)} />
                      </label>
                      <button 
                        onClick={() => openGalleryPicker((url) => {
                          const updatedSettings = { ...data.settings, logo: url };
                          setData({ ...data, settings: updatedSettings });
                          handleSave("settings", updatedSettings, true);
                        })}
                        className="bg-primary-container text-primary px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-primary/10 transition-all"
                      >
                        <ImageIcon size={14} /> গ্যালারি
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-2">হিরো ইমেজ (ব্যানার)</label>
                <div className="space-y-4">
                  <img 
                    src={data.settings.heroImage} 
                    alt="Hero" 
                    className="w-full h-48 object-cover rounded-xl border" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuBJcxE_WaNYk8wxz2Me4i9AQSv8iDrQualK7rRMUDTazl5k_4TdRwpFgNEVGvtc-wlzxpLmwlgITaQGqaNAhpZjavwNuWIM_-HYT-dBEVean4UsaYe6JgEivd4m7S9FlvixPIoFZhMdyeyhLl6yVBJKI4dv0WsDJNl-rdEbH5JN0Z-WETzTJRJgW03FfmwLaTOa4H-zq7fROrsW0PH1HqEWEIk6-aF98dsPt4bj1cB9FRrm4j-PSEanPh-bsOSUV4LTfoAukUxHTyRf";
                    }}
                  />
                  <div className="flex gap-4">
                    <label className="cursor-pointer bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold inline-flex items-center gap-2 hover:bg-primary/90 transition-all">
                      <Upload size={16} /> নতুন ব্যানার আপলোড
                      <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, "heroImage", 16/9)} />
                    </label>
                    <button 
                      onClick={() => openGalleryPicker((url) => {
                        const updatedSettings = { ...data.settings, heroImage: url };
                        setData({ ...data, settings: updatedSettings });
                        handleSave("settings", updatedSettings, true);
                      })}
                      className="bg-primary-container text-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-primary/10 transition-all"
                    >
                      <ImageIcon size={16} /> গ্যালারি থেকে নিন
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-2">গ্যালারি ইমেজ (ইভেন্ট ফটো)</label>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                  {data.settings.gallery?.map((img: string, idx: number) => (
                    <div key={idx} className="relative group aspect-[4/3] rounded-xl overflow-hidden border-2 border-outline-variant/30 shadow-sm bg-surface-container-highest">
                      <img src={img} alt="Gallery" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            const newGallery = [...data.settings.gallery];
                            newGallery.splice(idx, 1);
                            setData({ ...data, settings: { ...data.settings, gallery: newGallery } });
                          }}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="flex flex-col gap-2">
                    <label className="cursor-pointer border-2 border-dashed border-outline-variant rounded-lg flex flex-col items-center justify-center h-32 hover:bg-surface-container-high transition-all w-full">
                      <Plus size={24} className="text-on-surface-variant" />
                      <span className="text-xs font-bengali text-on-surface-variant">আপলোড করুন</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => {
                            setEditingImage({ 
                              url: reader.result as string, 
                              aspect: 4/3,
                              callback: (url) => {
                                const newGallery = [...(data.settings.gallery || []), url];
                                setData({ ...data, settings: { ...data.settings, gallery: newGallery } });
                                fetchGallery();
                              }
                            });
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                    <button 
                      onClick={() => openGalleryPicker((url) => {
                        const newGallery = [...(data.settings.gallery || []), url];
                        setData({ ...data, settings: { ...data.settings, gallery: newGallery } });
                      })}
                      className="bg-primary-container text-primary py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-primary/10 transition-all"
                    >
                      <ImageIcon size={14} /> গ্যালারি থেকে যোগ করুন
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bengali font-bold text-on-surface mb-2">ফোন নম্বর (কমা দিয়ে একাধিক)</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                    value={data.settings.phone || ""}
                    onChange={(e) => setData({ ...data, settings: { ...data.settings, phone: e.target.value } })}
                    placeholder="যেমন: 01700-000000, 01800-000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bengali font-bold text-on-surface mb-2">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                    value={data.settings.email || ""}
                    onChange={(e) => setData({ ...data, settings: { ...data.settings, email: e.target.value } })}
                    placeholder="যেমন: info@madrasa.edu"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-2">গুগল ম্যাপ এমবেড লিঙ্ক (Embed URL)</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                  value={data.settings.mapUrl || ""}
                  onChange={(e) => setData({ ...data, settings: { ...data.settings, mapUrl: e.target.value } })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
                <p className="mt-1 text-xs text-on-surface-variant font-bengali">গুগল ম্যাপ থেকে Share {">"} Embed a map {">"} src লিঙ্কের অংশটুকু এখানে দিন।</p>
              </div>
              <button
                onClick={() => handleSave("settings", data.settings)}
                className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bengali font-bold text-lg flex items-center gap-2 hover:shadow-lg transition-all"
              >
                <Save size={20} /> সেটিংস সেভ করুন
              </button>
            </div>
          )}

          {activeTab === "about" && (
            <div className="space-y-8 max-w-4xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bengali font-bold text-primary">আমাদের সম্পর্কে (About Us) এডিট করুন</h2>
                <button
                  onClick={() => handleSave("about", data.about)}
                  className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bengali font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                >
                  <Save size={18} /> সেভ করুন
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 space-y-4">
                  <h3 className="font-bengali font-bold text-lg text-primary border-b pb-2">হিরো সেকশন</h3>
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">প্রধান শিরোনাম</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                      value={data.about?.heroTitle || ""}
                      onChange={(e) => setData({ ...data, about: { ...data.about, heroTitle: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">উপ-শিরোনাম</label>
                    <textarea
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                      value={data.about?.heroSubtitle || ""}
                      onChange={(e) => setData({ ...data, about: { ...data.about, heroSubtitle: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 space-y-4">
                  <h3 className="font-bengali font-bold text-lg text-primary border-b pb-2">ইতিহাস সেকশন</h3>
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">ইতিহাস শিরোনাম</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                      value={data.about?.historyTitle || ""}
                      onChange={(e) => setData({ ...data, about: { ...data.about, historyTitle: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">ইতিহাস বর্ণনা</label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                      value={data.about?.historyContent || ""}
                      onChange={(e) => setData({ ...data, about: { ...data.about, historyContent: e.target.value } })}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 space-y-4">
                  <h3 className="font-bengali font-bold text-lg text-primary border-b pb-2">লক্ষ্য ও উদ্দেশ্য</h3>
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">লক্ষ্য (Mission) শিরোনাম</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                      value={data.about?.missionTitle || ""}
                      onChange={(e) => setData({ ...data, about: { ...data.about, missionTitle: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">লক্ষ্য বর্ণনা</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                      value={data.about?.missionContent || ""}
                      onChange={(e) => setData({ ...data, about: { ...data.about, missionContent: e.target.value } })}
                    />
                  </div>
                  <div className="pt-4">
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">উদ্দেশ্য (Vision) শিরোনাম</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                      value={data.about?.visionTitle || ""}
                      onChange={(e) => setData({ ...data, about: { ...data.about, visionTitle: e.target.value } })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">উদ্দেশ্য বর্ণনা</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                      value={data.about?.visionContent || ""}
                      onChange={(e) => setData({ ...data, about: { ...data.about, visionContent: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 space-y-4">
                  <h3 className="font-bengali font-bold text-lg text-primary border-b pb-2">মুহতামিম বাণী ও সুযোগ-সুবিধা</h3>
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">মুহতামিম বাণী</label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                      value={data.about?.principalQuote || ""}
                      onChange={(e) => setData({ ...data, about: { ...data.about, principalQuote: e.target.value } })}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <h4 className="font-bengali font-bold text-md text-on-surface mb-4">সুযোগ-সুবিধাসমূহ</h4>
                    <div className="space-y-4">
                      {data.about?.facilities?.map((facility: any, idx: number) => (
                        <div key={idx} className="p-4 border border-outline-variant/20 rounded-lg bg-surface-container-low">
                          <div className="grid grid-cols-2 gap-2 mb-2">
                            <input
                              type="text"
                              placeholder="শিরোনাম"
                              className="px-3 py-1 rounded border border-outline-variant text-sm font-bengali"
                              value={facility.title}
                              onChange={(e) => {
                                const newFacilities = [...data.about.facilities];
                                newFacilities[idx].title = e.target.value;
                                setData({ ...data, about: { ...data.about, facilities: newFacilities } });
                              }}
                            />
                            <input
                              type="text"
                              placeholder="আইকন (Lucide icon name)"
                              className="px-3 py-1 rounded border border-outline-variant text-sm font-sans"
                              value={facility.icon}
                              onChange={(e) => {
                                const newFacilities = [...data.about.facilities];
                                newFacilities[idx].icon = e.target.value;
                                setData({ ...data, about: { ...data.about, facilities: newFacilities } });
                              }}
                            />
                          </div>
                          <textarea
                            placeholder="বর্ণনা"
                            className="w-full px-3 py-1 rounded border border-outline-variant text-sm font-bengali"
                            rows={2}
                            value={facility.desc}
                            onChange={(e) => {
                              const newFacilities = [...data.about.facilities];
                              newFacilities[idx].desc = e.target.value;
                              setData({ ...data, about: { ...data.about, facilities: newFacilities } });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "departments" && (
            <div className="space-y-8 max-w-4xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bengali font-bold text-primary">শিক্ষা বিভাগসমূহ এডিট করুন</h2>
                <button
                  onClick={() => handleSave("departments", data.departments)}
                  className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bengali font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                >
                  <Save size={18} /> সেভ করুন
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.departments?.map((dept: any, idx: number) => (
                  <div key={idx} className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 space-y-4 relative group">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bengali font-bold text-lg text-primary">বিভাগ {idx + 1}</h3>
                      <button
                        onClick={() => {
                          const newDepts = data.departments.filter((_: any, i: number) => i !== idx);
                          setData({ ...data, departments: newDepts });
                        }}
                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div>
                      <label className="block text-sm font-bengali font-bold text-on-surface mb-2">বিভাগের নাম</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                        value={dept.title}
                        onChange={(e) => {
                          const newDepts = [...data.departments];
                          newDepts[idx].title = e.target.value;
                          setData({ ...data, departments: newDepts });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bengali font-bold text-on-surface mb-2">আইকন (Material icon name)</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                        value={dept.icon}
                        onChange={(e) => {
                          const newDepts = [...data.departments];
                          newDepts[idx].icon = e.target.value;
                          setData({ ...data, departments: newDepts });
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bengali font-bold text-on-surface mb-2">সংক্ষিপ্ত বর্ণনা</label>
                      <textarea
                        rows={3}
                        className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                        value={dept.desc}
                        onChange={(e) => {
                          const newDepts = [...data.departments];
                          newDepts[idx].desc = e.target.value;
                          setData({ ...data, departments: newDepts });
                        }}
                      />
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    const newDepts = [...(data.departments || []), { title: "", desc: "", icon: "school" }];
                    setData({ ...data, departments: newDepts });
                  }}
                  className="border-2 border-dashed border-outline-variant rounded-xl p-6 flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-all"
                >
                  <Plus size={32} />
                  <span className="font-bengali font-bold mt-2">নতুন বিভাগ যোগ করুন</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="max-w-md space-y-8">
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20">
                <h3 className="text-xl font-bengali font-bold text-primary mb-6 flex items-center gap-2">
                  <Shield size={24} /> পাসওয়ার্ড পরিবর্তন করুন
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">বর্তমান পাসওয়ার্ড</label>
                    <input
                      type="password"
                      value={securityData.oldPassword}
                      onChange={(e) => setSecurityData({ ...securityData, oldPassword: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                      placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">নতুন পাসওয়ার্ড</label>
                    <input
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                      placeholder="নতুন পাসওয়ার্ড লিখুন"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">পাসওয়ার্ড নিশ্চিত করুন</label>
                    <input
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                      placeholder="নতুন পাসওয়ার্ড আবার লিখুন"
                    />
                  </div>
                  
                  <button
                    onClick={async () => {
                      if (!securityData.oldPassword || !securityData.newPassword || !securityData.confirmPassword) {
                        return alert("সবগুলো ঘর পূরণ করুন!");
                      }
                      if (securityData.newPassword !== securityData.confirmPassword) {
                        return alert("নতুন পাসওয়ার্ড এবং কনফার্ম পাসওয়ার্ড মিলেনি!");
                      }
                      
                      try {
                        const res = await fetch("/api/change-password", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ 
                            email: adminUser?.email, 
                            oldPassword: securityData.oldPassword,
                            newPassword: securityData.newPassword 
                          }),
                        });
                        
                        if (res.ok) {
                          alert("পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!");
                          setSecurityData({ oldPassword: "", newPassword: "", confirmPassword: "" });
                        } else {
                          const errData = await res.json();
                          alert(errData.error || "পাসওয়ার্ড পরিবর্তন করা সম্ভব হয়নি।");
                        }
                      } catch (err) {
                        console.error("Error changing password:", err);
                        alert("সার্ভারে সমস্যা হচ্ছে।");
                      }
                    }}
                    className="w-full bg-primary text-on-primary py-3 rounded-lg font-bengali font-bold text-lg hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Save size={20} /> পাসওয়ার্ড আপডেট করুন
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notices" && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setData({ ...data, notices: [{ id: Date.now(), date: "01", month: "Jan", title: "নতুন নোটিশ", desc: "বিস্তারিত এখানে লিখুন..." }, ...data.notices] })}
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

          {activeTab === "hisab" && (
            <div className="space-y-8 max-w-6xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bengali font-bold text-primary">মাদরাসার হিসাব ব্যবস্থাপনা</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      const csvContent = "Date,Type,Category,Amount,Description\n" + 
                        data.transactions.map((t: any) => `${t.date},${t.type},${t.category},${t.amount},${t.description}`).join("\n");
                      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                      const link = document.createElement("a");
                      link.href = URL.createObjectURL(blob);
                      link.download = "hisab_report.csv";
                      link.click();
                    }}
                    className="bg-secondary text-on-secondary px-4 py-2 rounded-lg font-bengali font-bold flex items-center gap-2 hover:shadow-lg transition-all"
                  >
                    <Download size={18} /> রিপোর্ট ডাউনলোড
                  </button>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-on-surface-variant font-bengali">মোট আয়</p>
                      <h3 className="text-2xl font-bold text-green-600 font-sans">
                        ৳ {data.transactions?.filter((t: any) => t.type === "income").reduce((acc: number, t: any) => acc + Number(t.amount), 0).toLocaleString()}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                      <TrendingDown size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-on-surface-variant font-bengali">মোট ব্যয়</p>
                      <h3 className="text-2xl font-bold text-red-600 font-sans">
                        ৳ {data.transactions?.filter((t: any) => t.type === "expense").reduce((acc: number, t: any) => acc + Number(t.amount), 0).toLocaleString()}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                      <Wallet size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-on-surface-variant font-bengali">বর্তমান ব্যালেন্স</p>
                      <h3 className="text-2xl font-bold text-primary font-sans">
                        ৳ {(
                          data.transactions?.filter((t: any) => t.type === "income").reduce((acc: number, t: any) => acc + Number(t.amount), 0) -
                          data.transactions?.filter((t: any) => t.type === "expense").reduce((acc: number, t: any) => acc + Number(t.amount), 0)
                        ).toLocaleString()}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Transaction Form */}
                <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 h-fit">
                  <h3 className="text-xl font-bengali font-bold text-primary mb-6">নতুন এন্ট্রি যোগ করুন</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bengali font-bold text-on-surface mb-2">তারিখ</label>
                      <input
                        type="date"
                        className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bengali font-bold text-on-surface mb-2">ধরণ</label>
                      <select
                        className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                        value={newTransaction.type}
                        onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
                      >
                        <option value="income">আয় (Income)</option>
                        <option value="expense">ব্যয় (Expense)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bengali font-bold text-on-surface mb-2">ক্যাটাগরি</label>
                      <input
                        type="text"
                        placeholder="যেমন: দান, বেতন, খাবার"
                        className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                        value={newTransaction.category}
                        onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bengali font-bold text-on-surface mb-2">পরিমাণ (টাকা)</label>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bengali font-bold text-on-surface mb-2">বিবরণ</label>
                      <textarea
                        rows={3}
                        placeholder="সংক্ষিপ্ত বিবরণ..."
                        className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                        value={newTransaction.description}
                        onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!newTransaction.amount || !newTransaction.category) {
                          alert("পরিমাণ এবং ক্যাটাগরি আবশ্যক!");
                          return;
                        }
                        const updatedTransactions = [
                          { ...newTransaction, id: Date.now() },
                          ...(data.transactions || [])
                        ];
                        handleSave("transactions", updatedTransactions);
                        setNewTransaction({
                          date: new Date().toISOString().split('T')[0],
                          type: "income",
                          category: "",
                          amount: "",
                          description: ""
                        });
                      }}
                      className="w-full bg-primary text-on-primary py-3 rounded-lg font-bengali font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={20} /> এন্ট্রি সেভ করুন
                    </button>
                  </div>
                </div>

                {/* Transactions List */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
                  <h3 className="text-xl font-bengali font-bold text-primary mb-6">সাম্প্রতিক লেনদেনসমূহ</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/30">
                          <th className="py-4 px-4 font-bengali font-bold text-on-surface">তারিখ</th>
                          <th className="py-4 px-4 font-bengali font-bold text-on-surface">ক্যাটাগরি</th>
                          <th className="py-4 px-4 font-bengali font-bold text-on-surface">বিবরণ</th>
                          <th className="py-4 px-4 font-bengali font-bold text-on-surface text-right">পরিমাণ</th>
                          <th className="py-4 px-4 font-bengali font-bold text-on-surface text-center">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.transactions?.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t: any) => (
                          <tr key={t.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors">
                            <td className="py-4 px-4 font-sans text-sm">{t.date}</td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-bengali font-bold ${
                                t.type === "income" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}>
                                {t.category}
                              </span>
                            </td>
                            <td className="py-4 px-4 font-bengali text-sm text-on-surface-variant max-w-[200px] truncate">{t.description}</td>
                            <td className={`py-4 px-4 font-sans font-bold text-right ${
                              t.type === "income" ? "text-green-600" : "text-red-600"
                            }`}>
                              {t.type === "income" ? "+" : "-"} ৳ {Number(t.amount).toLocaleString()}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <button
                                onClick={() => {
                                  if (confirm("আপনি কি নিশ্চিতভাবে এই এন্ট্রিটি ডিলিট করতে চান?")) {
                                    const updatedTransactions = data.transactions.filter((item: any) => item.id !== t.id);
                                    handleSave("transactions", updatedTransactions);
                                  }
                                }}
                                className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {(!data.transactions || data.transactions.length === 0) && (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-on-surface-variant font-bengali">কোনো লেনদেন পাওয়া যায়নি।</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Donation Settings */}
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-outline-variant/10 mt-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bengali font-bold text-primary">অনলাইন দান সংক্রান্ত তথ্য (Donation Info)</h3>
                    <p className="text-on-surface-variant font-bengali text-sm">হোমপেজের "অনলাইন দান করুন" বাটনে এই তথ্যগুলো প্রদর্শিত হবে</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="font-bengali font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                      <span className="material-symbols-outlined text-primary">account_balance</span>
                      ব্যাংক একাউন্ট তথ্য
                    </h4>
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-bengali font-bold text-on-surface mb-2">ব্যাংকের নাম</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali bg-surface-container-low"
                          value={data.donationInfo?.bankName || ""}
                          onChange={(e) => setData({ ...data, donationInfo: { ...data.donationInfo, bankName: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bengali font-bold text-on-surface mb-2">একাউন্ট নাম</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali bg-surface-container-low"
                          value={data.donationInfo?.accountName || ""}
                          onChange={(e) => setData({ ...data, donationInfo: { ...data.donationInfo, accountName: e.target.value } })}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bengali font-bold text-on-surface mb-2">একাউন্ট নম্বর</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans bg-surface-container-low"
                            value={data.donationInfo?.accountNumber || ""}
                            onChange={(e) => setData({ ...data, donationInfo: { ...data.donationInfo, accountNumber: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bengali font-bold text-on-surface mb-2">শাখা</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali bg-surface-container-low"
                            value={data.donationInfo?.branch || ""}
                            onChange={(e) => setData({ ...data, donationInfo: { ...data.donationInfo, branch: e.target.value } })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="font-bengali font-bold text-on-surface flex items-center gap-2 border-b border-outline-variant/20 pb-3">
                      <span className="material-symbols-outlined text-secondary">smartphone</span>
                      মোবাইল ব্যাংকিং নম্বর
                    </h4>
                    <div className="grid gap-4">
                      <div>
                        <label className="block text-sm font-bengali font-bold text-on-surface mb-2">বিকাশ (bKash)</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans bg-surface-container-low"
                          value={data.donationInfo?.bkash || ""}
                          onChange={(e) => setData({ ...data, donationInfo: { ...data.donationInfo, bkash: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bengali font-bold text-on-surface mb-2">নগদ (Nagad)</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans bg-surface-container-low"
                          value={data.donationInfo?.nagad || ""}
                          onChange={(e) => setData({ ...data, donationInfo: { ...data.donationInfo, nagad: e.target.value } })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bengali font-bold text-on-surface mb-2">রকেট (Rocket)</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 rounded-xl border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-sans bg-surface-container-low"
                          value={data.donationInfo?.rocket || ""}
                          onChange={(e) => setData({ ...data, donationInfo: { ...data.donationInfo, rocket: e.target.value } })}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-6 border-t border-outline-variant/20">
                  <button
                    onClick={() => handleSave("donation", data.donationInfo)}
                    className="bg-primary text-on-primary px-10 py-4 rounded-xl font-bengali font-bold text-lg flex items-center gap-3 hover:shadow-xl hover:scale-[1.02] transition-all"
                  >
                    <Save size={22} /> দান সংক্রান্ত তথ্য আপডেট করুন
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "results" && (
            <div className="space-y-6">
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">শিক্ষাবর্ষ</label>
                    <select
                      value={resYear}
                      onChange={(e) => setResYear(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                    >
                      {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - 15 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">পরীক্ষার নাম</label>
                    <select
                      value={resExam}
                      onChange={(e) => setResExam(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                    >
                      <option value="প্রথম সাময়িক পরীক্ষা">প্রথম সাময়িক পরীক্ষা</option>
                      <option value="দ্বিতীয় সাময়িক পরীক্ষা">দ্বিতীয় সাময়িক পরীক্ষা</option>
                      <option value="বার্ষিক পরীক্ষা">বার্ষিক পরীক্ষা</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">বিভাগ নির্বাচন করুন</label>
                    <select
                      value={resDept}
                      onChange={(e) => {
                        setResDept(e.target.value);
                        setResJamat(""); // Reset class when department changes
                      }}
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                    >
                      <option value="">বিভাগ নির্বাচন করুন</option>
                      <option value="হিফজ বিভাগ">হিফজ বিভাগ</option>
                      <option value="কিতাব বিভাগ">কিতাব বিভাগ</option>
                      <option value="মক্তব বিভাগ">মক্তব বিভাগ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bengali font-bold text-on-surface mb-2">জামাত নির্বাচন করুন</label>
                    <select
                      value={resJamat}
                      onChange={(e) => setResJamat(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                      disabled={!resDept}
                    >
                      <option value="">জামাত নির্বাচন করুন</option>
                      {resDept === "হিফজ বিভাগ" && (
                        <>
                          <option value="মক্কী">মক্কী</option>
                          <option value="মাদানী">মাদানী</option>
                        </>
                      )}
                      {resDept === "কিতাব বিভাগ" && (
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
                      {resDept === "মক্তব বিভাগ" && (
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
                <div>
                  <label className="block text-sm font-bengali font-bold text-on-surface mb-2">বিষয়সমূহ (কমা দিয়ে আলাদা করুন)</label>
                  <input
                    type="text"
                    value={resSubjects}
                    onChange={(e) => setResSubjects(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                    placeholder="যেমন: কুরআন, হাদীস, ফিকহ, বাংলা"
                  />
                  <p className="text-xs text-on-surface-variant mt-1 font-bengali">এই বিষয়গুলো অনুযায়ী নিচের টেবিলে কলাম তৈরি হবে।</p>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center pt-4 border-t border-outline-variant/30">
                  <button
                    onClick={handleDownloadTemplate}
                    className="bg-secondary text-on-secondary px-4 py-2 rounded-lg font-bengali font-bold flex items-center gap-2 hover:bg-secondary/90 transition-colors text-sm"
                  >
                    <Download size={16} /> এক্সেল টেমপ্লেট ডাউনলোড
                  </button>
                  
                  <input 
                    type="file" 
                    accept=".xlsx, .xls, .csv" 
                    ref={fileInputRef} 
                    onChange={handleExcelUpload} 
                    className="hidden" 
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-tertiary text-on-tertiary px-4 py-2 rounded-lg font-bengali font-bold flex items-center gap-2 hover:bg-tertiary/90 transition-colors text-sm"
                  >
                    <FileSpreadsheet size={16} /> এক্সেল আপলোড
                  </button>
                </div>
              </div>

              {resJamat ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bengali text-on-surface-variant italic">* মার্কস ইনপুট দিলে টোটাল এবং পজিশন অটো-ক্যালকুলেট হবে</p>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
                    <table className="w-full text-left border-collapse font-bengali">
                      <thead className="bg-surface-container-high text-on-surface text-base uppercase tracking-wider">
                        <tr>
                          <th className="px-4 py-3 border-b">রোল</th>
                          <th className="px-4 py-3 border-b">নাম</th>
                          <th className="px-4 py-3 border-b">পিতার নাম</th>
                          {resSubjects.split(',').map(s => s.trim()).filter(Boolean).map(sub => (
                            <th key={sub} className="px-4 py-3 border-b">{sub}</th>
                          ))}
                          <th className="px-4 py-3 border-b">মোট</th>
                          <th className="px-4 py-3 border-b">মেধা</th>
                          <th className="px-4 py-3 border-b">অবস্থা</th>
                          <th className="px-4 py-3 border-b">অ্যাকশন</th>
                        </tr>
                      </thead>
                      <tbody className="text-base">
                        {viewResults.map((res: any, idx: number) => (
                          <tr key={res.id} className="hover:bg-surface-container-lowest transition-colors">
                            <td className="px-4 py-2 border-b">
                              <input
                                type="text"
                                value={res.roll}
                                onChange={(e) => {
                                  const newResults = [...viewResults];
                                  newResults[idx].roll = e.target.value;
                                  setViewResults(newResults);
                                }}
                                className="w-16 bg-transparent outline-none focus:ring-1 focus:ring-primary rounded px-1 border border-transparent hover:border-outline-variant/30 font-bold"
                              />
                            </td>
                            <td className="px-4 py-2 border-b">
                              <input
                                type="text"
                                value={res.name}
                                onChange={(e) => {
                                  const newResults = [...viewResults];
                                  newResults[idx].name = e.target.value;
                                  setViewResults(newResults);
                                }}
                                className="w-full bg-transparent outline-none focus:ring-1 focus:ring-primary rounded px-1 border border-transparent hover:border-outline-variant/30 font-bold text-primary"
                              />
                            </td>
                            <td className="px-4 py-2 border-b">
                              <input
                                type="text"
                                value={res.fatherName}
                                onChange={(e) => {
                                  const newResults = [...viewResults];
                                  newResults[idx].fatherName = e.target.value;
                                  setViewResults(newResults);
                                }}
                                className="w-full bg-transparent outline-none focus:ring-1 focus:ring-primary rounded px-1 border border-transparent hover:border-outline-variant/30 text-on-surface-variant"
                              />
                            </td>
                            {resSubjects.split(',').map(s => s.trim()).filter(Boolean).map(subject => (
                              <td key={subject} className="px-4 py-2 border-b">
                                <input
                                  type="text"
                                  className="w-16 bg-transparent outline-none focus:ring-1 focus:ring-primary rounded px-1 border border-outline-variant/30 text-center"
                                  value={res.marks[subject] || ""}
                                  onChange={(e) => {
                                    const newResults = [...viewResults];
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

                                    setViewResults(newResults);
                                  }}
                                />
                              </td>
                            ))}
                            <td className="px-4 py-2 border-b font-bold text-primary text-center">{res.total}</td>
                            <td className="px-4 py-2 border-b font-bold text-secondary text-center">{res.position}</td>
                            <td className="px-4 py-2 border-b">
                              <button
                                onClick={() => {
                                  const newResults = [...viewResults];
                                  newResults[idx].published = !newResults[idx].published;
                                  setViewResults(newResults);
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
                                onClick={() => {
                                  if (window.confirm("আপনি কি এই রেজাল্টটি মুছে ফেলতে চান?")) {
                                    const newResults = viewResults.filter((_, i) => i !== idx);
                                    setViewResults(newResults);
                                  }
                                }}
                                className="p-2 text-error hover:bg-error/10 rounded-full transition-colors"
                                title="ডিলিট করুন"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {viewResults.length === 0 && (
                          <tr>
                            <td colSpan={10} className="px-4 py-10 text-center text-on-surface-variant">
                              এই জামাতে কোনো ছাত্র পাওয়া যায়নি। প্রথমে ছাত্র তালিকা থেকে ছাত্র যোগ করুন অথবা এক্সেল আপলোড করুন।
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={handleSaveResults}
                    className="bg-primary text-on-primary px-8 py-3 rounded-lg font-bengali font-bold text-lg flex items-center gap-2 hover:shadow-lg transition-all"
                  >
                    <Save size={20} /> ফলাফল সেভ ও পাবলিশ করুন
                  </button>
                </div>
              ) : (
                <div className="py-20 text-center text-on-surface-variant font-bengali border-2 border-dashed border-outline-variant/30 rounded-xl">
                  ফলাফল দেখতে এবং এডিট করতে উপরের ফিল্টার থেকে একটি জামাত নির্বাচন করুন।
                </div>
              )}
            </div>
          )}

          {activeTab === "students_list" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bengali text-on-surface-variant">অ্যাপ্রুভড ছাত্রদের তালিকা এবং রোল নম্বর প্রদান।</p>
                <div className="flex items-center gap-4">
                  <select 
                    className="px-4 py-2 rounded-lg border border-outline-variant font-bengali outline-none focus:ring-2 focus:ring-primary"
                    value={studentFilterYear}
                    onChange={(e) => setStudentFilterYear(e.target.value)}
                  >
                    <option value="">সকল শিক্ষাবর্ষ</option>
                    {Array.from(new Set(admissions.filter(a => a.status === "approved" && a.year).map(a => a.year))).sort().reverse().map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <select 
                    className="px-4 py-2 rounded-lg border border-outline-variant font-bengali outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    value={studentFilterDept}
                    onChange={(e) => {
                      setStudentFilterDept(e.target.value);
                      setStudentFilterJamat("");
                    }}
                  >
                    <option value="">সকল বিভাগ</option>
                    <option value="হিফজ বিভাগ">হিফজ বিভাগ</option>
                    <option value="কিতাব বিভাগ">কিতাব বিভাগ</option>
                    <option value="মক্তব বিভাগ">মক্তব বিভাগ</option>
                  </select>
                  <select 
                    className="px-4 py-2 rounded-lg border border-outline-variant font-bengali outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    value={studentFilterJamat}
                    onChange={(e) => setStudentFilterJamat(e.target.value)}
                    disabled={!studentFilterDept}
                  >
                    <option value="">সকল জামাত</option>
                    {studentFilterDept === "হিফজ বিভাগ" && (
                      <>
                        <option value="মক্কী">মক্কী</option>
                        <option value="মাদানী">মাদানী</option>
                      </>
                    )}
                    {studentFilterDept === "কিতাব বিভাগ" && (
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
                    {studentFilterDept === "মক্তব বিভাগ" && (
                      <>
                        <option value="নার্সারী">নার্সারী</option>
                        <option value="প্রথম">প্রথম</option>
                        <option value="দ্বিতীয়">দ্বিতীয়</option>
                        <option value="তৃতীয়">তৃতীয়</option>
                      </>
                    )}
                  </select>
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">
                    মোট ছাত্র: {admissions.filter(a => a.status === "approved" && (!studentFilterYear || a.year === studentFilterYear) && (!studentFilterDept || a.department === studentFilterDept) && (!studentFilterJamat || a.classToAdmit === studentFilterJamat)).length}
                  </div>
                  <button 
                    onClick={() => setIsOfflineStudentModalOpen(true)}
                    className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all"
                  >
                    <Plus size={16} /> নতুন ছাত্র (অফলাইন)
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
                <table className="w-full text-left font-bengali">
                  <thead className="bg-surface-container text-on-surface-variant text-base uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">রোল নম্বর</th>
                      <th className="px-6 py-4">ছবি</th>
                      <th className="px-6 py-4">নাম</th>
                      <th className="px-6 py-4">পিতার নাম</th>
                      <th className="px-6 py-4">জামাত</th>
                      <th className="px-6 py-4">যোগাযোগ</th>
                      <th className="px-6 py-4">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {admissions.filter(a => a.status === "approved" && (!studentFilterYear || a.year === studentFilterYear) && (!studentFilterDept || a.department === studentFilterDept) && (!studentFilterJamat || a.classToAdmit === studentFilterJamat)).length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-on-surface-variant">কোন ছাত্র পাওয়া যায়নি।</td>
                      </tr>
                    ) : (
                      admissions.filter(a => a.status === "approved" && (!studentFilterYear || a.year === studentFilterYear) && (!studentFilterDept || a.department === studentFilterDept) && (!studentFilterJamat || a.classToAdmit === studentFilterJamat)).map((student) => (
                        <tr key={student.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="px-6 py-4">
                            <input 
                              className="w-24 px-3 py-2 border border-outline-variant rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                              value={student.roll || ""}
                              placeholder="রোল"
                              onChange={(e) => {
                                const newAdmissions = [...admissions];
                                const sIdx = newAdmissions.findIndex(a => a.id === student.id);
                                newAdmissions[sIdx].roll = e.target.value;
                                setAdmissions(newAdmissions);
                              }}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div 
                              className="w-10 h-10 rounded-full bg-surface-container overflow-hidden cursor-pointer border border-outline-variant hover:border-primary transition-colors flex items-center justify-center relative group"
                              onClick={() => {
                                setGalleryCallback(() => (url: string) => handleUpdatePhoto(student.id, url));
                                setIsGalleryModalOpen(true);
                              }}
                              title="ছবি পরিবর্তন করুন"
                            >
                              {student.photoUrl ? (
                                <img src={student.photoUrl} alt={student.studentNameBn} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon size={20} className="text-on-surface-variant" />
                              )}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Upload size={14} className="text-white" />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-primary">{student.studentNameBn}</td>
                          <td className="px-6 py-4">{student.fatherName}</td>
                          <td className="px-6 py-4 font-medium">{student.classToAdmit}</td>
                          <td className="px-6 py-4 text-sm">{student.contactNumber}</td>
                          <td className="px-6 py-4 flex gap-2">
                            <button 
                              onClick={() => handleUpdateRoll(student.id, student.roll || "")}
                              className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-primary hover:text-white transition-all"
                            >
                              সেভ
                            </button>
                            <button 
                              onClick={() => {
                                setEditingStudentData(student);
                                setIsEditStudentModalOpen(true);
                              }}
                              className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition-all"
                            >
                              এডিট
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "admissions_list" && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <p className="text-sm font-bengali text-on-surface-variant">ভর্তিচ্ছু শিক্ষার্থীদের আবেদনের তালিকা।</p>
                <div className="flex items-center gap-4">
                  <select 
                    className="px-4 py-2 rounded-lg border border-outline-variant font-bengali outline-none focus:ring-2 focus:ring-primary"
                    value={studentFilterYear}
                    onChange={(e) => setStudentFilterYear(e.target.value)}
                  >
                    <option value="">সকল শিক্ষাবর্ষ</option>
                    {Array.from(new Set(admissions.filter(a => a.year).map(a => a.year))).sort().reverse().map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <select 
                    className="px-4 py-2 rounded-lg border border-outline-variant font-bengali outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    value={studentFilterDept}
                    onChange={(e) => {
                      setStudentFilterDept(e.target.value);
                      setStudentFilterJamat("");
                    }}
                    disabled={!studentFilterYear}
                  >
                    <option value="">সকল বিভাগ</option>
                    <option value="হিফজ বিভাগ">হিফজ বিভাগ</option>
                    <option value="কিতাব বিভাগ">কিতাব বিভাগ</option>
                    <option value="মক্তব বিভাগ">মক্তব বিভাগ</option>
                  </select>
                  <select 
                    className="px-4 py-2 rounded-lg border border-outline-variant font-bengali outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    value={studentFilterJamat}
                    onChange={(e) => setStudentFilterJamat(e.target.value)}
                    disabled={!studentFilterDept}
                  >
                    <option value="">সকল জামাত</option>
                    {studentFilterDept === "হিফজ বিভাগ" && (
                      <>
                        <option value="মক্কী">মক্কী</option>
                        <option value="মাদানী">মাদানী</option>
                      </>
                    )}
                    {studentFilterDept === "কিতাব বিভাগ" && (
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
                    {studentFilterDept === "মক্তব বিভাগ" && (
                      <>
                        <option value="নার্সারী">নার্সারী</option>
                        <option value="প্রথম">প্রথম</option>
                        <option value="দ্বিতীয়">দ্বিতীয়</option>
                        <option value="তৃতীয়">তৃতীয়</option>
                      </>
                    )}
                  </select>
                  <div className="bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm">
                    মোট আবেদন: {admissions.filter(a => 
                      (!studentFilterYear || a.year === studentFilterYear) && 
                      (!studentFilterDept || a.department === studentFilterDept) &&
                      (!studentFilterJamat || a.classToAdmit === studentFilterJamat)
                    ).length}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-outline-variant/20">
                <table className="w-full text-left font-bengali">
                  <thead className="bg-surface-container text-on-surface-variant text-base uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4">নাম ও তথ্য</th>
                      <th className="px-6 py-4">বিভাগ ও রোল</th>
                      <th className="px-6 py-4">পিতা-মাতা</th>
                      <th className="px-6 py-4">যোগাযোগ</th>
                      <th className="px-6 py-4">স্ট্যাটাস</th>
                      <th className="px-6 py-4">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {admissions.filter(a => 
                      (!studentFilterYear || a.year === studentFilterYear) && 
                      (!studentFilterDept || a.department === studentFilterDept) &&
                      (!studentFilterJamat || a.classToAdmit === studentFilterJamat)
                    ).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-on-surface-variant">কোন আবেদন পাওয়া যায়নি।</td>
                      </tr>
                    ) : (
                      admissions.filter(a => 
                        (!studentFilterYear || a.year === studentFilterYear) && 
                        (!studentFilterDept || a.department === studentFilterDept) &&
                        (!studentFilterJamat || a.classToAdmit === studentFilterJamat)
                      ).map((app) => (
                        <tr key={app.id} className="hover:bg-surface-container-lowest transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-surface-container overflow-hidden border border-outline-variant flex-shrink-0">
                                {app.photoUrl ? (
                                  <img src={app.photoUrl} alt={app.studentNameBn} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <User size={20} className="text-on-surface-variant" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-bold text-primary">{app.studentNameBn}</div>
                                <div className="text-xs text-on-surface-variant uppercase">{app.studentNameEn}</div>
                                <div className="text-xs mt-1">জন্ম: {app.dob}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-medium">{app.classToAdmit}</div>
                            <div className="text-xs text-on-surface-variant">রক্তের গ্রুপ: {app.bloodGroup || "N/A"}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">পিতা: {app.fatherName}</div>
                            <div className="text-sm">মাতা: {app.motherName}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm">{app.contactNumber}</div>
                            <div className="text-xs text-on-surface-variant">অভিভাবক: {app.guardianName} ({app.guardianContact})</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              app.status === "approved" ? "bg-green-100 text-green-700" : 
                              app.status === "rejected" ? "bg-red-100 text-red-700" : 
                              "bg-yellow-100 text-yellow-700"
                            }`}>
                              {app.status === "approved" ? "অ্যাপ্রুভড" : app.status === "rejected" ? "বাতিল" : "পেন্ডিং"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {app.status === "pending" && (
                                <>
                                  <button 
                                    onClick={() => setApprovingAdmissionId(app.id)}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                    title="Approve"
                                  >
                                    <Check size={18} />
                                  </button>
                                  <button 
                                    onClick={() => handleUpdateAdmissionStatus(app.id, "rejected")}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Reject"
                                  >
                                    <X size={18} />
                                  </button>
                                </>
                              )}
                              <button 
                                onClick={() => handleDeleteAdmission(app.id)}
                                className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "teachers" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bengali font-bold text-primary">আমাদের শিক্ষকবৃন্দ</h2>
                <button
                  onClick={() => setData({ ...data, teachers: [...data.teachers, { 
                    id: Date.now(), 
                    name: "নতুন শিক্ষক", 
                    designation: "পদবি", 
                    image: "https://picsum.photos/seed/new/200/200", 
                    details: "শিক্ষকের বিস্তারিত তথ্য এখানে লিখুন...",
                    phone: "",
                    email: "",
                    qualification: "",
                    specialization: ""
                  }] })}
                  className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-secondary-container/80 transition-all"
                >
                  <Plus size={16} /> নতুন শিক্ষক যোগ করুন
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.teachers.map((teacher: any, idx: number) => (
                  <div key={teacher.id} className="p-6 rounded-xl border border-outline-variant/20 bg-surface-container-lowest flex flex-col items-center text-center gap-4 relative group/card">
                    <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity">
                      <button
                        disabled={idx === 0}
                        onClick={() => {
                          const newTeachers = [...data.teachers];
                          [newTeachers[idx - 1], newTeachers[idx]] = [newTeachers[idx], newTeachers[idx - 1]];
                          setData({ ...data, teachers: newTeachers });
                        }}
                        className="p-1 bg-surface-container-high rounded hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="উপরে নিন"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        disabled={idx === data.teachers.length - 1}
                        onClick={() => {
                          const newTeachers = [...data.teachers];
                          [newTeachers[idx + 1], newTeachers[idx]] = [newTeachers[idx], newTeachers[idx + 1]];
                          setData({ ...data, teachers: newTeachers });
                        }}
                        className="p-1 bg-surface-container-high rounded hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        title="নিচে নিন"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                    <div className="relative group">
                      <img src={teacher.image} alt={teacher.name} className="w-24 h-24 rounded-full object-cover border-4 border-primary/10" />
                      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all">
                        <label className="p-1 hover:bg-white/20 rounded-full transition-all cursor-pointer" title="ছবি আপলোড করুন">
                          <Upload className="text-white" size={16} />
                          <input
                            type="file"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const reader = new FileReader();
                              reader.onload = () => {
                                setEditingImage({ 
                                  url: reader.result as string, 
                                  aspect: 1,
                                  callback: (url) => {
                                    const newTeachers = [...data.teachers];
                                    newTeachers[idx].image = url;
                                    setData({ ...data, teachers: newTeachers });
                                    fetchGallery();
                                  }
                                });
                              };
                              reader.readAsDataURL(file);
                            }}
                          />
                        </label>
                        <button 
                          onClick={() => openGalleryPicker((url) => {
                            const newTeachers = [...data.teachers];
                            newTeachers[idx].image = url;
                            setData({ ...data, teachers: newTeachers });
                          })}
                          className="p-1 hover:bg-white/20 rounded-full transition-all"
                          title="গ্যালারি থেকে নিন"
                        >
                          <ImageIcon className="text-white" size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="w-full space-y-2">
                      <input
                        className="w-full text-lg font-bengali font-bold text-primary text-center outline-none border-b border-transparent focus:border-primary/20"
                        value={teacher.name}
                        placeholder="শিক্ষকের নাম"
                        onChange={(e) => {
                          const newTeachers = [...data.teachers];
                          newTeachers[idx].name = e.target.value;
                          setData({ ...data, teachers: newTeachers });
                        }}
                      />
                      <input
                        className="w-full text-on-surface-variant font-bengali text-sm text-center outline-none border-b border-transparent focus:border-primary/20"
                        value={teacher.designation}
                        placeholder="পদবি"
                        onChange={(e) => {
                          const newTeachers = [...data.teachers];
                          newTeachers[idx].designation = e.target.value;
                          setData({ ...data, teachers: newTeachers });
                        }}
                      />
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <input
                          className="w-full text-on-surface-variant font-bengali text-xs text-center outline-none border border-outline-variant/20 rounded p-1 focus:border-primary/20 bg-surface-container-low"
                          value={teacher.phone || ""}
                          placeholder="মোবাইল নং"
                          onChange={(e) => {
                            const newTeachers = [...data.teachers];
                            newTeachers[idx].phone = e.target.value;
                            setData({ ...data, teachers: newTeachers });
                          }}
                        />
                        <input
                          className="w-full text-on-surface-variant font-bengali text-xs text-center outline-none border border-outline-variant/20 rounded p-1 focus:border-primary/20 bg-surface-container-low"
                          value={teacher.email || ""}
                          placeholder="মেইল"
                          onChange={(e) => {
                            const newTeachers = [...data.teachers];
                            newTeachers[idx].email = e.target.value;
                            setData({ ...data, teachers: newTeachers });
                          }}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <input
                          className="w-full text-on-surface-variant font-bengali text-xs text-center outline-none border border-outline-variant/20 rounded p-1 focus:border-primary/20 bg-surface-container-low"
                          value={teacher.qualification || ""}
                          placeholder="শিক্ষাগত যোগ্যতা"
                          onChange={(e) => {
                            const newTeachers = [...data.teachers];
                            newTeachers[idx].qualification = e.target.value;
                            setData({ ...data, teachers: newTeachers });
                          }}
                        />
                        <input
                          className="w-full text-on-surface-variant font-bengali text-xs text-center outline-none border border-outline-variant/20 rounded p-1 focus:border-primary/20 bg-surface-container-low"
                          value={teacher.specialization || ""}
                          placeholder="বিশেষজ্ঞ"
                          onChange={(e) => {
                            const newTeachers = [...data.teachers];
                            newTeachers[idx].specialization = e.target.value;
                            setData({ ...data, teachers: newTeachers });
                          }}
                        />
                      </div>
                      <textarea
                        className="w-full text-on-surface-variant font-bengali text-xs text-center outline-none border border-outline-variant/20 rounded p-2 focus:border-primary/20 bg-surface-container-low"
                        value={teacher.details || ""}
                        placeholder="শিক্ষকের বিস্তারিত তথ্য (বায়োগ্রাফি, শিক্ষা ইত্যাদি)"
                        rows={3}
                        onChange={(e) => {
                          const newTeachers = [...data.teachers];
                          newTeachers[idx].details = e.target.value;
                          setData({ ...data, teachers: newTeachers });
                        }}
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (window.confirm("আপনি কি নিশ্চিতভাবে এই শিক্ষককে রিমুভ করতে চান?")) {
                          setData({ ...data, teachers: data.teachers.filter((t: any) => t.id !== teacher.id) });
                        }
                      }}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all mt-2"
                      title="রিমুভ করুন"
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

      {/* Approve Admission Modal */}
      {approvingAdmissionId && (
        <div className="fixed inset-0 z-[110] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-primary text-white">
              <h3 className="font-bengali font-bold text-xl flex items-center gap-2">
                <Check size={24} /> ভর্তি অ্যাপ্রুভ করুন
              </h3>
              <button onClick={() => { setApprovingAdmissionId(null); setApprovingRoll(""); }} className="text-white/80 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-2">রোল নম্বর প্রদান করুন</label>
                <input
                  type="text"
                  value={approvingRoll}
                  onChange={(e) => setApprovingRoll(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  placeholder="যেমন: 101"
                  autoFocus
                />
              </div>
            </div>
            <div className="p-6 border-t bg-surface-container-lowest flex justify-end gap-3">
              <button
                onClick={() => { setApprovingAdmissionId(null); setApprovingRoll(""); }}
                className="px-6 py-2 rounded-lg font-bengali font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                বাতিল করুন
              </button>
              <button
                onClick={() => {
                  handleUpdateAdmissionStatus(approvingAdmissionId, "approved", approvingRoll);
                  setApprovingAdmissionId(null);
                  setApprovingRoll("");
                }}
                className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bengali font-bold hover:shadow-lg transition-all"
              >
                নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offline Student Modal */}
      {isOfflineStudentModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-primary text-white">
              <h3 className="font-bengali font-bold text-xl flex items-center gap-2">
                <UserPlus size={24} /> নতুন ছাত্র যোগ করুন (অফলাইন)
              </h3>
              <button 
                onClick={() => setIsOfflineStudentModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">শিক্ষাবর্ষ *</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={offlineStudentData.year}
                  onChange={(e) => setOfflineStudentData({...offlineStudentData, year: e.target.value})}
                >
                  <option value="2024">২০২৪</option>
                  <option value="2025">২০২৫</option>
                  <option value="2026">২০২৬</option>
                  <option value="2027">২০২৭</option>
                  <option value="2028">২০২৮</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">ছাত্রের নাম (বাংলায়) *</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={offlineStudentData.studentNameBn}
                  onChange={(e) => setOfflineStudentData({...offlineStudentData, studentNameBn: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">পিতার নাম</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={offlineStudentData.fatherName}
                  onChange={(e) => setOfflineStudentData({...offlineStudentData, fatherName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">বিভাগ *</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={offlineStudentData.department}
                  onChange={(e) => setOfflineStudentData({...offlineStudentData, department: e.target.value, classToAdmit: ""})}
                >
                  <option value="">বিভাগ নির্বাচন করুন</option>
                  <option value="হিফজ বিভাগ">হিফজ বিভাগ</option>
                  <option value="কিতাব বিভাগ">কিতাব বিভাগ</option>
                  <option value="মক্তব বিভাগ">মক্তব বিভাগ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">ভর্তির জামাত *</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={offlineStudentData.classToAdmit}
                  onChange={(e) => setOfflineStudentData({...offlineStudentData, classToAdmit: e.target.value})}
                  disabled={!offlineStudentData.department}
                >
                  <option value="">নির্বাচন করুন</option>
                  {offlineStudentData.department === "হিফজ বিভাগ" && (
                    <>
                      <option value="মক্কী">মক্কী</option>
                      <option value="মাদানী">মাদানী</option>
                    </>
                  )}
                  {offlineStudentData.department === "কিতাব বিভাগ" && (
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
                  {offlineStudentData.department === "মক্তব বিভাগ" && (
                    <>
                      <option value="নার্সারী">নার্সারী</option>
                      <option value="প্রথম">প্রথম</option>
                      <option value="দ্বিতীয়">দ্বিতীয়</option>
                      <option value="তৃতীয়">তৃতীয়</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">রোল নম্বর</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={offlineStudentData.roll}
                  onChange={(e) => setOfflineStudentData({...offlineStudentData, roll: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">যোগাযোগের নম্বর</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={offlineStudentData.contactNumber}
                  onChange={(e) => setOfflineStudentData({...offlineStudentData, contactNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">ছবি</label>
                <div className="flex items-center gap-4">
                  {offlineStudentData.photoUrl ? (
                    <img src={offlineStudentData.photoUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-surface-container border flex items-center justify-center">
                      <ImageIcon size={24} className="text-on-surface-variant" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("ছবির সাইজ ২ মেগাবাইটের বেশি হতে পারবে না।");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setOfflineStudentData({...offlineStudentData, photoUrl: reader.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#005d421a] file:text-primary hover:file:bg-[#005d4233] font-bengali"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setGalleryCallback(() => (url: string) => setOfflineStudentData({...offlineStudentData, photoUrl: url}));
                        setIsGalleryModalOpen(true);
                      }}
                      className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-sm font-bold font-bengali hover:bg-surface-container-high transition-colors w-fit"
                    >
                      গ্যালারি থেকে ছবি নির্বাচন করুন
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-surface-container-lowest flex justify-end gap-3">
              <button 
                onClick={() => setIsOfflineStudentModalOpen(false)}
                className="px-6 py-2 rounded-lg font-bold font-bengali text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                বাতিল
              </button>
              <button 
                onClick={handleAddOfflineStudent}
                className="px-6 py-2 rounded-lg font-bold font-bengali bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Save size={18} /> সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {isEditStudentModalOpen && editingStudentData && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-primary text-white">
              <h3 className="font-bengali font-bold text-xl flex items-center gap-2">
                <UserPlus size={24} /> ছাত্রের তথ্য এডিট করুন
              </h3>
              <button 
                onClick={() => setIsEditStudentModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">শিক্ষাবর্ষ *</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={editingStudentData.year}
                  onChange={(e) => setEditingStudentData({...editingStudentData, year: e.target.value})}
                >
                  <option value="">নির্বাচন করুন</option>
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">ছাত্রের নাম (বাংলায়) *</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={editingStudentData.studentNameBn}
                  onChange={(e) => setEditingStudentData({...editingStudentData, studentNameBn: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">পিতার নাম (বাংলায়)</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={editingStudentData.fatherName}
                  onChange={(e) => setEditingStudentData({...editingStudentData, fatherName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">বিভাগ *</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={editingStudentData.department}
                  onChange={(e) => setEditingStudentData({...editingStudentData, department: e.target.value, classToAdmit: ""})}
                >
                  <option value="">বিভাগ নির্বাচন করুন</option>
                  <option value="হিফজ বিভাগ">হিফজ বিভাগ</option>
                  <option value="কিতাব বিভাগ">কিতাব বিভাগ</option>
                  <option value="মক্তব বিভাগ">মক্তব বিভাগ</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">ভর্তিকৃত জামাত *</label>
                <select 
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={editingStudentData.classToAdmit}
                  onChange={(e) => setEditingStudentData({...editingStudentData, classToAdmit: e.target.value})}
                  disabled={!editingStudentData.department}
                >
                  <option value="">নির্বাচন করুন</option>
                  {editingStudentData.department === "হিফজ বিভাগ" && (
                    <>
                      <option value="মক্কী">মক্কী</option>
                      <option value="মাদানী">মাদানী</option>
                    </>
                  )}
                  {editingStudentData.department === "কিতাব বিভাগ" && (
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
                  {editingStudentData.department === "মক্তব বিভাগ" && (
                    <>
                      <option value="নার্সারী">নার্সারী</option>
                      <option value="প্রথম">প্রথম</option>
                      <option value="দ্বিতীয়">দ্বিতীয়</option>
                      <option value="তৃতীয়">তৃতীয়</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">রোল নম্বর</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={editingStudentData.roll}
                  onChange={(e) => setEditingStudentData({...editingStudentData, roll: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">যোগাযোগের নম্বর</label>
                <input 
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary font-bengali"
                  value={editingStudentData.contactNumber}
                  onChange={(e) => setEditingStudentData({...editingStudentData, contactNumber: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bengali font-bold text-on-surface mb-1">ছবি</label>
                <div className="flex items-center gap-4">
                  {editingStudentData.photoUrl ? (
                    <img src={editingStudentData.photoUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-surface-container border flex items-center justify-center">
                      <ImageIcon size={24} className="text-on-surface-variant" />
                    </div>
                  )}
                  <div className="flex flex-col gap-2">
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert("ছবির সাইজ ২ মেগাবাইটের বেশি হতে পারবে না।");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditingStudentData({...editingStudentData, photoUrl: reader.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#005d421a] file:text-primary hover:file:bg-[#005d4233] font-bengali"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setGalleryCallback(() => (url: string) => setEditingStudentData({...editingStudentData, photoUrl: url}));
                        setIsGalleryModalOpen(true);
                      }}
                      className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-sm font-bold font-bengali hover:bg-surface-container-high transition-colors w-fit"
                    >
                      গ্যালারি থেকে ছবি নির্বাচন করুন
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-surface-container-lowest flex justify-end gap-3">
              <button 
                onClick={() => setIsEditStudentModalOpen(false)}
                className="px-6 py-2 rounded-lg font-bold font-bengali text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                বাতিল
              </button>
              <button 
                onClick={handleUpdateStudent}
                className="px-6 py-2 rounded-lg font-bold font-bengali bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Save size={18} /> আপডেট করুন
              </button>
            </div>
          </div>
        </div>
      )}

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
                    onClick={() => {
                      galleryCallback(url);
                      setIsGalleryModalOpen(false);
                    }}
                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-primary transition-all group shadow-sm hover:shadow-md"
                  >
                    <img src={url} alt="Gallery item" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <Check className="text-white" size={32} />
                    </div>
                  </button>
                ))}
                {gallery.length === 0 && (
                  <div className="col-span-full py-20 text-center text-on-surface-variant font-bengali">
                    কোন ছবি পাওয়া যায়নি। প্রথমে আপলোড করুন।
                  </div>
                )}
              </div>
            </div>
            <div className="p-4 border-t bg-white flex justify-end">
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="px-6 py-2 rounded-lg border border-outline-variant font-bengali font-bold hover:bg-gray-50 transition-all"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Editor Modal */}
      {editingImage && (
        <ImageEditor
          image={editingImage.url}
          aspect={editingImage.aspect}
          onCropComplete={handleCropComplete}
          onClose={() => setEditingImage(null)}
        />
      )}
    </div>
  );
}
