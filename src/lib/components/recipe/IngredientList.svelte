<script lang="ts">
  import { enhance } from '$app/forms';
  import { StatefulSubmit, EditButton } from '$lib/components';
  import { MultiInput } from '$lib/ui';
  import type { Recipe } from '$userTypes';
  import type { SubmitFunction } from '@sveltejs/kit';

  export let editMode = false;
  export let ingredients: string[] = [];
  export let recipe: Recipe;

  let oldIngredients: string[] = [];
  let loading = false;

  const engageEditMode = () => {
    editMode = true;
    oldIngredients = [...ingredients];
  };

  const cancelEditMode = () => {
    editMode = false;
    ingredients = [...oldIngredients];
    oldIngredients = [];
  };

  const handleSaveIngredients: SubmitFunction = () => {
    loading = true;
    return async () => {
      editMode = false;
      loading = false;
      oldIngredients = [];
    };
  };
</script>

<h2 class="mb-3 fw-bold">
  Ingredients

  {#if !editMode}
    <EditButton label={`Edit ${recipe.title} ingredients`} on:triggerEdit={engageEditMode} />
  {/if}
</h2>

{#if editMode}
  <form
    action="?/updateIngredients"
    method="POST"
    class="edit-ingredients"
    use:enhance={handleSaveIngredients}>
    <MultiInput name="ingredients[]" addMore="Add ingredient" bind:values={ingredients} />

    <input type="hidden" name="recipeId" value={recipe.id} />
    <div>
      <StatefulSubmit buttonText="Update" {loading} />&nbsp;&nbsp;
      <button type="button" class="basic-link" on:click={cancelEditMode}>Cancel</button>
    </div>
  </form>
{:else}
  <ul class="unordered-list">
    {#each ingredients as ingredient}
      <li>{ingredient}</li>
    {/each}
  </ul>
{/if}

<style>
  .edit-ingredients {
    min-width: 320px;
  }
</style>
