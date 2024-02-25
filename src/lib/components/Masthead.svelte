<script lang="ts">
  import type { SubmitFunction } from '@sveltejs/kit';
  import { enhance } from '$app/forms';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores';

  let loading = false;

  const { supabase, user } = authStore;

  const signInWithGoogle: SubmitFunction = async ({ cancel }) => {
    loading = true;
    const success = await $supabase?.auth.signInWithOAuth({
      provider: 'google',
    });

    if (!success) {
      console.error('Error signing in with Google');
    }

    loading = false;
    cancel();
  };

  const handleSignOut: SubmitFunction = async ({ cancel }) => {
    loading = true;
    if ($supabase) {
      await $supabase.auth.signOut();
    }

    loading = false;

    authStore.logout();
    cancel();
    goto('/');
  };
</script>

<header>
  <h1>Recipe Retrieve</h1>

  {#if $user}
    <p>Logged in as {$user.email}</p>
    <form method="POST" action="/auth/logout" use:enhance={handleSignOut}>
      <button disabled={loading}>Sign Out</button>
    </form>
  {:else}
    <p>Lopgged out</p>
    <form action="/auth/login" method="POST" use:enhance={signInWithGoogle}>
      <button disabled={loading}>Log in with Google</button>
    </form>
  {/if}

  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/account">Account</a></li>
    <li><a href="/kitchen">Kitchen</a></li>
  </ul>
</header>
