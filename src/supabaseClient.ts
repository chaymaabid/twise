import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://relhbyrygwpjseeknvzy.supabase.co"; // ✅ Replace with your Supabase project URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbGhieXJ5Z3dwanNlZWtudnp5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5OTE3NTUsImV4cCI6MjA1NDU2Nzc1NX0.GLhuS54ESDYQhfhnYQ_KhY4Cf-SnIhSRN9KVTDCf-ZM"; // ✅ Replace with your Supabase anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
