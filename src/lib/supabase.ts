import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qxwulyakfmogddwtwgob.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4d3VseWFrZm1vZ2Rkd3R3Z29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTY4ODcsImV4cCI6MjA5MDI5Mjg4N30.CFbj9E_h5qi1rqV_43vLCsnREP4YWSD1Ou-IfXc8R60';

export const supabase = createClient(supabaseUrl, supabaseKey);
