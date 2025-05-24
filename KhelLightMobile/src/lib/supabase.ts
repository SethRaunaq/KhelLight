
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as Crypto from 'expo-crypto';

const SUPABASE_URL = "https://arkodghpsaxhoxbzvwce.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFya29kZ2hwc2F4aG94Ynp2d2NlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MTA4MTQsImV4cCI6MjA2MjE4NjgxNH0.mIL08pCT-QpKWGJklGGuynKaPqn1Yv0Nb9m8zfV9oVk";

console.log('Initializing Supabase with URL:', SUPABASE_URL);
console.log('Using Updated Anon Key:', SUPABASE_ANON_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event);
  console.log('Session:', session);
});

// Minimal fetch test with explicit logging
debugFetchTest();
async function debugFetchTest() {
  try {
    console.log('Starting minimal fetch test to Supabase...');
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    };
    console.log('Fetch test headers:', headers);
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers,
    });
    console.log('Fetch test response status:', response.status);
    let data;
    try {
      data = await response.json();
    } catch (jsonErr) {
      console.log('Fetch test: Could not parse JSON:', jsonErr);
      data = null;
    }
    console.log('Fetch test response data:', data);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Fetch test error:', error.message, error.stack);
    } else {
      console.error('Fetch test error:', error);
    }
  }
}

supabase
  .from('profiles')
  .select('*')
  .then(({ data, error }) => {
    if (error) {
      console.error('Error fetching profiles:', error.message);
    } else {
      console.log('Profiles data:', data);
    }
  });