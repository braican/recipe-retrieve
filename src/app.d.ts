// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import { SupabaseClient, User, Session } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      getUser(): Promise<User | null>;
      getSession(): Promise<Session | null>;
    }
    interface PageData {
      user: User | null;
      session: Sessoin | null;
    }
    // interface Error {}
    // interface Platform {}
  }
}

export {};
