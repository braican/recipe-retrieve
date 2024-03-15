<script lang="ts">
  import { enhance } from '$app/forms';
  import { BackgroundImage, PillList, StatefulSubmit } from '$lib/components';
  import { Header, IngredientList, StepsList } from '$lib/components/recipe';
  import { AutoInput } from '$lib/ui';
  import { authStore } from '$lib/stores';

  const { supabase } = authStore;

  import type { Term } from '$userTypes';
  import type { SubmitFunction } from '@sveltejs/kit';

  export let data;

  let loading = false;
  let dbIngredients: Term[] = [];
  let dbTags: Term[] = [];
  let featuredIngredients: Term[] =
    data.recipe.terms?.filter(({ taxonomy }) => taxonomy === 'Ingredients') ?? [];
  let tags: Term[] = data.recipe.terms?.filter(({ taxonomy }) => taxonomy === 'Tags') ?? [];
  let newFeaturedIngredients: Term[] = [];
  let newTags: Term[] = [];

  let editMode = false;

  const engageEditMode = async () => {
    editMode = true;
    newFeaturedIngredients = featuredIngredients;
    newTags = tags;

    if ($supabase && dbIngredients.length === 0 && dbTags.length === 0) {
      const terms = await $supabase.from('terms').select().in('taxonomy', [1, 2]).returns<Term[]>();
      dbIngredients = terms?.data?.filter(({ taxonomy }) => taxonomy === 1) ?? [];
      dbTags = terms?.data?.filter(({ taxonomy }) => taxonomy === 2) ?? [];
    }
  };

  const handleSaveNewTags: SubmitFunction = () => {
    loading = true;
    return async () => {
      editMode = false;
      loading = false;
      featuredIngredients = newFeaturedIngredients;
      tags = newTags;
    };
  };

  const cancelEditMode = () => {
    editMode = false;
    newTags = [];
    newFeaturedIngredients = [];
  };
</script>

<article class="recipe">
  {#if data.recipe.image_url}
    <BackgroundImage
      src={data.recipe.image_url}
      alt={data.recipe.title}
      height="20vh"
      opacity="0.8" />
  {/if}

  <Header {editMode} on:triggerEdit={engageEditMode} />

  {#if editMode}
    <form action="?/updateTags" method="POST" class="mt-4" use:enhance={handleSaveNewTags}>
      <div class="form-columns">
        <AutoInput
          bind:selected={newFeaturedIngredients}
          name="featuredIngredients"
          label="Featured Ingredients"
          options={dbIngredients} />
        <AutoInput bind:selected={newTags} label="Tags" name="tags" options={dbTags} />
      </div>

      <input type="hidden" name="recipeId" value={data.recipe.id} />

      <div>
        <StatefulSubmit buttonText="Update" {loading} />&nbsp;&nbsp;
        <button type="button" class="basic-link" on:click={cancelEditMode}>Cancel</button>
      </div>
    </form>
  {:else}
    <div class="form-columns mt-4">
      {#if featuredIngredients.length > 0}
        <div>
          <PillList pills={featuredIngredients} title="Featured Ingredients" />
        </div>
      {/if}
      {#if tags.length > 0}
        <div>
          <PillList pills={tags} title="Tags" />
        </div>
      {/if}
    </div>
  {/if}

  <div class="recipe-instructions">
    <section class="mt-4 ingredients">
      <IngredientList ingredients={data.recipe.ingredients} recipe={data.recipe} />
    </section>

    <section class="mt-4 steps">
      <StepsList steps={data.recipe.steps} recipe={data.recipe} />
    </section>
  </div>
</article>

<style>
  .recipe {
    padding-bottom: var(--sp-5);
  }

  .form-columns {
    gap: var(--sp-4);
  }

  @media (min-width: 640px) {
    .recipe-instructions {
      display: flex;
      gap: var(--sp-4);
    }
    .ingredients {
      flex: 1 0 30%;
      max-width: 360px;
      min-width: 260px;
    }
    .steps {
      flex: 1 1 60%;
      max-width: 768px;
    }
  }
</style>
