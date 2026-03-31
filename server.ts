import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import multer from "multer";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Supabase Client
const supabaseUrl = process.env.SUPABASE_URL || "https://qxwulyakfmogddwtwgob.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d3VseWFrZm1vZ2Rkd3R3Z29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTY4ODcsImV4cCI6MjA5MDI5Mjg4N30.CFbj9E_h5qi1rqV_43vLCsnREP4YWSD1Ou-IfXc8R60";
const supabase = createClient(supabaseUrl, supabaseKey);

// Simple data storage
const DATA_FILE = path.join(process.cwd(), "data.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial data
const initialData = {
  "settings": {
    "siteTitle": "জামি‘আ ইসলামিয়া শামসুল উলূম কড়ৈয়াবাড়ী",
    "address": "কড়ৈয়াবারী, বারপাড়া, বন্দর, নারায়াণগঞ্জ।",
    "logo": "https://lh3.googleusercontent.com/aida-public/AB6AXuCMu0I0-nAJDaXwovvUL2h5E0lfJb2QiBph-NR8_oAyRv1Q3-fJBW3M1dnre4ZITR4zaTtV4uH14LW4Aqk26VWtc3leQbr6yRmlC4bZSBoV73fFaesFfXvjrQApCQWVTSW7pLrZy3Uw4MC27721dCQ9dcwyIxngTJrcVUISP_unAq58uXY1KWjGj-7sOnZA_CMs6rJPvuqIojqLt15Che6qnY2rl6rj2v-u9LtK8Ne_L4mQZSUZ3pf9MRJWgeYnSMid82DodR7LaKA7",
    "heroImage": "https://lh3.googleusercontent.com/aida-public/AB6AXuBJcxE_WaNYk8wxz2Me4i9AQSv8iDrQualK7rRMUDTazl5k_4TdRwpFgNEVGvtc-wlzxpLmwlgITaQGqaNAhpZjavwNuWIM_-HYT-dBEVean4UsaYe6JgEivd4m7S9FlvixPIoFZhMdyeyhLl6yVBJKI4dv0WsDJNl-rdEbH5JN0Z-WETzTJRJgW03FfmwLaTOa4H-zq7fROrsW0PH1HqEWEIk6-aF98dsPt4bj1cB9FRrm4j-PSEanPh-bsOSUV4LTfoAukUxHTyRf",
    "gallery": [
      "https://picsum.photos/seed/madrasa1/800/600",
      "https://picsum.photos/seed/madrasa2/800/600",
      "https://picsum.photos/seed/madrasa3/800/600"
    ]
  },
  "notices": [
    {
      "id": 1,
      "date": "২৫",
      "desc": "আগামী 25শে ডিসেম্বর থেকে জামিয়ার সকল বিভাগের বার্ষিক পরীক্ষা শুরু হবে...",
      "month": "Dec",
      "title": "বার্ষিক পরীক্ষার রুটিন প্রকাশ ২০২৪"
    },
    {
      "id": 2,
      "date": "০৮",
      "desc": "২026শিক্ষাবর্ষের সকল বিভাগে ভর্তিচ্ছু শিক্ষার্থীদের অনলাইন ও অফলাইনে আবেদন শুরু হয়েছে...",
      "month": "Dec",
      "title": "নতুন শিক্ষাবর্ষের ভর্তি কার্যক্রম শুরু"
    },
    {
      "id": 3,
      "date": "২৮",
      "desc": "আগামী ৫ই জানুয়ারি জামিয়ার বিশাল প্রাঙ্গণে বার্ষিক দোয়ার মাহফিল অনুষ্ঠিত হবে ইনশাআল্লাহ...",
      "month": "Nov",
      "title": "বার্ষিক মাহফিলের তারিখ ঘোষণা"
    }
  ],
  "teachers": [
    {
      "id": 1,
      "name": "মুফতী মুহাম্মদ ফয়জুল্লাহ দা. বা.",
      "image": "https://picsum.photos/seed/teacher1/200/200",
      "designation": "মুহতামিম"
    },
    {
      "id": 2,
      "name": "মুফতী মুজ্জাম্মিল হক দা. বা.",
      "email": "mdmozammelhoque171@gmail.com",
      "image": "https://picsum.photos/seed/teacher2/200/200",
      "phone": "01792756020",
      "designation": "নাজেমে তালিমাত",
      "qualification": "মুফতী",
      "specialization": "ফিকহ ও ফাতাওয়া"
    },
    {
      "id": 1774720089262,
      "name": "মুফতী লুৎফুর রহমান দা. বা.",
      "image": "https://picsum.photos/seed/teacher3/200/200",
      "details": "ুিতিকািতকাতকিুতকতুাকৃতকাতৃ",
      "designation": "শাইখুল হাদীস"
    }
  ],
  "results": [
    {
      "id": 1774846765631,
      "exam": "বার্ষিক পরীক্ষা 2024",
      "name": "নতুন ছাত্র",
      "roll": "88",
      "year": "2024",
      "class": "হেফজ",
      "marks": {
        "fiqh": 77,
        "quran": 44,
        "bangla": 55,
        "hadith": 55
      },
      "total": 231,
      "position": 5,
      "published": false
    },
    {
      "id": 1774790679408,
      "exam": "বার্ষিক পরীক্ষা ২০২৪",
      "name": "আদিল মাহমুদ",
      "roll": "552",
      "year": "২০২৪",
      "class": "তাইসির",
      "marks": {
        "fiqh": 82,
        "quran": 92,
        "bangla": 96,
        "hadith": 95
      },
      "total": 365,
      "position": 1,
      "published": true
    },
    {
      "id": 1774765419131,
      "exam": "বার্ষিক পরীক্ষা ২০২৪",
      "name": "আবু রায়হান",
      "roll": "205",
      "year": "২০২৪",
      "class": "মিজান",
      "marks": {
        "fiqh": 95,
        "quran": 50,
        "bangla": 80,
        "hadith": 90
      },
      "total": 315,
      "position": 4,
      "published": true
    },
    {
      "id": 1774719858030,
      "exam": "বার্ষিক পরীক্ষা ২০২৪",
      "name": "আলি",
      "roll": "55",
      "year": "২০২৪",
      "class": "নাহবেমীর",
      "marks": {
        "fiqh": 20,
        "quran": 55,
        "bangla": 44,
        "hadith": 20
      },
      "total": 139,
      "position": 6,
      "published": true
    },
    {
      "id": 1,
      "exam": "বার্ষিক পরীক্ষা ২০২৪",
      "name": "আব্দুল্লাহ",
      "roll": "101",
      "year": "২০২৪",
      "class": "হেদায়াতুন নাহু",
      "marks": {
        "fiqh": 92,
        "quran": 95,
        "bangla": 85,
        "hadith": 88
      },
      "total": 360,
      "position": 2,
      "published": true
    },
    {
      "id": 2,
      "exam": "বার্ষিক পরীক্ষা ২০২৪",
      "name": "ওমর ফারুক",
      "roll": "102",
      "year": "২০২৪",
      "class": "কাফিয়া",
      "marks": {
        "fiqh": 88,
        "quran": 90,
        "bangla": 82,
        "hadith": 85
      },
      "total": 345,
      "position": 3,
      "published": true
    },
    {
      "id": 1774847834596.7444,
      "exam": "বার্ষিক পরীক্ষা",
      "name": "আব্দুল্লাহ",
      "roll": "",
      "year": "2026",
      "class": "মেশকাত",
      "marks": {
        "ফিকহ": 87,
        "কুরআন": 55,
        "বাংলা": 88,
        "হাদীস": 85,
        "তাফসির": 50
      },
      "total": 365,
      "position": 1,
      "published": true,
      "fatherName": "Abdul motin",
      "admissionId": 1774841146910
    }
  ],
  "admissions": [
    {
      "id": 1774841146910,
      "dob": "2025-02-05",
      "roll": "55",
      "gender": "male",
      "status": "approved",
      "bloodGroup": "O+",
      "fatherName": "Abdul motin",
      "motherName": "Amatullah",
      "submittedAt": "2026-03-30T03:25:46.910Z",
      "classToAdmit": "মেশকাত",
      "guardianName": "kldlkfa",
      "contactNumber": "01719337228",
      "studentNameBn": "আব্দুল্লাহ",
      "studentNameEn": "abdullah",
      "presentAddress": "ffff",
      "guardianContact": "01719337228",
      "permanentAddress": "ffff",
      "previousInstitute": "dklkfl"
    }
  ],
  "admissionInfo": "2026 শিক্ষাবর্ষের ভর্তি কার্যক্রম শুরু হয়েছে। বিস্তারিত তথ্যের জন্য মাদরাসা অফিসে যোগাযোগ করুন।",
  "admin": {
    "email": "admin@gmail.com",
    "password": "admin123"
  }
};

let dbData = initialData;

async function syncWithSupabase() {
  // Try to load local data first as fallback
  if (fs.existsSync(DATA_FILE)) {
    try {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      if (content.trim()) {
        dbData = JSON.parse(content);
        console.log("Loaded data from local data.json.");
      }
    } catch (e) {
      console.error("Error parsing data.json:", e);
    }
  }

  try {
    console.log("Starting Supabase sync...");
    // Try to fetch data from Supabase
    const { data, error } = await supabase
      .from("app_data")
      .select("content")
      .eq("id", 1)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // Row not found, migrate
        console.log("Supabase row not found, migrating data...");
        const { error: insertError } = await supabase
          .from("app_data")
          .insert([{ id: 1, content: dbData }]);
        
        if (insertError) {
          console.error("Error migrating to Supabase:", insertError);
        } else {
          console.log("Successfully migrated data to Supabase.");
        }
      } else if (error.code === "42P01") {
        console.error("Supabase table 'app_data' does not exist.");
      } else {
        console.error("Supabase error:", error);
      }
    } else if (data && data.content) {
      dbData = { 
        ...initialData, 
        ...data.content,
        settings: { ...initialData.settings, ...data.content.settings }
      };
      console.log("Data synced from Supabase.");
    }
  } catch (err) {
    console.error("Sync error:", err);
  }
}

