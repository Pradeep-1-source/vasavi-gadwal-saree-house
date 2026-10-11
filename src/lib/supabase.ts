import { createClient } from '@supabase/supabase-js';

// Fallback to project credentials so Vercel and local dev connect seamlessly
const defaultUrl = 'https://zugqrnlpdavhhsgqdqy.supabase.co';
const defaultAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z3FybmxwdmRhdmhoc2dxZHF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE3MDkyODEsImV4cCI6MjEwNzI4NTI4MX0.X2GhnFh1VHFRJQsqqw6D6qpEoTA_ZkgRtgk5RJ4mTDQ';

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
