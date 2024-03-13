<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { invalidate, onNavigate } from '$app/navigation';
  import { Masthead, Footer } from '$lib/components';
  import { authStore } from '$lib/stores';
  import '../styles/app.css';

  export let data;

  let { supabase, session, user } = data;
  $: ({ supabase, session, user } = data);

  authStore.session.set(session);
  authStore.supabase.set(supabase);
  authStore.user.set(user);

  onNavigate(navigation => {
    if (!document.startViewTransition) return;

    return new Promise(resolve => {
      document.startViewTransition(async () => {
        resolve();
        await navigation.complete;
      });
    });
  });

  onMount(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, _session) => {
      if (_session?.expires_at !== session?.expires_at) {
        invalidate('supabase:auth');
      }
    });

    return () => subscription.unsubscribe();
  });
</script>

<svelte:head>
  <title>{$page.data.pageTitle ? `${$page.data.pageTitle} | ` : ''}Recipe Retrieve</title>
</svelte:head>

<div class="app">
  <Masthead />

  <main class="p-2 app-content">
    <slot />
  </main>

  {#if !$page.route.id?.startsWith('/(protected)')}
    <Footer />
  {/if}
</div>

<style>
  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    padding-bottom: var(--sp-4);
  }

  .app-content {
    flex: 1;
  }
</style>
