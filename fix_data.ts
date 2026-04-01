import fs from 'fs';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bcxehzhddxqhpvqgwdkf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjeGVoemhkZHhxaHB2cWd3ZGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzIxNjIsImV4cCI6MjA5MDY0ODE2Mn0.wQNJjXw8S3UVC63XbZM37OgTC1IoIeaZXqo_mnZB_ds";
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixData() {
  const data = JSON.parse(fs.readFileSync('data.json', 'utf-8'));
  
  // Fix broken images
  if (data.settings.logo && data.settings.logo.startsWith('/uploads/')) {
    data.settings.logo = "https://lh3.googleusercontent.com/aida-public/AB6AXuCMu0I0-nAJDaXwovvUL2h5E0lfJb2QiBph-NR8_oAyRv1Q3-fJBW3M1dnre4ZITR4zaTtV4uH14LW4Aqk26VWtc3leQbr6yRmlC4bZSBoV73fFaesFfXvjrQApCQWVTSW7pLrZy3Uw4MC27721dCQ9dcwyIxngTJrcVUISP_unAq58uXY1KWjGj-7sOnZA_CMs6rJPvuqIojqLt15Che6qnY2rl6rj2v-u9LtK8Ne_L4mQZSUZ3pf9MRJWgeYnSMid82DodR7LaKA7";
  }
  if (data.settings.heroImage && data.settings.heroImage.startsWith('/uploads/')) {
    data.settings.heroImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuBJcxE_WaNYk8wxz2Me4i9AQSv8iDrQualK7rRMUDTazl5k_4TdRwpFgNEVGvtc-wlzxpLmwlgITaQGqaNAhpZjavwNuWIM_-HYT-dBEVean4UsaYe6JgEivd4m7S9FlvixPIoFZhMdyeyhLl6yVBJKI4dv0WsDJNl-rdEbH5JN0Z-WETzTJRJgW03FfmwLaTOa4H-zq7fROrsW0PH1HqEWEIk6-aF98dsPt4bj1cB9FRrm4j-PSEanPh-bsOSUV4LTfoAukUxHTyRf";
  }
  
  data.teachers = data.teachers.map((t: any, idx: number) => {
    if (t.image && t.image.startsWith('/uploads/')) {
      t.image = `https://picsum.photos/seed/teacher${idx + 1}/200/200`;
    }
    return t;
  });

  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  
  const { error } = await supabase
    .from("app_data")
    .update({ content: data })
    .eq("id", 1);
    
  if (error) {
    console.error("Error updating Supabase:", error);
  } else {
    console.log("Data fixed and synced to Supabase.");
  }
}

fixData();
