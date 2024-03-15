<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Icon } from '$lib/components';
  import PencilIcon from '$lib/icons/pencil.svg?raw';

  const dispatch = createEventDispatcher();

  export let label = 'Edit';
</script>

<button
  on:click={() => dispatch('triggerEdit')}
  class="edit-button"
  type="button"
  aria-label={label}>
  <Icon icon={PencilIcon} />
</button>

<style>
  .edit-button {
    transition: color var(--transition);
    width: 40px;
    vertical-align: middle;
    padding: var(--sp-2);
  }

  .edit-button:hover {
    color: var(--c-primary-dark);
  }
</style>
