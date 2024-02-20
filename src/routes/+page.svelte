<!-- src/routes/+page.svelte -->
<script lang="ts">
  import { Auth } from '@supabase/auth-ui-svelte';

  export let data;
</script>

<div>
  <div>
    <Auth
      supabaseClient={data.supabase}
      redirectTo={`${data.url}/auth/callback`}
      providers={['google']}
      showLinks={false} />
  </div>
</div>
