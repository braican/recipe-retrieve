<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import { authStore } from '$lib/stores';
  import { PillList, StatefulSubmit } from '$lib/components';
  import { AutoInput } from '$lib/ui';
  import type { SubmitFunction } from '@sveltejs/kit';
  import type { Term } from '$userTypes';

  const { supabase } = authStore;
  const dispatch = createEventDispatcher();
  const {
    recipe: { id, terms },
  } = $page.data;

  export let editMode = false;

  let ingredients = (terms as Term[])?.filter(({ taxonomy }) => taxonomy === 1) ?? [];
  let tags = (terms as Term[])?.filter(({ taxonomy }) => taxonomy === 2) ?? [];
  let cuisines = (terms as Term[])?.filter(({ taxonomy }) => taxonomy === 3) ?? [];
  let loading = false;
  let localIngredients: Term[] = [...ingredients];
  let localTags: Term[] = [...tags];
  let localCuisines: Term[] = [...cuisines];
  let dbIngredients: Term[] = [];
  let dbTags: Term[] = [];
  let dbCuisines: Term[] = [];

  $: {
    (async () => {
      if (
        editMode &&
        $supabase &&
        dbIngredients.length === 0 &&
        dbTags.length === 0 &&
        dbCuisines.length === 0
      ) {
        const terms = await $supabase
          .from('terms')
          .select()
          .in('taxonomy', [1, 2, 3])
          .returns<Term[]>();
        dbIngredients = terms?.data?.filter(({ taxonomy }) => taxonomy === 1) ?? [];
        dbTags = terms?.data?.filter(({ taxonomy }) => taxonomy === 2) ?? [];
      }
    })();
  }

  const handleSaveNewTags: SubmitFunction = () => {
    loading = true;

    return async () => {
      editMode = false;
      loading = false;
      ingredients = [...localIngredients];
      tags = [...localTags];
      cuisines = [...localCuisines];
      dispatch('cancelEdit');
    };
  };

  const cancelEditMode = () => {
    dispatch('cancelEdit');
    localIngredients = [...ingredients];
    localTags = [...tags];
    localCuisines = [...cuisines];
  };
</script>

{#if editMode}
  <form action="?/updateTags" method="POST" class="mt-4" use:enhance={handleSaveNewTags}>
    <input type="hidden" name="recipeId" value={id} />
    <div class="form-columns">
      <AutoInput
        bind:selected={localIngredients}
        label="Featured Ingredients"
        name="featuredIngredients"
        options={dbIngredients} />
      <AutoInput
        bind:selected={localCuisines}
        label="Cuisines"
        name="cuisines"
        options={dbCuisines} />
      <AutoInput bind:selected={localTags} label="Tags" name="tags" options={dbTags} />
    </div>
    <div>
      <StatefulSubmit buttonText="Update" {loading} />&nbsp;&nbsp;
      <button type="button" class="basic-link" on:click={cancelEditMode}>Cancel</button>
    </div>
  </form>
{:else}
  <div class="form-columns mt-4">
    <div>
      <PillList pills={localIngredients} title="Featured Ingredients" />
    </div>
    <div>
      <PillList pills={localCuisines} title="Cuisines" />
    </div>
    <div>
      <PillList pills={localTags} title="Tags" />
    </div>
  </div>
{/if}

<style>
  .form-columns {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--sp-3) var(--sp-4);
  }

  @media (max-width: 512px) {
    .form-columns {
      grid-template-columns: repeat(auto-fit, minmax(152px, 1fr));
    }
  }
</style>
