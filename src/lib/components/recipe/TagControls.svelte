<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { PillList, StatefulSubmit } from '$lib/components';
  import { AutoInput } from '$lib/ui';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { Term } from '$userTypes';

  const dispatch = createEventDispatcher();
  const {
    recipe: { id, terms },
  } = $page.data;

  export let editMode = false;
  export let dbIngredients: Term[] = [];
  export let dbTags: Term[] = [];

  let ingredients = (terms as Term[])?.filter(({ taxonomy }) => taxonomy === 1) ?? [];
  let tags = (terms as Term[])?.filter(({ taxonomy }) => taxonomy === 2) ?? [];
  let loading = false;
  let localIngredients: Term[] = [...ingredients];
  let localTags: Term[] = [...tags];

  const handleSaveNewTags: SubmitFunction = () => {
    loading = true;

    return async () => {
      editMode = false;
      loading = false;
      ingredients = [...localIngredients];
      tags = [...localTags];
      dispatch('cancelEdit');
    };
  };

  const cancelEditMode = () => {
    dispatch('cancelEdit');
    localIngredients = [...ingredients];
    localTags = [...tags];
  };
</script>

{#if editMode}
  <form action="?/updateTags" method="POST" class="mt-4" use:enhance={handleSaveNewTags}>
    <div class="form-columns">
      <AutoInput
        bind:selected={localIngredients}
        label="Featured Ingredients"
        name="featuredIngredients"
        options={dbIngredients} />
      <AutoInput bind:selected={localTags} label="Tags" name="tags" options={dbTags} />
    </div>

    <input type="hidden" name="recipeId" value={id} />

    <div>
      <StatefulSubmit buttonText="Update" {loading} />&nbsp;&nbsp;
      <button type="button" class="basic-link" on:click={cancelEditMode}>Cancel</button>
    </div>
  </form>
{:else}
  <div class="form-columns mt-4">
    {#if localIngredients.length > 0}
      <div>
        <PillList pills={localIngredients} title="Featured Ingredients" />
      </div>
    {/if}
    {#if localTags.length > 0}
      <div>
        <PillList pills={localTags} title="Tags" />
      </div>
    {/if}
  </div>
{/if}

<style>
  .form-columns {
    gap: var(--sp-4);
  }
</style>
