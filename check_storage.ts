import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://qxwulyakfmogddwtwgob.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d3VseWFrZm1vZ2Rkd3R3Z29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTY4ODcsImV4cCI6MjA5MDI5Mjg4N30.CFbj9E_h5qi1rqV_43vLCsnREP4YWSD1Ou-IfXc8R60";
const supabase = createClient(supabaseUrl, supabaseKey);
supabase.storage.from("gallery").list().then(res => console.log(JSON.stringify(res.data)));
