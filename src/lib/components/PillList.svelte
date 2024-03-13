<script lang="ts">
  import TrashIcon from '$lib/icons/trash.svg?raw';
  import type { Term } from '$userTypes';

  export let title = '';
  export let pills: Term[] = [];
  export let name = '';
  export let canDelete = false;

  const deleteSelection = (term: Term) => {
    pills = pills.filter(s => s.title !== term.title);
  };
</script>

{#if title}
  <p class="fs--1"><strong>{title}</strong></p>
{/if}

<ul class="pill-list">
  {#each pills as pill}
    <li>
      <span class="pill">
        <span>{pill.title}</span>

        {#if canDelete}
          <input type="hidden" value={pill.id ?? pill.title} name={name ? `${name}[]` : null} />
          <button
            type="button"
            class="remove-selected"
            aria-label={`Delete ${pill.title}`}
            on:click={deleteSelection.bind(null, pill)}>{@html TrashIcon}</button>
        {/if}
      </span>
    </li>
  {/each}
</ul>

<style>
  .pill-list {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-1);
    margin-top: var(--sp-1);
  }

  .pill {
    display: flex;
    align-items: center;
    gap: var(--sp-1);
  }

  .remove-selected :global(svg) {
    width: 14px;
    display: block;
    height: auto;
  }
</style>
