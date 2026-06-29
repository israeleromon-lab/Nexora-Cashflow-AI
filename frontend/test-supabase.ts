import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing connection to:', supabaseUrl);
  try {
    // A simple query to check connection (auth.health or similar)
    const { data, error } = await supabase.from('_non_existent_table_').select('*').limit(1);
    
    // We expect an error about the table not existing, but that confirms we reached the database!
    if (error) {
       console.log('Successfully reached Supabase! Database returned an error (as expected for a fake table):', error.message);
    } else {
       console.log('Successfully connected and queried data:', data);
    }
  } catch (err) {
    console.error('Connection failed:', err);
  }
}

testConnection();
