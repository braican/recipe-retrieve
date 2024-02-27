// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      session: Session | null;
    }
    interface PageData {
      session: Session | null;
      pageTitle: string | null;
    }
    // interface Error {}
    // interface Platform {}
  }

  interface Document {
    startViewTransition(updateCallback: () => Promise<void> | void): ViewTransition;
  }

  interface ViewTransition {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
    skipTransition(): void;
  }

  interface CSSStyleDeclaration {
    viewTransitionName: string;
  }
}

export {};
