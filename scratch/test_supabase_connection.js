import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key length:", supabaseAnonKey.length);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

try {
  const { data, error } = await supabase.from("profiles").select("id").limit(1);
  if (error) {
    console.error("❌ Supabase query error:", error);
  } else {
    console.log("✅ Supabase query success! Profiles sample:", data);
  }
} catch (err) {
  console.error("❌ Catch error:", err);
}
