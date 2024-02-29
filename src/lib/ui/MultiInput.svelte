<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import TrashIcon from '$lib/icons/trash.svg?raw';
  const dispatch = createEventDispatcher();

  type AllowedInputTypes = 'text' | 'textarea';
  export let type: AllowedInputTypes = 'text';
  export let label = '';
  export let addMore = '';

  export let values: string[] = [];

  console.log(values);

  const addValue = () => {
    values = [...values.filter(x => x), ''];
  };
</script>

<fieldset class="group mb-3">
  {#if label}
    <legend class="label">{label}</legend>
  {/if}

  {#if values.length > 0}
    <ul class="mb-2">
      {#each values as value, i}
        <li class="mb-1 item">
          {#if type === 'textarea'}
            <textarea bind:value={values[i]} rows="2"></textarea>
          {:else}
            <input type="text" bind:value={values[i]} />
          {/if}

          <button
            type="button"
            class="remove"
            on:click={() => (values = values.filter((x, j) => i !== j))}
            aria-label="Remove ingredient">
            {@html TrashIcon}
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  <button type="button" class="button-secondary" on:click={addValue} aria-label={addMore}
    >+ {addMore}</button>
</fieldset>

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
  .group textarea {
    width: 100%;
    font-size: 1rem;
    padding: 0.7em;
    border-radius: var(--border-radius);
    border: 1px solid var(--c-gray-accent);
    background-color: var(--c-gray);
  }

  .item {
    display: flex;
    align-items: center;
  }

  .remove {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    padding: var(--sp-2);
    color: var(--c-gray-accent);
  }

  .remove:hover {
    color: var(--c-gray-dark);
  }
</style>
