// khalid/src/lib/subabase.ts
import { createClient } from "@supabase/supabase-js";

// ✅ পরিবেশ ভেরিয়েবল চেক করুন
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing!');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
  
  // Fallback for development
  if (process.env.NODE_ENV === 'development') {
    console.warn('Running in development mode with dummy client');
  }
}

export const supabase = createClient(
  supabaseUrl || 'dummy-url-for-dev',
  supabaseAnonKey || 'dummy-key-for-dev'
);

export async function isAdmin() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return false;

    const { data } = await supabase
      .from("admin_users")
      .select("role")
      .eq("user_id", user.id)
      .single();

    return !!data;
  } catch (error) {
    console.error('Admin check error:', error);
    return false;
  }
}