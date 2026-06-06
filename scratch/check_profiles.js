import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

try {
  const { data, error } = await supabase.from("profiles").select("id, username, name, university");
  if (error) {
    console.error("❌ Error querying profiles:", error);
  } else {
    console.log("👥 Supabase profiles in database:", data);
  }
} catch (err) {
  console.error("❌ Catch error:", err);
}
