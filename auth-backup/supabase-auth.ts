import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

// Client-side Supabase client with error handling
export const createSupabaseClient = () => {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase environment variables not configured properly');
      // Return a mock client that won't crash the app
      return null as any;
    }
    
    return createClientComponentClient<Database>();
  } catch (error) {
    console.error('Error creating Supabase client:', error);
    return null as any;
  }
};

// Server-side Supabase client
export const createServerSupabaseClient = () => {
  return createServerComponentClient<Database>({ cookies });
};

// Auth configuration
export const authConfig = {
  redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
  appearance: {
    theme: 'default',
    variables: {
      default: {
        colors: {
          brand: 'hsl(221.2 83.2% 53.3%)',
          brandAccent: 'hsl(221.2 83.2% 53.3%)',
        },
      },
    },
  },
  providers: ['google', 'github'],
};
