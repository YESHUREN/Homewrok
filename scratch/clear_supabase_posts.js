const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Read .env file
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)\s*$/);
  if (match) {
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    env[match[1].trim()] = val;
  }
});

const supabaseUrl = env['SUPABASE_URL'];
const supabaseAnonKey = env['SUPABASE_ANON_KEY'];

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase credentials in .env file!");
  process.exit(1);
}

console.log("Connecting to Supabase at:", supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function clearPosts() {
  console.log("Deleting all posts from Supabase...");
  // Using gt filter on created_at or checking if id is not null to delete all posts
  const { data, error } = await supabase
    .from('posts')
    .delete()
    .gt('created_at', '1970-01-01T00:00:00Z');
  
  if (error) {
    console.error("Error deleting posts:", error);
  } else {
    console.log("Successfully deleted posts!");
  }
}

clearPosts();
