import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import multer from "multer";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Supabase Client - Hardcoded for reliability and using node-fetch explicitly
const supabaseUrl = "https://bcxehzhddxqhpvqgwdkf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjeGVoemhkZHhxaHB2cWd3ZGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzIxNjIsImV4cCI6MjA5MDY0ODE2Mn0.wQNJjXw8S3UVC63XbZM37OgTC1IoIeaZXqo_mnZB_ds";

console.log(`Initializing Supabase with URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseKey, {
  global: {
    fetch: (url, options) => {
      console.log(`Supabase Fetching: ${url}`);
      return fetch(url as any, options as any).catch(err => {
        console.error(`Supabase Fetch Error for ${url}:`, err);
        throw err;
      });
    }
  }
});

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
    "phone": "01792-756020, 01719-337228",
    "email": "info@jamiaislamia.edu",
    "mapUrl": "https://maps.app.goo.gl/wqczYDpT5kcdqTDE6",
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
  "about": {
    "heroTitle": "আমাদের সম্পর্কে",
    "heroSubtitle": "দ্বীনি শিক্ষার এক নির্ভরযোগ্য প্রতিষ্ঠান, যেখানে কুরআন ও সুন্নাহর আলোকে আদর্শ মানুষ গড়া হয়।",
    "historyTitle": "প্রতিষ্ঠানের ইতিহাস",
    "historyContent": "জামি‘আ ইসলামিয়া শামসুল উলূম কড়ৈয়াবাড়ী একটি ঐতিহ্যবাহী দ্বীনি শিক্ষা প্রতিষ্ঠান। এটি বন্দর, নারায়ণগঞ্জের এক নিভৃত ও শান্ত পরিবেশে অবস্থিত। বহু বছর আগে একদল নিবেদিতপ্রাণ আলেম ও স্থানীয় ধর্মপ্রাণ মানুষের ঐকান্তিক প্রচেষ্টায় এই মাদরাসাটি প্রতিষ্ঠিত হয়।\n\nপ্রতিষ্ঠালগ্ন থেকেই এই প্রতিষ্ঠানটি কুরআন ও সুন্নাহর সঠিক জ্ঞান বিতরণে অগ্রণী ভূমিকা পালন করে আসছে। এখানে হিফজুল কুরআন থেকে শুরু করে দাওরায়ে হাদীস (মাস্টার্স) পর্যন্ত উচ্চতর ইসলামী শিক্ষার ব্যবস্থা রয়েছে।\n\nবর্তমানে এই মাদরাসাটি অত্র অঞ্চলের অন্যতম শ্রেষ্ঠ বিদ্যাপীঠ হিসেবে পরিচিতি লাভ করেছে, যেখান থেকে প্রতি বছর শত শত আলেম ও হাফেজ কামিয়াব হয়ে দেশ ও জাতির সেবায় নিয়োজিত হচ্ছেন।",
    "missionTitle": "আমাদের লক্ষ্য (Mission)",
    "missionContent": "আমাদের মূল লক্ষ্য হলো শিক্ষার্থীদের মধ্যে কুরআন ও সুন্নাহর গভীর জ্ঞান সঞ্চার করা এবং তাদের নৈতিক ও আধ্যাত্মিক চরিত্র গঠন করা। আমরা চাই এমন এক প্রজন্ম তৈরি করতে যারা ইসলামের সঠিক বার্তা বিশ্বব্যাপী ছড়িয়ে দেবে।",
    "visionTitle": "আমাদের উদ্দেশ্য (Vision)",
    "visionContent": "একটি আদর্শ ইসলামী সমাজ বিনির্মাণে দক্ষ ও যোগ্য আলেম তৈরি করা। আধুনিক বিশ্বের চ্যালেঞ্জ মোকাবেলায় সক্ষম এবং দ্বীনি মূল্যবোধে অটল একদল দাঈ তৈরি করা যারা সমাজের সকল স্তরে হেদায়েতের আলো জ্বালাবেন।",
    "principalQuote": "\"দ্বীনি শিক্ষা কেবল একটি পেশা নয়, এটি একটি আমানত। আমাদের মাদরাসা সেই আমানত রক্ষার জন্য নিরলস কাজ করে যাচ্ছে। আমরা চাই আমাদের ছাত্ররা কেবল কিতাবী বিদ্যায় পারদর্শী না হয়ে বরং আমলী জিন্দেগীতেও আদর্শ হবে।\"",
    "facilities": [
      { "title": "বিশাল লাইব্রেরি", "desc": "হাজারো কিতাবের সংগ্রহশালা", "icon": "book" },
      { "title": "আবাসিক ব্যবস্থা", "desc": "নিরাপদ ও উন্নত ছাত্রাবাস", "icon": "group" },
      { "title": "মসজিদ কমপ্লেক্স", "desc": "ইবাদত ও আমলের সুন্দর পরিবেশ", "icon": "mosque" },
      { "title": "খাবার হল", "desc": "স্বাস্থ্যসম্মত খাবারের ব্যবস্থা", "icon": "restaurant" }
    ]
  },
  "departments": [
    { "title": "হিফজুল কুরআন বিভাগ", "desc": "সহীহ ও সুন্দর তিলাওয়াতের মাধ্যমে পবিত্র কুরআন হিফজ করার অনন্য বিভাগ।", "icon": "menu_book" },
    { "title": "মাওলানা কোর্স (দাওরায়ে হাদীস)", "desc": "কুরআন, সুন্নাহ ও ইসলামী ফিকহ-এর উপর উচ্চতর গবেষণামূলক মাস্টার্স সমমানের কোর্স।", "icon": "school" },
    { "title": "ইফতা ও গবেষণা বিভাগ", "desc": "সমসাময়িক মাসআলা-মাসায়েল ও ফতোয়া প্রদানের বিশেষ প্রশিক্ষণ বিভাগ।", icon: "gavel" }
  ],
  "transactions": [
    { "id": 1, "date": "2026-03-01", "type": "income", "category": "দান-সদকা", "amount": 50000, "description": "মাসিক সাধারণ দান" },
    { "id": 2, "date": "2026-03-05", "type": "expense", "category": "বেতন", "amount": 35000, "description": "শিক্ষকদের মাসিক বেতন" },
    { "id": 3, "date": "2026-03-10", "type": "income", "category": "ভর্তি ফি", "amount": 15000, "description": "নতুন ছাত্রদের ভর্তি ফি" }
  ],
  "donationInfo": {
    "bankName": "ইসলামী ব্যাংক বাংলাদেশ লিমিটেড",
    "accountName": "জামি‘আ ইসলামিয়া শামসুল উলূম",
    "accountNumber": "২০৫০XXXXXXXXXXXXX",
    "branch": "বন্দর শাখা, নারায়ণগঞ্জ",
    "bkash": "০১৭XXXXXXXX",
    "nagad": "০১৭XXXXXXXX",
    "rocket": "০১৭XXXXXXXX"
  },
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

  // Add more test data for each class after sync
  const classesList = [
    "মক্কী", "মাদানী", 
    "খুসূসী", "ইবতেদায়ী", "মিজান", "মুতাওয়াসসিতাহ", "হেদায়াতুন নাহু", "সানাবিয়া", "সানাবিয়া উলিয়া", "ফজীলত ১", "ফজীলত ২", "তাকমীল",
    "নার্সারী", "প্রথম", "দ্বিতীয়", "তৃতীয়"
  ];

  let dataChanged = false;
  classesList.forEach((className, classIdx) => {
    for (let i = 1; i <= 5; i++) {
      const id = 2000 + classIdx * 10 + i;
      const roll = (100 + i).toString();
      const year = "2026";
      
      // Only add if not already present
      if (!(dbData.admissions as any).some((a: any) => a.studentNameBn === `${className} ছাত্র ${i}` && a.classToAdmit === className)) {
        (dbData.admissions as any).push({
          id: id,
          studentNameBn: `${className} ছাত্র ${i}`,
          fatherName: `Pita ${i}`,
          classToAdmit: className,
          status: "approved",
          roll: roll,
          contactNumber: `017000000${classIdx}${i}`,
          submittedAt: new Date().toISOString()
        });
        dataChanged = true;
      }

      if (!(dbData.results as any).some((r: any) => r.name === `${className} ছাত্র ${i}` && r.class === className)) {
        (dbData.results as any).push({
          id: id * 10,
          exam: "বার্ষিক পরীক্ষা",
          name: `${className} ছাত্র ${i}`,
          roll: roll,
          year: year,
          class: className,
          marks: {
            "ফিকহ": 70 + i * 5,
            "কুরআন": 80 + i * 2,
            "বাংলা": 60 + i * 4,
            "হাদীস": 75 + i * 3
          },
          total: 285 + i * 14,
          position: i,
          published: true,
          admissionId: id
        });
        dataChanged = true;
      }
    }
  });

  if (dataChanged) {
    await updateSupabase();
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
    console.log("Checking for super admin: mdrakibulislam827@gmail.com");
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", "mdrakibulislam827@gmail.com")
      .maybeSingle();

    if (error) {
      if (error.code === "42P01") {
        console.error("CRITICAL: 'users' table does not exist in Supabase. Please run the SQL setup.");
        return;
      }
      throw error;
    }

    if (!data) {
      console.log("Super admin not found. Creating super admin with password: admin123");
      const { error: insertError } = await supabase.from("users").insert([{
        email: "mdrakibulislam827@gmail.com",
        full_name: "Super Admin",
        password: "admin123",
        role: "super_admin",
        status: "approved"
      }]);
      if (insertError) console.error("Error creating super admin:", insertError);
    } else {
      console.log("Super admin found. Ensuring credentials (password: admin123)...");
      const { error: updateError } = await supabase.from("users").update({ 
        role: "super_admin", 
        status: "approved",
        password: "admin123" 
      }).eq("email", "mdrakibulislam827@gmail.com");
      if (updateError) console.error("Error updating super admin:", updateError);
    }

    // Also ensure admin@gmail.com exists for convenience
    const { data: adminData } = await supabase
      .from("users")
      .select("*")
      .eq("email", "admin@gmail.com")
      .maybeSingle();

    if (!adminData) {
      await supabase.from("users").insert([{
        email: "admin@gmail.com",
        full_name: "Admin",
        password: "admin123",
        role: "super_admin",
        status: "approved"
      }]);
    } else {
      await supabase.from("users").update({ 
        role: "super_admin", 
        status: "approved",
        password: "admin123" 
      }).eq("email", "admin@gmail.com");
    }
  } catch (err) {
    console.error("Error in ensureSuperAdmin:", err);
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

app.post("/api/results/bulk", async (req, res) => {
  const { newResults } = req.body;
  if (!dbData.results) dbData.results = [];
  dbData.results = [...dbData.results, ...newResults];
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/admission", async (req, res) => {
  dbData.admissionInfo = req.body.info;
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/about", async (req, res) => {
  dbData.about = req.body;
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/departments", async (req, res) => {
  dbData.departments = req.body;
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/transactions", async (req, res) => {
  dbData.transactions = req.body;
  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/donation", async (req, res) => {
  dbData.donationInfo = req.body;
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

  // Also update any associated results
  if (roll !== undefined && dbData.results) {
    dbData.results = dbData.results.map((r: any) => {
      if (r.admissionId === id) {
        return { ...r, roll };
      }
      return r;
    });
  }

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

  // Also update any associated results
  if (dbData.results) {
    dbData.results = dbData.results.map((r: any) => {
      if (r.admissionId === id) {
        return { ...r, photoUrl };
      }
      return r;
    });
  }

  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/admissions/update-roll", async (req, res) => {
  const { id, roll } = req.body;
  dbData.admissions = dbData.admissions.map((app: any) => 
    app.id === id ? { ...app, roll } : app
  );

  // Also update any associated results
  if (dbData.results) {
    dbData.results = dbData.results.map((r: any) => {
      if (r.admissionId === id) {
        return { ...r, roll };
      }
      return r;
    });
  }

  await updateSupabase();
  res.json({ success: true });
});

app.post("/api/admissions/update-student", async (req, res) => {
  const { id, studentData } = req.body;
  dbData.admissions = dbData.admissions.map((app: any) => 
    app.id === id ? { ...app, ...studentData } : app
  );
  
  // Also update any associated results
  if (dbData.results) {
    dbData.results = dbData.results.map((r: any) => {
      if (r.admissionId === id) {
        return { 
          ...r, 
          name: studentData.studentNameBn || r.name,
          fatherName: studentData.fatherName || r.fatherName,
          photoUrl: studentData.photoUrl || r.photoUrl
        };
      }
      return r;
    });
  }
  
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
  console.log(`Login attempt for: ${email}`);
  
  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .eq("password", password)
      .eq("status", "approved")
      .maybeSingle();

    if (error) {
      console.error("Supabase login error:", error);
      return res.status(500).json({ success: false, error: `সার্ভারে সমস্যা হচ্ছে: ${error.message}` });
    }

    if (user) {
      console.log(`Login successful for: ${email}`);
      res.json({ success: true, user: { email: user.email, role: user.role, name: user.full_name } });
    } else {
      console.log(`Login failed for: ${email} - User not found or not approved`);
      res.status(401).json({ success: false, error: "ভুল ইমেইল/পাসওয়ার্ড অথবা আপনার অ্যাকাউন্টটি এখনও অ্যাপ্রুভ করা হয়নি।" });
    }
  } catch (err) {
    console.error("Login exception:", err);
    res.status(500).json({ success: false, error: "সার্ভারে সমস্যা হচ্ছে।" });
  }
});

// Debug route to check if users are being created
app.get("/api/debug/users", async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("email, role, status");
    if (error) throw error;
    res.json({ count: data.length, users: data });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
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
  console.log(`Node version: ${process.version}`);
  try {
    const testFetch = await fetch("https://www.google.com", { method: "HEAD" }).catch(e => ({ ok: false, error: e }));
    if ('error' in testFetch) {
      console.error("Internet connectivity test failed:", testFetch.error);
    } else {
      console.log(`Internet connectivity test: ${testFetch.ok ? "Success" : "Failed"}`);
    }
  } catch (e) {
    console.error("Internet connectivity test exception:", e);
  }

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

  // Only listen if we're not in a serverless environment (like Vercel)
  if (process.env.VERCEL !== "1") {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
