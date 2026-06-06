import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

try {
  const { data, error } = await supabase.from("profiles").select("*").limit(1);
  if (error) {
    console.error("❌ Error selecting profiles:", error);
  } else {
    console.log("👥 Supabase profiles sample row keys:", data.length > 0 ? Object.keys(data[0]) : "No rows found");
  }
} catch (err) {
  console.error("❌ Catch error:", err);
}
