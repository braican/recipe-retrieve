<!-- src/routes/account/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { authStore } from '$lib/stores';

  const { user } = authStore;
  let loading = false;

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    return async () => {
      loading = false;
    };
  };
</script>

{#if $user}
  <div>
    <form method="POST" action="/auth/logout">
      <button class="button" type="submit">Log out</button>
    </form>
    <form method="post" action="?/update">
      <div>
        <label for="email">Email</label>
        <input id="email" type="text" value={$user.email} disabled />
      </div>

      <div>
        <label for="fullName">Full Name</label>
        <input id="fullName" name="fullName" type="text" value={$user.fullName} />
      </div>

      <div>
        <input
          type="submit"
          class="button block primary"
          value={loading ? 'Loading...' : 'Update'}
          disabled={loading} />
      </div>
    </form>
  </div>
{/if}
