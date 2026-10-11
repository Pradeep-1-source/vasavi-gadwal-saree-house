import { createClient } from '@supabase/supabase-js';

// Fallback to project credentials so Vercel and local dev connect seamlessly
const defaultUrl = 'https://dztidzyazvzrgrtvhqsd.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6dGlkenlhenZ6cmdydHZocXNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MzYzNjcsImV4cCI6MjEwNzMxMjM2N30.M1evrJIM5CBSWSmI-2PlX6PVi8VZwi_0qtfP8sBKJtM';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('https://') &&
  supabaseAnonKey.length > 20 &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
