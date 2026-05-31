const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("❌ Missing Supabase URL or Anon Key in .env.local");
  process.exit(1);
}

// Simple URL validation
try {
  new URL(supabaseUrl);
} catch (e) {
  console.log(`❌ Invalid Supabase URL format: ${supabaseUrl}`);
  console.log("It should look like: https://abcdefghijklm.supabase.co");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkConnection() {
  console.log("Attempting to connect to Supabase...");
  // We can try to query a built-in table or just get the session
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.log("❌ Failed to connect:", error.message);
  } else {
    console.log("✅ Successfully connected to Supabase!");
  }
}

checkConnection();
