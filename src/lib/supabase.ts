import { createClient } from '@supabase/supabase-js';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'aka-platform-auth',
  },
  global: {
    headers: {
      'x-application-name': 'aka-platform',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  db: {
    schema: 'public',
  },
});

// Add error handling wrapper
export function handleSupabaseError<T>(response: PostgrestSingleResponse<T>): T {
  if (response.error) {
    console.error('Supabase error:', response.error);
    throw new Error(response.error.message || 'An error occurred while fetching data');
  }

  if (response.data === null) {
    throw new Error('No data returned from the database');
  }

  return response.data;
}
