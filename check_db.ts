import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://bcxehzhddxqhpvqgwdkf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjeGVoemhkZHhxaHB2cWd3ZGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzIxNjIsImV4cCI6MjA5MDY0ODE2Mn0.wQNJjXw8S3UVC63XbZM37OgTC1IoIeaZXqo_mnZB_ds";
const supabase = createClient(supabaseUrl, supabaseKey);
supabase.from("app_data").select("content").eq("id", 1).single().then(res => console.log(Object.keys(res.data.content)));
