import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bcxehzhddxqhpvqgwdkf.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjeGVoemhkZHhxaHB2cWd3ZGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzIxNjIsImV4cCI6MjA5MDY0ODE2Mn0.wQNJjXw8S3UVC63XbZM37OgTC1IoIeaZXqo_mnZB_ds";
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing Supabase connection...");
  try {
    const { data, error } = await supabase.from("users").select("count").limit(1);
    if (error) {
      console.error("Connection failed:", error.message);
    } else {
      console.log("Connection successful!");
    }
  } catch (e) {
    console.error("Exception during connection test:", e);
  }
}

test();
