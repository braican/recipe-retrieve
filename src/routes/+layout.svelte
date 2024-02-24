<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { invalidate } from '$app/navigation';
  import { Masthead } from '$lib/components';
  import { authStore } from '$lib/stores';
  import '../styles/app.css';

  export let data;

  let { supabase, session, user } = data;
  $: ({ supabase, session, user } = data);

  authStore.session.set(session);
  authStore.supabase.set(supabase);
  authStore.user.set(user);

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
  <title>Recipe Retrieve</title>
</svelte:head>

<div>
  <Masthead />

  <slot />
</div>
