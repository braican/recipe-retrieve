<script lang="ts">
  import { dndzone } from 'svelte-dnd-action';
  import TrashIcon from '$lib/icons/trash.svg?raw';
  import type { Item, TransformDraggedElementFunction } from 'svelte-dnd-action';

  let itemList: HTMLTextAreaElement[] | HTMLInputElement[] = [];

  type AllowedInputTypes = 'text' | 'textarea';
  export let type: AllowedInputTypes = 'text';
  export let label = '';
  export let name = '';
  export let addMore = '';

  export let values: string[] = [];
  let mappedValues: Item[] = values.map((text, id) => ({ id, text }));

  const addValue = () => {
    values = [...values.filter(x => x), ''];
  };

  const focusOnInput = (node: HTMLInputElement | HTMLTextAreaElement) => {
    node.focus();
  };

  const handleSort = (event: CustomEvent) => {
    mappedValues = event.detail.items;
    values = mappedValues.map(({ text }) => text);
  };

  const transformDraggedElement: TransformDraggedElementFunction = (
    element: HTMLElement | undefined,
    draggedElementData: Item | undefined,
  ): void => {
    if (element) element.innerHTML = draggedElementData?.text;
  };
</script>

<fieldset class="group mb-3">
  {#if label}
    <legend class="label">{label}</legend>
  {/if}

  {#if values.length > 0}
    <div
      class="mb-2"
      use:dndzone={{ items: mappedValues, dropTargetStyle: {}, transformDraggedElement }}
      on:consider={handleSort}
      on:finalize={handleSort}>
      {#each mappedValues as value (value.id)}
        <div class="mb-1 item input-item">
          <button
            type="button"
            class="remove"
            on:click={() => (values = values.filter((x, j) => value.id !== j))}
            aria-label="Remove ingredient">
            {@html TrashIcon}
          </button>
          {#if type === 'textarea'}
            <textarea
              {name}
              rows="2"
              bind:value={value.text}
              bind:this={itemList[value.id]}
              use:focusOnInput></textarea>
          {:else}
            <input
              {name}
              type="text"
              bind:value={value.text}
              bind:this={itemList[value.id]}
              use:focusOnInput />
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <div class="align-right">
    <button type="button" class="button-secondary" on:click={addValue} aria-label={addMore}
      >+ {addMore}</button>
  </div>
</fieldset>

<style>
  .group {
    display: block;
    position: relative;
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
  .item:not(.ghost):before {
    content: '';
    background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxZW0iIGhlaWdodD0iMWVtIiB2aWV3Qm94PSIwIDAgMjU2IDI1NiI+PHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMTAyIDYwYTEwIDEwIDAgMSAxLTEwLTEwYTEwIDEwIDAgMCAxIDEwIDEwbTYyIDEwYTEwIDEwIDAgMSAwLTEwLTEwYTEwIDEwIDAgMCAwIDEwIDEwbS03MiA0OGExMCAxMCAwIDEgMCAxMCAxMGExMCAxMCAwIDAgMC0xMC0xMG03MiAwYTEwIDEwIDAgMSAwIDEwIDEwYTEwIDEwIDAgMCAwLTEwLTEwbS03MiA2OGExMCAxMCAwIDEgMCAxMCAxMGExMCAxMCAwIDAgMC0xMC0xMG03MiAwYTEwIDEwIDAgMSAwIDEwIDEwYTEwIDEwIDAgMCAwLTEwLTEwIi8+PC9zdmc+);
    background-size: 20px;
    width: 20px;
    height: 20px;
    display: block;
    margin-right: var(--sp-2);
    cursor: grab;
  }

  .remove {
    transition: color var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    padding: var(--sp-2);
    color: var(--c-gray-accent);
    order: 1;
  }

  .remove:hover {
    color: var(--c-gray-dark);
  }
</style>
