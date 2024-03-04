<script lang="ts">
  import TrashIcon from '$lib/icons/trash.svg?raw';
  export let label = '';
  export let name = '';
  export let options: string[] = [];
  export let selected: string[] = [];

  let filteredOptions: string[] = [];
  let search = '';

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    search = target.value;
    filteredOptions = options.filter(option => option.toLowerCase().includes(search.toLowerCase()));
  };

  const handleSelection = (option: string) => {
    selected = [...selected, option];
    search = '';
    filteredOptions = [];
  };

  const deleteSelection = (option: string) => {
    selected = selected.filter(s => s !== option);
  };
</script>

<div class="form-group mb-3">
  {#if label}
    <span class="label">{label}</span>
  {/if}

  <input type="text" on:input={handleInput} value={search} />

  {#if search || (filteredOptions.length > 0 && search.length > 1)}
    <div class="completions">
      {#if search && !options.find(option => option.toLowerCase() === search.toLowerCase())}
        <button on:click={handleSelection.bind(null, search)} class="new-option" type="button"
          >Add {search}</button>
      {/if}

      {#if filteredOptions.length > 0 && search.length > 1}
        <ul class="completions-list">
          {#each filteredOptions as option}
            <li>
              <button
                on:click={handleSelection.bind(null, option)}
                class="select-option"
                type="button"
                aria-label={`Choose ${option}`}
                disabled={selected.includes(option)}>{option}</button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}

  {#if selected.length}
    <ul class="selecteds">
      {#each selected as option}
        <li>
          <input type="hidden" value={option} name={`${name}[]`} />
          <span class="pill">
            <span>{option}</span>
            <button
              class="remove-selected"
              aria-label={`Delete ${option}`}
              on:click={deleteSelection.bind(null, option)}>{@html TrashIcon}</button>
          </span>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .form-group {
    position: relative;
  }

  .completions {
    position: absolute;
    left: 0;
    background-color: var(--c-white);
    border: 1px solid var(--c-gray-accent);
    z-index: 2;
    width: 100%;
    border-radius: 0 0 var(--border-radius) var(--border-radius);
    font-size: var(--fs--1);
    overflow: hidden;
  }

  .new-option,
  .select-option {
    text-align: left;
    display: block;
    width: 100%;
    padding: var(--sp-2);
  }
  .new-option:hover,
  .select-option:hover {
    background-color: var(--c-gray);
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

  .selecteds {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-1);
    margin-top: var(--sp-1);
  }
</style>
