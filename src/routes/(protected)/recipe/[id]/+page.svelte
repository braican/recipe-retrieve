<script lang="ts">
  import LeftArrowIcon from '$lib/icons/left-arrow.svg?raw';
  import PencilIcon from '$lib/icons/pencil.svg?raw';
  import { enhance } from '$app/forms';
  import { BackgroundImage, Icon, PillList, StatefulSubmit } from '$lib/components';
  import { IngredientList, StepsList } from '$lib/components/recipe';
  import { AutoInput } from '$lib/ui';
  import { authStore } from '$lib/stores';
  import type { Term } from '$userTypes';
  import type { SubmitFunction } from '@sveltejs/kit';

  export let data;
  const { session, supabase } = authStore;

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

  <header class="header" class:header-with-image={data.recipe.image_url}>
    <a class="back-link mb-2" href="/kitchen" aria-label="Back to the kitchen"
      >{@html LeftArrowIcon}</a>
    <h1 class="fs-4 fw-bold title">
      {data.recipe.title}

      {#if !editMode && data.recipe.user_id === $session?.user.id}
        <button
          on:click={engageEditMode}
          class="edit-recipe"
          type="button"
          aria-label={`Edit ${data.recipe.title} recipe`}><Icon icon={PencilIcon} /></button>
      {/if}
    </h1>
    {#if data.recipe.source_url}
      <a class="basic-link" href={data.recipe.source_url} target="_blank" rel="noopener">Source</a>
    {/if}
  </header>

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

  .header-with-image {
    margin-top: 5vh;
  }

  :global(.edit-recipe) {
    transition: color var(--transition);
    width: 40px;
    vertical-align: middle;
    padding: var(--sp-2);
  }

  :global(.edit-recipe:hover) {
    color: var(--c-primary-dark);
  }

  .form-columns {
    gap: var(--sp-4);
  }

  .recipe-instructions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-4);
  }

  .ingredients {
    flex: 0 1 auto;
    max-width: 312px;
  }
  .steps {
    flex: 1 1 60%;
    max-width: 768px;
  }
</style>
