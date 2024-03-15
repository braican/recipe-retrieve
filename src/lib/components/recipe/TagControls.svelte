<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { enhance } from '$app/forms';
  import { PillList, StatefulSubmit } from '$lib/components';
  import { page } from '$app/stores';
  import { AutoInput } from '$lib/ui';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { Term, Recipe } from '$userTypes';

  const dispatch = createEventDispatcher();
  const { recipe } = $page.data;

  export let editMode = false;
  export let dbIngredients: Term[] = [];
  export let dbTags: Term[] = [];
  export let ingredients: Term[] =
    (recipe as Recipe).terms?.filter(({ taxonomy }) => taxonomy === 'Ingredients') ?? [];
  export let tags: Term[] =
    (recipe as Recipe).terms?.filter(({ taxonomy }) => taxonomy === 'Tags') ?? [];

  let loading = false;
  let newIngredients: Term[] = [...ingredients];
  let newTags: Term[] = [...tags];

  const handleSaveNewTags: SubmitFunction = () => {
    loading = true;

    return async () => {
      editMode = false;
      loading = false;
      ingredients = newIngredients;
      tags = newTags;
    };
  };

  const cancelEditMode = () => {
    dispatch('cancelEdit');
    newIngredients = [...newIngredients];
    newTags = [...tags];
  };
</script>

{#if editMode}
  <form action="?/updateTags" method="POST" class="mt-4" use:enhance={handleSaveNewTags}>
    <div class="form-columns">
      <AutoInput
        bind:selected={newIngredients}
        name="featuredIngredients"
        label="Featured Ingredients"
        options={dbIngredients} />
      <AutoInput bind:selected={newTags} label="Tags" name="tags" options={dbTags} />
    </div>

    <input type="hidden" name="recipeId" value={recipe.id} />

    <div>
      <StatefulSubmit buttonText="Update" {loading} />&nbsp;&nbsp;
      <button type="button" class="basic-link" on:click={cancelEditMode}>Cancel</button>
    </div>
  </form>
{:else}
  <div class="form-columns mt-4">
    {#if ingredients.length > 0}
      <div>
        <PillList pills={ingredients} title="Featured Ingredients" />
      </div>
    {/if}
    {#if tags.length > 0}
      <div>
        <PillList pills={tags} title="Tags" />
      </div>
    {/if}
  </div>
{/if}

<style>
  .form-columns {
    gap: var(--sp-4);
  }
</style>
