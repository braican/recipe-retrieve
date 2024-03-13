<script lang="ts">
  import { clickOutside } from '$lib/utils/actions';
  import { PillList } from '$lib/components';
  import type { Term } from '$userTypes';

  export let label = '';
  export let name = '';
  export let options: Term[] = [];
  export let selected: Term[] = [];
  let filteredOptions: Term[] = [];
  let search = '';
  let showCompletions = false;

  const clear = () => {
    search = '';
    filteredOptions = [];
    showCompletions = false;
  };

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    search = target.value;
    filteredOptions = options.filter(option =>
      option.title.toLowerCase().includes(search.toLowerCase()),
    );
    showCompletions = search.length > 0 || (filteredOptions.length > 0 && search.length > 1);
  };

  const handleSelection = (term: Term) => {
    selected = [...selected, term];
    clear();
  };
</script>

<div class="form-group mb-3">
  {#if label}
    <span class="label">{label}</span>
  {/if}

  <input type="text" on:input={handleInput} value={search} />

  {#if showCompletions}
    <div class="completions" use:clickOutside={clear}>
      {#if search && !options.find(option => option.title.toLowerCase() === search.toLowerCase())}
        <button
          on:click={handleSelection.bind(null, { title: search })}
          class="new-option"
          type="button">+ Add {search}</button>
      {/if}

      {#if filteredOptions.length > 0 && search.length > 1}
        <ul class="completions-list">
          {#each filteredOptions as option}
            <li>
              <button
                on:click={handleSelection.bind(null, option)}
                class="select-option"
                type="button"
                aria-label={`Choose ${option.title}`}
                disabled={selected.some(item => item.title === option.title)}
                >{option.title}</button>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {/if}

  {#if selected.length}
    <PillList bind:pills={selected} {name} canDelete />
  {/if}
</div>

<style>
  .form-group {
    position: relative;
  }

  .completions {
    position: absolute;
    left: 0;
    margin-top: -1px;
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
  .select-option:hover:not(:disabled) {
    background-color: var(--c-gray);
  }
</style>
