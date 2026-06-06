import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const tables = ["profiles", "posts", "comments", "post_likes", "post_bookmarks", "reminders", "wallet_history", "notifications"];

for (const table of tables) {
  try {
    const { data, error } = await supabase.from(table).select("*").limit(1);
    if (error) {
      console.log(`Table "${table}": error`, error.code, error.message);
    } else {
      console.log(`Table "${table}" columns:`, data.length > 0 ? Object.keys(data[0]) : "No rows (cannot inspect keys via select)");
    }
  } catch (err) {
    console.log(`Table "${table}": catch error`, err);
  }
}
