require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log("Testing Supabase Connection...");
  console.log("URL:", supabaseUrl);
  
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error("❌ Connection failed or table missing:", error.message);
      if (error.code === 'PGRST116') {
          console.log("Tip: This might mean the table 'sessions' does not exist.");
      }
    } else {
      console.log("✅ Connection successful! Session count:", data);
    }
  } catch (err) {
    console.error("❌ Unexpected error:", err.message);
  }
}

testConnection();
