<script lang="ts">
  import { authStore } from '$lib/stores';

  export let data;

  data.supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) {
      authStore.logout();
    }
  });
</script>

<slot />
