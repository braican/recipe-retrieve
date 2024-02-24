import { writable } from 'svelte/store';
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { User } from '$userTypes';

const session = writable<Session | null>(null);
const user = writable<User | null>(null);
const supabase = writable<SupabaseClient | null>(null);

export default {
  session,
  supabase,
  user,
  logout: () => {
    session.set(null);
    supabase.set(null);
    user.set(null);
  },
};
