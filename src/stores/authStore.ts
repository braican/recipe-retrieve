import { writable } from 'svelte/store';
import type { SupabaseClient, Session } from '@supabase/supabase-js';

const session = writable<Session | null>(null);
const supabase = writable<SupabaseClient | null>(null);

export default {
  session,
  supabase,
  logout: () => {
    session.set(null);
    supabase.set(null);
  },
};
