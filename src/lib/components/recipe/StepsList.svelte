<script lang="ts">
  import { enhance } from '$app/forms';
  import { StatefulSubmit, EditButton } from '$lib/components';
  import { MultiInput } from '$lib/ui';
  import type { Recipe } from '$userTypes';
  import type { SubmitFunction } from '@sveltejs/kit';

  export let editMode = false;
  export let steps: string[] = [];
  export let recipe: Recipe;

  let oldSteps: string[] = [];
  let loading = false;

  const engageEditMode = () => {
    editMode = true;
    oldSteps = [...steps];
  };

  const cancelEditMode = () => {
    editMode = false;
    steps = [...oldSteps];
    oldSteps = [];
  };

  const handleSaveSteps: SubmitFunction = () => {
    loading = true;
    return async () => {
      editMode = false;
      loading = false;
      oldSteps = [];
    };
  };
</script>

<h2 class="mb-3 fw-bold">
  Steps

  {#if !editMode}
    <EditButton label={`Edit ${recipe.title} steps`} on:triggerEdit={engageEditMode} />
  {/if}
</h2>

{#if editMode}
  <form action="?/updateSteps" method="POST" use:enhance={handleSaveSteps}>
    <MultiInput type="textarea" name="steps[]" addMore="Add step" bind:values={steps} />

    <input type="hidden" name="recipeId" value={recipe.id} />
    <div>
      <StatefulSubmit buttonText="Update" {loading} />&nbsp;&nbsp;
      <button type="button" class="basic-link" on:click={cancelEditMode}>Cancel</button>
    </div>
  </form>
{:else}
  <ol class="number-list">
    {#each steps as step}
      <li class="fs-1">{step}</li>
    {/each}
  </ol>
{/if}