async function updateSupabase() {
  try {
    // Write to local file as fallback
    fs.writeFileSync(DATA_FILE, JSON.stringify(dbData, null, 2));
    
    const { error } = await supabase
      .from("app_data")
      .update({ content: dbData })
      .eq("id", 1);
    
    if (error) {
      console.error("Error updating Supabase:", error);
    }
  } catch (err) {
    console.error("Update error:", err);
  }
}

// Initial sync
syncWithSupabase().then(() => {
  ensureSuperAdmin();
});

async function ensureSuperAdmin() {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", "mdrakibulislam827@gmail.com")
      .single();

    if (!data) {
      console.log("Creating super admin...");
      await supabase.from("users").insert([{
        email: "mdrakibulislam827@gmail.com",
        full_name: "Super Admin",
        password: "admin",
        role: "super_admin",
        status: "approved"
      }]);
    } else {
      // Always ensure super admin has correct role, status and password if they are having trouble
      console.log("Ensuring super admin credentials...");
      await supabase.from("users").update({ 
        role: "super_admin", 
        status: "approved",
        password: "admin" 
      }).eq("email", "mdrakibulislam827@gmail.com");
    }
  } catch (err) {
    console.error("Error ensuring super admin:", err);
  }
}

// Multer config for file uploads (using memory storage for Supabase)
const upload = multer({ storage: multer.memoryStorage() });

