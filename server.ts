import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import multer from "multer";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

// Simple data storage
const DATA_FILE = path.join(process.cwd(), "data.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial data
const initialData = {
  settings: {
    siteTitle: "জামি‘আ ইসলামিয়া শামসুল উলূম কড়ৈয়াবাড়ী",
    address: "কড়ৈয়াবারী, বারপাড়া, বন্দর, নারায়াণগঞ্জ।",
    logo: "https://lh3.googleusercontent.com/aida-public/AB6AXuCMu0I0-nAJDaXwovvUL2h5E0lfJb2QiBph-NR8_oAyRv1Q3-fJBW3M1dnre4ZITR4zaTtV4uH14LW4Aqk26VWtc3leQbr6yRmlC4bZSBoV73fFaesFfXvjrQApCQWVTSW7pLrZy3Uw4MC27721dCQ9dcwyIxngTJrcVUISP_unAq58uXY1KWjGj-7sOnZA_CMs6rJPvuqIojqLt15Che6qnY2rl6rj2v-u9LtK8Ne_L4mQZSUZ3pf9MRJWgeYnSMid82DodR7LaKA7",
    heroImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJcxE_WaNYk8wxz2Me4i9AQSv8iDrQualK7rRMUDTazl5k_4TdRwpFgNEVGvtc-wlzxpLmwlgITaQGqaNAhpZjavwNuWIM_-HYT-dBEVean4UsaYe6JgEivd4m7S9FlvixPIoFZhMdyeyhLl6yVBJKI4dv0WsDJNl-rdEbH5JN0Z-WETzTJRJgW03FfmwLaTOa4H-zq7fROrsW0PH1HqEWEIk6-aF98dsPt4bj1cB9FRrm4j-PSEanPh-bsOSUV4LTfoAukUxHTyRf",
    gallery: [
      "https://picsum.photos/seed/madrasa1/800/600",
      "https://picsum.photos/seed/madrasa2/800/600",
      "https://picsum.photos/seed/madrasa3/800/600",
    ],
  },
  notices: [
    { id: 1, date: "১৫", month: "Dec", title: "বার্ষিক পরীক্ষার রুটিন প্রকাশ ২০২৪", desc: "আগামী ২০শে ডিসেম্বর থেকে জামিয়ার সকল বিভাগের বার্ষিক পরীক্ষা শুরু হবে..." },
    { id: 2, date: "০৮", month: "Dec", title: "নতুন শিক্ষাবর্ষের ভর্তি কার্যক্রম শুরু", desc: "২০২৫ শিক্ষাবর্ষের সকল বিভাগে ভর্তিচ্ছু শিক্ষার্থীদের অনলাইন ও অফলাইনে আবেদন শুরু হয়েছে..." },
    { id: 3, date: "২৮", month: "Nov", title: "বার্ষিক মাহফিলের তারিখ ঘোষণা", desc: "আগামী ৫ই জানুয়ারি জামিয়ার বিশাল প্রাঙ্গণে বার্ষিক দোয়ার মাহফিল অনুষ্ঠিত হবে ইনশাআল্লাহ..." },
  ],
  teachers: [
    { id: 1, name: "মাওলানা আব্দুল হাই", designation: "মুহতামিম", image: "https://picsum.photos/seed/teacher1/200/200" },
    { id: 2, name: "মাওলানা ইব্রাহিম খলিল", designation: "শায়খুল হাদীস", image: "https://picsum.photos/seed/teacher2/200/200" },
  ],
  results: [
    { id: 1, roll: "101", name: "আব্দুল্লাহ", exam: "বার্ষিক পরীক্ষা ২০২৪", year: "২০২৪", marks: { quran: 95, hadith: 88, fiqh: 92, bangla: 85 }, total: 360, position: 1, published: true },
    { id: 2, roll: "102", name: "ওমর ফারুক", exam: "বার্ষিক পরীক্ষা ২০২৪", year: "২০২৪", marks: { quran: 90, hadith: 85, fiqh: 88, bangla: 82 }, total: 345, position: 2, published: true },
  ],
  admissionInfo: "২০২৫ শিক্ষাবর্ষের ভর্তি কার্যক্রম শুরু হয়েছে। বিস্তারিত তথ্যের জন্য মাদরাসা অফিসে যোগাযোগ করুন।",
  admin: {
    email: "admin@gmail.com",
    password: "admin123",
  },
};

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      if (content.trim()) {
        return JSON.parse(content);
      }
    }
  } catch (err) {
    console.error("Error loading data.json:", err);
  }
  return initialData;
}

function saveData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

let dbData = loadData();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// API Routes
app.get("/api/data", (req, res) => {
  res.json(dbData);
});

app.post("/api/settings", (req, res) => {
  dbData.settings = { ...dbData.settings, ...req.body };
  saveData(dbData);
  res.json({ success: true });
});

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

app.post("/api/notices", (req, res) => {
  dbData.notices = req.body;
  saveData(dbData);
  res.json({ success: true });
});

app.post("/api/teachers", (req, res) => {
  dbData.teachers = req.body;
  saveData(dbData);
  res.json({ success: true });
});

app.post("/api/results", (req, res) => {
  dbData.results = req.body;
  saveData(dbData);
  res.json({ success: true });
});

app.post("/api/admission", (req, res) => {
  dbData.admissionInfo = req.body.info;
  saveData(dbData);
  res.json({ success: true });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (email === dbData.admin.email && password === dbData.admin.password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Invalid credentials" });
  }
});

app.post("/api/change-password", (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ error: "Password required" });
  dbData.admin.password = newPassword;
  saveData(dbData);
  res.json({ success: true });
});

// Serve uploaded files
app.use("/uploads", express.static(UPLOADS_DIR));

async function startServer() {
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
