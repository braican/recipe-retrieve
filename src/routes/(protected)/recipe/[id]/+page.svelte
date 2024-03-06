<script lang="ts">
  import LeftArrowIcon from '$lib/icons/left-arrow.svg?raw';
  import PencilIcon from '$lib/icons/pencil.svg?raw';
  import { enhance } from '$app/forms';
  import { BackgroundImage, Icon, PillList, StatefulSubmit } from '$lib/components';
  import { AutoInput } from '$lib/ui';
  import { authStore } from '$lib/stores';
  import type { Term } from '$userTypes';
  import type { SubmitFunction } from './$types';

  export let data;
  const { session, supabase } = authStore;

  let loading = false;
  let featuredIngredientList: Term[] = [];
  let tagList: Term[] = [];
  let newFeaturedIngredients: Term[] = [];
  let newTags: Term[] = [];

  let editMode = false;

  const engageEditMode = async () => {
    editMode = true;

    newFeaturedIngredients = data.recipe.featuredIngredients || [];
    newTags = data.recipe.tags || [];

    if ($supabase && featuredIngredientList.length === 0) {
      const dbIngredients = await $supabase.from('ingredients').select().returns<Term[]>();
      const dbTags = await $supabase.from('tags').select().returns<Term[]>();
      featuredIngredientList = dbIngredients?.data ?? [];
      tagList = dbTags?.data ?? [];
    }
  };

  const handleSaveNewTags: SubmitFunction = () => {
    loading = true;
    return async () => {
      editMode = false;
      loading = false;
      data.recipe.featuredIngredients = newFeaturedIngredients;
      data.recipe.tags = newTags;
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
          options={featuredIngredientList} />
        <AutoInput bind:selected={newTags} label="Tags" name="tags" options={tagList} />
      </div>

      <input type="hidden" name="recipeId" value={data.recipe.id} />

      <div>
        <StatefulSubmit buttonText="Update" {loading} />&nbsp;&nbsp;
        <button type="button" class="basic-link" on:click={cancelEditMode}>Cancel</button>
      </div>
    </form>
  {:else}
    <div class="form-columns mt-4">
      {#if data.recipe.featuredIngredients && data.recipe.featuredIngredients.length > 0}
        <div>
          <PillList pills={data.recipe.featuredIngredients} title="Featured Ingredients" />
        </div>
      {/if}
      {#if data.recipe.tags && data.recipe.tags.length > 0}
        <div>
          <PillList pills={data.recipe.tags} title="Tags" />
        </div>
      {/if}
    </div>
  {/if}

  <div class="recipe-instructions">
    <section class="mt-4 ingredients">
      <h2 class="mb-3 fw-bold">Ingredients</h2>

      <ul class="unordered-list">
        {#each data.recipe.ingredients as ingredient}
          <li>{ingredient}</li>
        {/each}
      </ul>
    </section>

    <section class="mt-4 steps">
      <h2 class="mb-3 fw-bold">Steps</h2>

      <ol class="number-list">
        {#each data.recipe.steps as step}
          <li class="fs-1">{step}</li>
        {/each}
      </ol>
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

  .edit-recipe {
    transition: color var(--transition);
    width: 40px;
    vertical-align: middle;
    padding: var(--sp-2);
  }

  .form-columns {
    gap: var(--sp-4);
  }

  .edit-recipe:hover {
    color: var(--c-primary-dark);
  }
  .recipe-instructions {
    display: flex;
    flex-wrap: wrap;
    gap: var(--sp-4);
  }

  .ingredients {
    flex: 0 1 auto;
  }
  .steps {
    flex: 1 1 60%;
    max-width: 768px;
  }
</style>
