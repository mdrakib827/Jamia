import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://bcxehzhddxqhpvqgwdkf.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjeGVoemhkZHhxaHB2cWd3ZGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNzIxNjIsImV4cCI6MjA5MDY0ODE2Mn0.wQNJjXw8S3UVC63XbZM37OgTC1IoIeaZXqo_mnZB_ds';

export const supabase = createClient(supabaseUrl, supabaseKey);
