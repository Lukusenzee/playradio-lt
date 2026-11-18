import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL || 'https://supabase.co';
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Fu8FQmlUsEYtwEeENKYKLQ_KB-1AEZw';

export const supabase = createClient(url, key);
