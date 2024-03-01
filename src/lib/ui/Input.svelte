<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  type AllowedInputTypes = 'text' | 'url' | 'textarea';

  export let type: AllowedInputTypes = 'text';
  export let label = '';
  export let name = '';
  export let placeholder = '';

  export let value = '';

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    value = target.value;
  };
</script>

<label class="group mb-3">
  {#if label}
    <span class="label">{label}</span>
  {/if}

  {#if type === 'textarea'}
    <textarea {name} {placeholder} bind:value on:blur={() => dispatch('blur', { value })}
    ></textarea>
  {:else}
    <input
      {type}
      {name}
      {placeholder}
      {value}
      on:input={handleInput}
      on:blur={() => dispatch('blur', { value })} />
  {/if}
</label>

<style>
  .group {
    display: block;
  }

  .label {
    display: block;
    margin-bottom: 0.5em;
    font-size: var(--fs--1);
    font-weight: var(--fw-semibold);
  }

  .group input[type='text'],
  .group input[type='url'],
  .group textarea {
    width: 100%;
    font-size: 1rem;
    padding: 0.7em;
    border-radius: var(--border-radius);
    border: 1px solid var(--c-gray-accent);
    background-color: var(--c-gray);
  }
</style>