// Helper to ensure bucket exists
async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === "gallery")) {
    await supabase.storage.createBucket("gallery", { public: true });
  }
}
ensureBucket();

// API Routes
app.get("/api/data", (req, res) => {
  res.json(dbData);
});

app.post("/api/settings", async (req, res) => {
  dbData.settings = { ...dbData.settings, ...req.body };
  await updateSupabase();
  res.json({ success: true });
});

app.get("/api/gallery", async (req, res) => {
  try {
    const { data, error } = await supabase.storage.from("gallery").list("", {
      limit: 100,
      offset: 0,
      sortBy: { column: "created_at", order: "desc" },
    });
    
    if (error) throw error;
    
    const urls = data.map(file => 
      supabase.storage.from("gallery").getPublicUrl(file.name).data.publicUrl
    );
    res.json(urls);
  } catch (err) {
    console.error("Gallery fetch error:", err);
    res.status(500).json({ error: "গ্যালারি লোড করা সম্ভব হয়নি।" });
  }
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  
  try {
    const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;
    const { data, error } = await supabase.storage
      .from("gallery")
      .upload(fileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from("gallery").getPublicUrl(fileName);
    res.json({ url: publicUrl });
  } catch (err: any) {
    console.error("Supabase upload error:", err);
    res.status(500).json({ error: err.message || "আপলোড করা সম্ভব হয়নি।" });
  }
});

app.post("/api/notices", async (req, res) => {
  dbData.notices = req.body;
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/teachers", async (req, res) => {
  dbData.teachers = req.body;
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/results", async (req, res) => {
  dbData.results = req.body;
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/admission", async (req, res) => {
  dbData.admissionInfo = req.body.info;
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/admissions/submit", async (req, res) => {
  const newApplication = {
    id: Date.now(),
    ...req.body,
    status: "pending",
    submittedAt: new Date().toISOString()
  };
  
  if (!dbData.admissions) dbData.admissions = [];
  dbData.admissions.push(newApplication);
  await updateSupabase();
  res.json({ success: true, application: newApplication });
});

app.post("/api/admissions/update-status", async (req, res) => {
  const { id, status, roll } = req.body;
  dbData.admissions = dbData.admissions.map((app: any) => {
    if (app.id === id) {
      return { ...app, status, ...(roll !== undefined && { roll }) };
    }
    return app;
  });
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/admissions/add-offline", async (req, res) => {
  const newApplication = {
    id: Date.now(),
    ...req.body,
    status: "approved",
    submittedAt: new Date().toISOString()
  };
  if (!dbData.admissions) dbData.admissions = [];
  dbData.admissions.push(newApplication);
  await updateSupabase();
  res.json({ success: true, application: newApplication });
});

app.post("/api/admissions/update-photo", async (req, res) => {
  const { id, photoUrl } = req.body;
  dbData.admissions = dbData.admissions.map((app: any) => 
    app.id === id ? { ...app, photoUrl } : app
  );
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/admissions/update-roll", async (req, res) => {
  const { id, roll } = req.body;
  dbData.admissions = dbData.admissions.map((app: any) => 
    app.id === id ? { ...app, roll } : app
  );
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/admissions/update-student", async (req, res) => {
  const { id, studentData } = req.body;
  dbData.admissions = dbData.admissions.map((app: any) => 
    app.id === id ? { ...app, ...studentData } : app
  );
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/admissions/delete", async (req, res) => {
  const { id } = req.body;
  dbData.admissions = dbData.admissions.filter((app: any) => app.id !== id);
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .eq("status", "approved")
      .single();

    if (user) {
      res.json({ success: true, user: { email: user.email, role: user.role, name: user.full_name } });
    } else {
      res.status(401).json({ success: false, error: "ভুল ইমেইল/পাসওয়ার্ড অথবা আপনার অ্যাকাউন্টটি এখনও অ্যাপ্রুভ করা হয়নি।" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: "সার্ভারে সমস্যা হচ্ছে।" });
  }
});

app.post("/api/register-admin", async (req, res) => {
  const { email, full_name, documents_url } = req.body;
  try {
    const { error } = await supabase
      .from("users")
      .insert([{ email, full_name, documents_url, status: "pending", role: "admin" }]);
    
    if (error) throw error;
    res.json({ success: true, message: "আবেদন সফল হয়েছে। সুপার অ্যাডমিনের অনুমোদনের জন্য অপেক্ষা করুন।" });
  } catch (err) {
    res.status(500).json({ success: false, error: "রেজিস্ট্রেশন ব্যর্থ হয়েছে।" });
  }
});

app.get("/api/admin/users", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "ইউজার লিস্ট পাওয়া যায়নি।" });
  }
});

