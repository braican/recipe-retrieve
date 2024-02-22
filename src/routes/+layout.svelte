<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import { goto, invalidate, invalidateAll } from '$app/navigation';
  import { onMount } from 'svelte';
  import '../styles/app.css';

  export let data;

  let loading = false;
  let { supabase, session } = data;
  $: ({ supabase, session } = data);

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

  const signInWithGoogle: SubmitFunction = async ({ cancel }) => {
    loading = true;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error signing in with Google', error);
    }

    loading = false;
    cancel();
  };

  const handleSignOut: SubmitFunction = async ({ cancel }) => {
    loading = true;
    if (session) {
      await supabase.auth.signOut();
    }

    loading = false;
    cancel();
    goto('/');
  };
</script>

<svelte:head>
  <title>Recipe Retrieve</title>
</svelte:head>

<div>
  <header>
    {#if data.session}
      <p>Logged in</p>

      <form method="POST" action="/auth/logout" use:enhance={handleSignOut}>
        <button disabled={loading}>Sign Out</button>
      </form>

      <!-- content here -->
    {:else}
      <p>Lopgged out</p>
      <form action="/auth/login" method="POST" use:enhance={signInWithGoogle}>
        <button disabled={loading}>Log in with Google</button>
      </form>

      <!-- <Auth
        supabaseClient={data.supabase}
        redirectTo={`${data.url}/auth/callback`}
        showLinks={false}
        providers={['google']}
        appearance={{ theme: ThemeSupa, style: { input: 'color: #fff' } }} /> -->
    {/if}
  </header>
  <slot />
</div>
