<script lang="ts">
  import TrashIcon from '$lib/icons/trash.svg?raw';

  let itemList: HTMLTextAreaElement[] | HTMLInputElement[] = [];

  type AllowedInputTypes = 'text' | 'textarea';
  export let type: AllowedInputTypes = 'text';
  export let label = '';
  export let name = '';
  export let addMore = '';

  export let values: string[] = [];

  let mouseYCoordinate: number | null = null; // pointer y coordinate within client
  let distanceTopGrabbedVsPointer: number = 0;
  let draggingItem: string | null = null;
  let draggingItemIndex: number | null = null;
  let hoveredItemIndex: number | null = null;

  $: {
    if (
      draggingItemIndex !== null &&
      hoveredItemIndex !== null &&
      draggingItemIndex !== hoveredItemIndex
    ) {
      [values[draggingItemIndex], values[hoveredItemIndex]] = [
        values[hoveredItemIndex],
        values[draggingItemIndex],
      ];

      draggingItemIndex = hoveredItemIndex;
    }
  }

  const handleDragstart = (event: DragEvent, item: string, index: number) => {
    mouseYCoordinate = event.clientY;
    draggingItemIndex = index;
    draggingItem = item;
    distanceTopGrabbedVsPointer =
      (event?.target as HTMLElement).getBoundingClientRect().y - event.clientY;
  };

  const handleDrag = (event: DragEvent) => {
    mouseYCoordinate = event.clientY;
  };

  const handleDrop = (index: number) => {
    hoveredItemIndex = index;
  };

  const handleDragend = () => {
    draggingItem = null;
    hoveredItemIndex = null;
    distanceTopGrabbedVsPointer = 0;
  };

  const addValue = () => {
    values = [...values.filter(x => x), ''];
  };

  const focusOnInput = (node: HTMLInputElement | HTMLTextAreaElement) => {
    node.focus();
  };
</script>

<fieldset class="group mb-3">
  {#if label}
    <legend class="label">{label}</legend>
  {/if}

  {#if values.length > 0}
    {#if mouseYCoordinate && draggingItem}
      <div class="item ghost" style="top: {mouseYCoordinate + distanceTopGrabbedVsPointer}px;">
        {draggingItem}
      </div>
    {/if}
    <ul class="mb-2">
      {#each values as value, i}
        <li
          class="mb-1 item"
          class:invisible={draggingItem === value}
          draggable={true}
          on:dragstart={event => handleDragstart(event, value, i)}
          on:drag={handleDrag}
          on:drop={() => handleDrop(i)}
          on:dragover|preventDefault={() => handleDrop(i)}
          on:dragend={handleDragend}>
          <button
            type="button"
            class="remove"
            on:click={() => (values = values.filter((x, j) => i !== j))}
            aria-label="Remove ingredient">
            {@html TrashIcon}
          </button>
          {#if type === 'textarea'}
            <textarea
              {name}
              bind:value={values[i]}
              rows="2"
              bind:this={itemList[i]}
              use:focusOnInput></textarea>
          {:else}
            <input
              {name}
              type="text"
              bind:value={values[i]}
              bind:this={itemList[i]}
              use:focusOnInput />
          {/if}
        </li>
      {/each}
    </ul>
  {/if}

  <div class="align-right">
    <button type="button" class="button-secondary" on:click={addValue} aria-label={addMore}
      >+ {addMore}</button>
  </div>
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

  .ghost {
    margin-bottom: 10px;
    pointer-events: none;
    z-index: 99;
    position: absolute;
    top: 0;
    left: 10;
  }

  .invisible {
    opacity: 0;
  }
</style>
