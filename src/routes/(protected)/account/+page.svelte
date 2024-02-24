<!-- src/routes/account/+page.svelte -->
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { SubmitFunction } from '@sveltejs/kit';
  import { authStore } from '$lib/stores';

  const { user } = authStore;

  export let form;
  let loading = false;

  const handleSubmit: SubmitFunction = () => {
    loading = true;
    return async () => {
      loading = false;
    };
  };
</script>

<div>
  <form method="post" action="?/update" use:enhance={handleSubmit}>
    <div>
      <label for="email">Email</label>
      <input id="email" type="text" value={$user?.email} disabled />
    </div>

    <div>
      <label for="fullName">Full Name</label>
      <input id="fullName" name="fullName" type="text" value={$user?.email} />
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