app.post("/api/admin/approve-user", async (req, res) => {
  const { userId, password } = req.body;
  try {
    const { error } = await supabase
      .from("users")
      .update({ status: "approved", password })
      .eq("id", userId);
    
    if (error) throw error;
    res.json({ success: true, message: "ইউজার অ্যাপ্রুভ করা হয়েছে।" });
  } catch (err) {
    res.status(500).json({ error: "অ্যাপ্রুভ করা সম্ভব হয়নি।" });
  }
});

app.post("/api/admin/remove-user", async (req, res) => {
  const { userId } = req.body;
  try {
    const { error } = await supabase.from("users").delete().eq("id", userId);
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "ইউজার রিমুভ করা সম্ভব হয়নি।" });
  }
});

app.post("/api/admin/reset-password", async (req, res) => {
  const { userId, newPassword } = req.body;
  try {
    const { error } = await supabase
      .from("users")
      .update({ password: newPassword })
      .eq("id", userId);
    
    if (error) throw error;
    res.json({ success: true, message: "পাসওয়ার্ড রিসেট করা হয়েছে।" });
  } catch (err) {
    res.status(500).json({ error: "পাসওয়ার্ড রিসেট করা সম্ভব হয়নি।" });
  }
});

app.post("/api/change-password", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  if (!newPassword || !email || !oldPassword) return res.status(400).json({ error: "Email, old password and new password required" });
  
  try {
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ error: "ইউজার পাওয়া যায়নি।" });
    }

    if (user.password !== oldPassword) {
      return res.status(401).json({ error: "বর্তমান পাসওয়ার্ড ভুল!" });
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({ password: newPassword })
      .eq("email", email);
    
    if (updateError) throw updateError;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "পাসওয়ার্ড পরিবর্তন করা সম্ভব হয়নি।" });
  }
});

app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "ইমেইল প্রয়োজন।" });
  
  try {
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (fetchError || !user) {
      return res.status(404).json({ error: "এই ইমেইলটি নিবন্ধিত নয়।" });
    }

    res.json({ message: "আপনার পাসওয়ার্ড রিসেট করার জন্য মাদরাসা কর্তৃপক্ষের সাথে যোগাযোগ করুন অথবা সুপার অ্যাডমিনকে জানান।" });
  } catch (err) {
    res.status(500).json({ error: "অনুরোধটি প্রসেস করা সম্ভব হয়নি।" });
  }
});

// Serve uploaded files
app.use("/uploads", express.static(UPLOADS_DIR));

async function startServer() {
  // Ensure data is synced before starting
  await syncWithSupabase();

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
